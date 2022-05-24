import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRangeFacet } from "./utility";
import {
  MdAddCircle as MoreIcon,
  MdFlip as FlipIcon,
  MdRemoveCircle as LessIcon,
  MdSort as SortIcon,
  MdSortByAlpha as AlphaSortIcon,
  MdWarning as WarningIcon,
} from "react-icons/md";
import { FaUndo as UndoIcon } from "react-icons/fa";
import {
  Button,
  LoadingOverlay,
  NumberInput,
  SegmentedControl,
  RadioGroup,
  Radio,
} from "@mantine/core";
import {
  DAYS_IN_DECADE,
  DAYS_IN_YEAR,
  FacetBuckets,
  Operation,
  removeCohortFilter,
  selectCurrentCohortFiltersByName,
  selectTotalCountsByName,
  updateCohortFilter,
  useCoreDispatch,
  useCoreSelector,
  GQLQueryItem,
  GQLIndexType,
} from "@gff/core";

import {
  DEFAULT_VISIBLE_ITEMS,
  convertFieldToName,
  getLowerAgeFromYears,
  getUpperAgeFromYears,
  getLowerAgeYears,
  getUpperAgeYears,
} from "./utils";
import { FacetCardProps } from "@/features/facets/types";
import {
  FacetItemTypeToCountsIndexMap,
  FacetItemTypeToLabelsMap,
} from "@/features/facets/hooks";

interface NumericFacetProps extends FacetCardProps {
  readonly rangeDatatype: string;
  readonly minimum?: number;
  readonly maximum?: number;
}

type NumericFacetData = Pick<
  NumericFacetProps,
  "field" | "minimum" | "maximum" | "itemType" | "indexType"
>;

interface RangeBucketElement {
  readonly from: number;
  readonly to: number;
  readonly key: string;
  readonly label: string;
  readonly valueLabel?: string;
  value?: number;
}

interface RangeValueSelectorProps {
  readonly itemsToShow: number;
  readonly field: string;
  readonly valueLabel: string;
  readonly rangeLabelsAndValues: Record<string, RangeBucketElement>;
  selected: string;
  setSelected: (value: string) => void;
}

type RangeFromOp = ">" | ">=";
type RangeToOp = "<" | "<=";

const WARNING_DAYS = Math.floor(90 * DAYS_IN_YEAR);

interface NumericRange {
  readonly fromOp?: RangeFromOp;
  readonly from?: number;
  readonly toOp?: RangeToOp;
  readonly to?: number;
}

const ExtractRangeValues = (filter?: Operation): NumericRange | undefined => {
  if (filter !== undefined) {
    switch (filter.operator) {
      case ">":
        return { from: filter.operand, fromOp: filter.operator };
      case ">=":
        return { from: filter.operand, fromOp: filter.operator };
      case "<":
        return { to: filter.operand, toOp: filter.operator };
      case "<=":
        return { to: filter.operand, toOp: filter.operator };
      case "and": {
        const a = ExtractRangeValues(filter.operands[0]);
        const b = ExtractRangeValues(filter.operands[1]);
        return { ...a, ...b };
      }
      default:
        return undefined;
    }
  } else {
    return undefined;
  }
};
/**
 * Given a range compute the key if possibly matches a predefined range
 * otherwise classify as "custom"
 * @param range - Range to classify
 * @param precision - number of values after .
 */
const ClassifyRangeType = (range?: NumericRange, precision = 1): string => {
  if (range === undefined) return "custom";
  if (
    range.fromOp == ">=" &&
    range.toOp == "<" &&
    range.from !== undefined &&
    range.to !== undefined
  )
    // builds a range "key"
    return `${range.from.toFixed(precision)}-${range.to.toFixed(precision)}`;

  return "custom";
};

/**
 * returns the range [from to] for a "bucket"
 * @param x - current bucket index
 * @param units - custom units for this range: "years" or "days"
 * @param minimum - starting value of range
 */
const buildDayYearRangeBucket = (
  x: number,
  units: string,
  minimum: number,
): RangeBucketElement => {
  const from = minimum + x * DAYS_IN_DECADE;
  const to = minimum + (x + 1) * DAYS_IN_DECADE;
  return {
    from: from,
    to: to,
    key: `${from.toFixed(1)}-${to.toFixed(1)}`,
    label: `\u2265 ${from / (units == "years" ? DAYS_IN_YEAR : 1)} to < ${
      to / (units == "years" ? DAYS_IN_YEAR : 1)
    } ${units}`,
  };
};

/**
 * returns 10 value range from from to to for a "bucket"
 * @param x - current bucket index
 * @param units string to append to label
 * @param minimum - staring value of range
 * @param fractionDigits - number of values to the right of the decimal point
 */
const build10UnitRange = (
  x: number,
  units: string,
  minimum: number,
  fractionDigits = 1,
): RangeBucketElement => {
  const from = minimum + x * 10;
  const to = minimum + (x + 1) * 10;
  return {
    from: from,
    to: to,
    key: `${from.toFixed(fractionDigits)}-${to.toFixed(fractionDigits)}`,
    label: `\u2265 ${from} to < ${to} ${units}`,
  };
};

/**
 * Builds an Dictionary like object contain the range and label for each "bucket" in the range
 * @param numBuckets
 * @param units
 * @param minimum
 * @param rangeFunction
 */
const BuildRanges = (
  numBuckets: number,
  units: string,
  minimum,
  rangeFunction: (
    index: number,
    units: string,
    startValue: number,
  ) => RangeBucketElement,
) => {
  // build the range for the useRangeFacet call
  return [...Array(numBuckets)]
    .map((x, i) => {
      return rangeFunction(i, units, minimum);
    })
    .reduce((r, x) => {
      r[x.key] = x;
      return r;
    }, {} as Record<string, RangeBucketElement>);
};

const buildRangeOperator = (
  field: string,
  rangeData: NumericRange,
): Operation | undefined => {
  // couple of different cases
  // * no from/to return undefined
  if (rangeData.from === undefined && rangeData.to === undefined)
    return undefined;

  const fromOperation: Operation =
    rangeData.from !== undefined
      ? {
          field: field,
          operator: rangeData.fromOp,
          operand: rangeData.from,
        }
      : undefined;
  const toOperation: Operation =
    rangeData.to !== undefined
      ? {
          field: field,
          operator: rangeData.toOp,
          operand: rangeData.to,
        }
      : undefined;

  if (fromOperation && toOperation)
    return { operator: "and", operands: [fromOperation, toOperation] };
  if (fromOperation) return fromOperation;
  return toOperation;
};

/**
 * Create a list of radio buttons where each line
 * represents bucket for a range > "from" <= "to"
 * @param numBuckets: number of buckets to consider
 * @param field: name of field this range id for
 */

const RangeValueSelector: React.FC<RangeValueSelectorProps> = ({
  field,
  valueLabel,
  selected,
  setSelected,
  rangeLabelsAndValues,
  itemsToShow,
}: RangeValueSelectorProps) => {
  const coreDispatch = useCoreDispatch();

  const [isSortedByValue, setIsSortedByValue] = useState(false);

  const handleSelection = (rangeKey) => {
    const data: NumericRange = {
      from: rangeLabelsAndValues[rangeKey].from,
      to: rangeLabelsAndValues[rangeKey].to,
      fromOp: ">=",
      toOp: "<",
    };
    const rangeFilters = buildRangeOperator(field, data);
    coreDispatch(updateCohortFilter({ field: field, operation: rangeFilters }));
    setSelected(rangeKey);
    console.log("handleSelection:", rangeKey, rangeFilters);
  };

  if (rangeLabelsAndValues === undefined) return null;

  return (
    <div className="flex flex-col">
      {Object.keys(rangeLabelsAndValues).length > 1 ? (
        <div className="flex flex-row items-center justify-between flex-wrap border-b-1 py-1">
          <button
            className={
              "ml-0.5 border rounded-sm border-nci-gray-darkest bg-nci-gray hover:bg-nci-gray-lightest text-white hover:text-nci-gray-darker"
            }
            aria-label="Sort alphabetically"
          >
            <AlphaSortIcon
              onClick={() => setIsSortedByValue(false)}
              scale="1.5em"
            />
          </button>
          <div className={"flex flex-row items-center "}>
            <button
              onClick={() => setIsSortedByValue(true)}
              className={
                "border rounded-sm border-nci-gray-darkest bg-nci-gray hover:bg-nci-gray-lightest text-white hover:text-nci-gray-darker transition-colors"
              }
              aria-label="Sort numerically"
            >
              <SortIcon scale="1.5em" />
            </button>
            <p className="px-2 mr-3">{valueLabel}</p>
          </div>
        </div>
      ) : null}
      <div role="group" className="mt-1">
        {Object.keys(rangeLabelsAndValues)
          .slice(0, itemsToShow)
          .sort(
            isSortedByValue
              ? (a, b) =>
                  rangeLabelsAndValues[b].value - rangeLabelsAndValues[a].value
              : (a, b) =>
                  rangeLabelsAndValues[a].label.localeCompare(
                    rangeLabelsAndValues[b].label,
                  ),
          )
          .map((rangeKey, i) => {
            return (
              <div
                key={`${field}_${rangeKey}`}
                className="flex flex-row justify-start items-center form-check mb-1"
              >
                <input
                  type="radio"
                  id={`${field}_${rangeKey}_${i}`}
                  name={`${field}_range_selection`}
                  value={rangeKey}
                  checked={rangeKey === selected}
                  className="form-radio mr-1"
                  onChange={() => handleSelection(rangeKey)}
                />
                <span>{rangeLabelsAndValues[rangeKey].label}</span>
                <span className="ml-auto">
                  {rangeLabelsAndValues[rangeKey].valueLabel}
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
};

interface FromToProps {
  readonly minimum: number;
  readonly maximum: number;
  readonly units: string;
  readonly values?: NumericRange;
  readonly changedCallback?: () => void;
  readonly field: string;
}

const FromTo: React.FC<FromToProps> = ({
  field,
  minimum,
  maximum,
  values,
  changedCallback = () => null,
  units = "years",
}: FromToProps) => {
  const unitsLabel = "%" != units ? ` ${units}` : "%";
  const [fromOp, setFromOp] = useState(values?.fromOp ?? ">=");
  const [fromValue, setFromValue] = useState(values?.from);
  const [toOp, setToOp] = useState(values?.toOp ?? "<");
  const [toValue, setToValue] = useState(values?.to);
  const [isWarning, setIsWarning] = useState(false);
  const coreDispatch = useCoreDispatch();

  useEffect(() => {
    setFromOp(values?.fromOp ?? ">=");
    setFromValue(values?.from);
    setToOp(values?.toOp ?? "<");
    setToValue(values?.to);
  }, [values]);

  useEffect(() => {
    if (["diagnoses.age_at_diagnosis"].includes(field)) {
      if (toValue >= WARNING_DAYS || fromValue >= WARNING_DAYS)
        setIsWarning(true);
      else setIsWarning(false);
    }
  }, [field, toValue, fromValue]);

  /**
   * Handle Apply button which will add/update/remove a range filter to the field.
   * In the case of units == years the value is converted to days as needed
   * for the filters
   */
  const handleApply = () => {
    const data = {
      fromOp: fromOp as RangeFromOp,
      from: fromValue,
      toOp: toOp as RangeToOp,
      to: toValue,
    };
    const rangeFilters = buildRangeOperator(field, data);
    if (rangeFilters === undefined) {
      coreDispatch(removeCohortFilter(field));
    } else {
      coreDispatch(
        updateCohortFilter({ field: field, operation: rangeFilters }),
      );
    }
  };
  return (
    <div className="relative p-1">
      <div className="flex flex-col text-nci-gray-dark text-md ">
        <div className="flex flex-row justify-end items-center flex-nowrap border">
          <div className="basis-1/5 text-center">From</div>
          <SegmentedControl
            className="basis-2/5"
            size="sm"
            value={fromOp}
            onChange={(value) => {
              setFromOp(value as RangeFromOp);
              changedCallback();
            }}
            data={[
              { label: "\u2265", value: ">=" },
              { label: ">", value: ">" },
            ]}
            aria-label="select greater and equal or greater than"
          />
          <NumberInput
            className="basis-2/5 text-sm"
            placeholder={`eg. ${minimum}${unitsLabel} `}
            min={minimum}
            max={maximum}
            value={units !== "years" ? fromValue : getLowerAgeYears(fromValue)}
            onChange={(value) => {
              units !== "years"
                ? setFromValue(value)
                : setFromValue(getLowerAgeFromYears(value));
              changedCallback();
            }}
            hideControls
            aria-label="input from value"
          />
        </div>
        <div className="flex flex-row mt-1 justify-center items-center flex-nowrap border ">
          <div className="basis-1/5 text-center">To</div>
          <SegmentedControl
            className="basis-2/5"
            size="sm"
            value={toOp}
            onChange={(value) => {
              setToOp(value as RangeToOp);
              changedCallback();
            }}
            data={[
              { label: "\u2264", value: "<=" },
              { label: "<", value: "<" },
            ]}
            aria-label="select less or less than and equal"
          />
          <NumberInput
            className="basis-2/5"
            placeholder={`eg. ${maximum}${unitsLabel} `}
            min={minimum}
            max={maximum}
            onChange={(value) => {
              units !== "years"
                ? setToValue(value)
                : setToValue(getUpperAgeFromYears(value));
              changedCallback();
            }}
            value={units !== "years" ? toValue : getUpperAgeYears(toValue)}
            hideControls
            aria-label="input to value"
          />
        </div>
        {isWarning ? (
          <div className="bg-nci-yellow-lighter round-md border-nci-yellow-light">
            <span>
              {" "}
              <WarningIcon size="24px" />
              {`For health information privacy concerns, individuals over 89
                    will all appear as 90 years old. For more information, click `}
              <a
                href="https://gdc.cancer.gov/about-gdc/gdc-faqs#collapsible-item-618-question"
                rel="noopener noreferrer"
                target="_blank"
              >
                here
              </a>
              .
            </span>
          </div>
        ) : null}
        <div className={"flex flex-row mt-1"}>
          <Button onClick={handleApply}>Apply</Button>
        </div>
      </div>
    </div>
  );
};

interface FacetExpanderProps {
  readonly remainingValues: number;
  readonly isGroupExpanded: boolean;
  readonly onShowChanged: (v: boolean) => void;
}

const FacetExpander: React.FC<FacetExpanderProps> = ({
  remainingValues,
  isGroupExpanded,
  onShowChanged,
}: FacetExpanderProps) => {
  return (
    <div className={"mt-3"}>
      {remainingValues > 0 && !isGroupExpanded ? (
        <div className="flex flex-row justify-end items-center border-t-2 p-1.5">
          <MoreIcon
            key="show-more"
            size="1.5em"
            className="text-nci-gray-darkest"
            onClick={() => onShowChanged(!isGroupExpanded)}
          />
          <div className="pl-1 text-nci-gray-darkest">
            {" "}
            {remainingValues} more
          </div>
        </div>
      ) : isGroupExpanded ? (
        <div className="flex flex-row justify-end items-center border-t-2 border-b-0 border-r-0 border-l-0 p-1.5">
          <LessIcon
            key="show-less"
            size="1.5em"
            className="text-nci-gray-darkest"
            onClick={() => onShowChanged(!isGroupExpanded)}
          />
          <div className="pl-1 text-nci-gray-darkest"> show less</div>
        </div>
      ) : null}
    </div>
  );
};

const BuildRangeLabelsAndValues = (
  bucketRanges: Record<string, any>,
  totalCount: number,
  rangeData?: FacetBuckets,
  showZero = true,
) => {
  return Object.keys(bucketRanges).reduce((b, x) => {
    if (!showZero && rangeData && rangeData[x] == 0) return b;

    b[x] = {
      ...bucketRanges[x],
      key: x,
      value: rangeData ? rangeData[x] : undefined,
      valueLabel: rangeData
        ? `${rangeData[x]} (${(((rangeData[x] as number) / totalCount) * 100)
            .toFixed(2)
            .toLocaleString()}%)`
        : "",
    };
    return b;
  }, {} as Record<string, RangeBucketElement>);
};

interface RangeInputWithPrefixedRangesProps {
  readonly field: string;
  readonly numBuckets: number;
  readonly itemType: GQLQueryItem;
  readonly indexType: GQLIndexType;
  readonly minimum: number;
  readonly maximum: number;
  readonly units: string;
  readonly showZero?: boolean;
}

const RangeInputWithPrefixedRanges: React.FC<RangeInputWithPrefixedRangesProps> =
  ({
    field,
    itemType,
    indexType,
    units,
    numBuckets,
    minimum,
    maximum,
    showZero = false,
  }: RangeInputWithPrefixedRangesProps) => {
    const [isGroupExpanded, setIsGroupExpanded] = useState(false); // handles the expanded group

    // get the current filter for this facet
    const filter = useCoreSelector((state) =>
      selectCurrentCohortFiltersByName(state, field),
    );

    const totalCount = useCoreSelector((state) =>
      selectTotalCountsByName(state, FacetItemTypeToCountsIndexMap[itemType]),
    );

    // giving the filter value, extract the From/To values and
    // build it's key
    const [filterValues, filterKey] = useMemo(() => {
      const filterValues = ExtractRangeValues(filter);
      const filterKey = ClassifyRangeType(filterValues);
      return [filterValues, filterKey];
    }, [filter]);

    // build the range for the useRangeFacet and the facet query
    const [bucketRanges, ranges] = useMemo(() => {
      // map unit type to appropriate build range function and unit label
      const RangeBuilder = {
        days: {
          builder: buildDayYearRangeBucket,
          label: "days",
        },
        years: {
          builder: buildDayYearRangeBucket,
          label: "years",
        },
        percent: {
          builder: build10UnitRange,
          label: "%",
        },
        year: {
          builder: build10UnitRange,
          label: "",
        },
      };

      const bucketRanges = BuildRanges(
        numBuckets,
        RangeBuilder[units].label,
        minimum,
        RangeBuilder[units].builder,
      );
      // build ranges for continuous range query
      const ranges = Object.keys(bucketRanges).map((x) => {
        return { from: bucketRanges[x].from, to: bucketRanges[x].to };
      });
      return [bucketRanges, ranges];
    }, [minimum, numBuckets, units]);

    const [isCustom, setIsCustom] = useState(filterKey === "custom"); // in custom Range Mode
    const [selectedRange, setSelectedRange] = useState(filterKey);

    const { data: rangeData, isSuccess } = useRangeFacet(
      field,
      ranges,
      itemType,
      indexType,
    );
    const rangeLabelsAndValues = BuildRangeLabelsAndValues(
      bucketRanges,
      totalCount,
      rangeData,
      showZero,
    );

    const resetToCustom = useCallback(() => {
      if (!isCustom) {
        setIsCustom(true);
        setSelectedRange("custom");
      }
    }, [isCustom]);

    useEffect(() => {
      if (!isCustom)
        if (Object.keys(rangeLabelsAndValues).includes(filterKey))
          setSelectedRange(filterKey);
        else resetToCustom();
    }, [filterKey, isCustom, rangeLabelsAndValues, resetToCustom]);

    const totalBuckets = Object.keys(rangeLabelsAndValues).length;
    const bucketsToShow = isGroupExpanded
      ? totalBuckets
      : DEFAULT_VISIBLE_ITEMS;
    const remainingValues = totalBuckets - bucketsToShow;

    const onShowModeChanged = () => {
      setIsGroupExpanded(!isGroupExpanded);
    };

    return (
      <div className="flex flex-col w-100 space-y-2  mt-1 ">
        <LoadingOverlay visible={!isSuccess} />
        <div className="flex flex-row justify-between items-center">
          <input
            type="radio"
            className="form-check-input mr-4"
            id={`${field}_custom`}
            name={`${field}_range_selection`}
            checked={selectedRange === "custom"}
            onChange={() => {
              setSelectedRange("custom");
              setIsCustom(true);
            }}
          />
          <FromTo
            minimum={minimum}
            maximum={maximum}
            values={filterValues}
            field={field}
            units={units}
            changedCallback={resetToCustom}
          />
        </div>
        <div className="flex flex-col border-t-2">
          {totalBuckets == 0 ? (
            <div className="mx-4">No data for this field</div>
          ) : isSuccess ? (
            <RangeValueSelector
              field={field}
              valueLabel={FacetItemTypeToLabelsMap[itemType]}
              itemsToShow={bucketsToShow}
              rangeLabelsAndValues={rangeLabelsAndValues}
              selected={selectedRange}
              setSelected={(value) => {
                setIsCustom(false); // no longer a customRange
                // this is the only way user interaction
                // can set this to False
                setSelectedRange(value);
                console.log("setIsCustom to false");
              }}
            />
          ) : null}
          {
            <FacetExpander
              remainingValues={remainingValues}
              isGroupExpanded={isGroupExpanded}
              onShowChanged={onShowModeChanged}
            />
          }
        </div>
      </div>
    );
  };

const DaysOrYears: React.FC<NumericFacetData> = ({
  field,
  itemType,
  indexType,
  minimum = undefined,
  maximum = undefined,
}: NumericFacetData) => {
  const [units, setUnits] = useState("years");

  let adjMinimum = minimum != undefined ? minimum : 0;
  let adjMaximum = maximum != undefined ? maximum : 32872;
  const numBuckets = Math.round((adjMaximum - adjMinimum) / DAYS_IN_DECADE);
  adjMinimum =
    Math.round(10 * (adjMinimum / (units == "years" ? DAYS_IN_YEAR : 1))) / 10;
  adjMaximum =
    Math.round(10 * (adjMaximum / (units == "years" ? DAYS_IN_YEAR : 1))) / 10;

  return (
    <div className="flex flex-col w-100 space-y-2 px-2  mt-1 ">
      <SegmentedControl
        data={[
          { label: "Days", value: "days" },
          { label: "Years", value: "years" },
        ]}
        value={units}
        onChange={setUnits}
      />
      <RangeInputWithPrefixedRanges
        units={units}
        minimum={adjMinimum}
        maximum={adjMaximum}
        numBuckets={numBuckets}
        field={field}
        itemType={itemType}
        indexType={indexType}
      />
    </div>
  );
};

const Year: React.FC<NumericFacetData> = ({
  field,
  itemType,
  indexType,
  minimum = undefined,
  maximum = undefined,
}: NumericFacetData) => {
  const adjMinimum = minimum != undefined ? minimum : 1900;
  const adjMaximum = maximum != undefined ? maximum : 2050;
  const numBuckets = Math.round((adjMaximum - adjMinimum) / 10);

  return (
    <div className="flex flex-col w-100 space-y-2 px-2  mt-1 ">
      <RangeInputWithPrefixedRanges
        itemType={itemType}
        indexType={indexType}
        units="year"
        minimum={adjMinimum}
        maximum={adjMaximum}
        numBuckets={numBuckets}
        field={field}
      />
    </div>
  );
};

const Years: React.FC<NumericFacetData> = ({
  field,
  itemType,
  indexType,
  minimum = undefined,
  maximum = undefined,
}: NumericFacetData) => {
  const adjMinimum = minimum != undefined ? minimum : 0;
  const adjMaximum = maximum != undefined ? maximum : 89;
  const numBuckets = Math.round((adjMaximum - adjMinimum) / 10);

  return (
    <div className="flex flex-col w-100 space-y-2 px-1  mt-1 ">
      <RangeInputWithPrefixedRanges
        itemType={itemType}
        indexType={indexType}
        units="years"
        minimum={adjMinimum}
        maximum={adjMaximum}
        numBuckets={numBuckets}
        field={field}
      />
    </div>
  );
};

const NumericRange: React.FC<NumericFacetData> = ({
  field,
  minimum = undefined,
  maximum = undefined,
}: NumericFacetData) => {
  const adjMinimum = minimum != undefined ? minimum : 0;
  const adjMaximum = maximum != undefined ? maximum : 999999;
  return (
    <div>
      <FromTo
        field={field}
        minimum={adjMinimum}
        maximum={adjMaximum}
        units=""
      />
    </div>
  );
};

const PercentRange: React.FC<NumericFacetData> = ({
  field,
  itemType,
  indexType,
  minimum = undefined,
  maximum = undefined,
}: NumericFacetData) => {
  const adjMinimum = minimum != undefined ? minimum : 0;
  const adjMaximum = maximum != undefined ? maximum : 100;
  const numBuckets = Math.round((adjMaximum - adjMinimum) / 10);

  return (
    <div className="flex flex-col w-100 space-y-2 px-2  mt-1 ">
      <RangeInputWithPrefixedRanges
        itemType={itemType}
        indexType={indexType}
        units="percent"
        minimum={adjMinimum}
        maximum={adjMaximum}
        numBuckets={numBuckets}
        field={field}
      />
    </div>
  );
};

const NumericRangeFacet: React.FC<NumericFacetProps> = ({
  field,
  rangeDatatype,
  itemType,
  description,
  minimum = undefined,
  maximum = undefined,
  facetName = null,
  indexType = "explore",
}: NumericFacetProps) => {
  const [isFacetView, setIsFacetView] = useState(true);
  const coreDispatch = useCoreDispatch();

  const clearFilters = () => {
    coreDispatch(removeCohortFilter(field));
  };

  const toggleFlip = () => {
    setIsFacetView(!isFacetView);
  };

  return (
    <div>
      <div className="flex flex-col w-64 bg-white relative shadow-lg border-nci-gray-lightest border-1 rounded-b-md text-xs transition">
        <div className="flex items-center justify-between flex-wrap bg-nci-gray-lighter px-1.5">
          <div className="has-tooltip text-nci-gray-darkest font-heading font-semibold text-md">
            {facetName === null ? convertFieldToName(field) : facetName}
            <div className="inline-block tooltip w-full border-b-2 border-nci-cyan-lightest rounded shadow-lg p-2 bg-gray-100 text-nci-blue-darkest mt-8 absolute">
              {description}
            </div>
          </div>
          <div className="flex flex-row">
            <button
              className="bg-nci-gray-lighter hover:bg-grey text-grey-darkest font-bold py-2 px-4 rounded inline-flex items-center"
              onClick={toggleFlip}
            >
              <FlipIcon />
            </button>
            <button
              className="bg-nci-gray-lighter hover:bg-grey text-grey-darkest font-bold py-2 px-4 rounded inline-flex items-center"
              onClick={clearFilters}
            >
              <UndoIcon />
            </button>
          </div>
        </div>
        {
          {
            age: (
              <DaysOrYears
                itemType={itemType}
                indexType={indexType}
                field={field}
                minimum={minimum}
                maximum={maximum}
              />
            ),
            year: (
              <Year
                itemType={itemType}
                indexType={indexType}
                field={field}
                minimum={minimum}
                maximum={maximum}
              />
            ),
            years: (
              <Years
                itemType={itemType}
                indexType={indexType}
                field={field}
                minimum={minimum}
                maximum={maximum}
              />
            ),
            days: (
              <DaysOrYears
                itemType={itemType}
                indexType={indexType}
                field={field}
                minimum={minimum}
                maximum={maximum}
              />
            ),
            numeric: (
              <NumericRange
                itemType={itemType}
                indexType={indexType}
                field={field}
                minimum={minimum}
                maximum={maximum}
              />
            ),
            percent: (
              <PercentRange
                itemType={itemType}
                indexType={indexType}
                field={field}
                minimum={minimum}
                maximum={maximum}
              />
            ),
            integer: (
              <NumericRange
                itemType={itemType}
                indexType={indexType}
                field={field}
                minimum={minimum}
                maximum={maximum}
              />
            ),
          }[rangeDatatype]
        }
      </div>
    </div>
  );
};

export default NumericRangeFacet;
