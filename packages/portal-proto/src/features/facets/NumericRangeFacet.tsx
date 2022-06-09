import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  MdAddCircle as MoreIcon,
  MdFlip as FlipIcon,
  MdRemoveCircle as LessIcon,
  MdSort as SortIcon,
  MdSortByAlpha as AlphaSortIcon,
  MdWarning as WarningIcon,
} from "react-icons/md";
import { FaUndo as UndoIcon } from "react-icons/fa";
import tw from "tailwind-styled-components";
import { LoadingOverlay, NumberInput, SegmentedControl } from "@mantine/core";
import {
  DAYS_IN_DECADE,
  DAYS_IN_YEAR,
  Operation,
  removeCohortFilter,
  selectCurrentCohortFiltersByName,
  selectTotalCountsByName,
  updateCohortFilter,
  useCoreDispatch,
  useCoreSelector,
  GQLDocType,
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
  FacetDocTypeToCountsIndexMap,
  FacetDocTypeToLabelsMap,
  useRangeFacet,
} from "@/features/facets/hooks";
import * as tailwindConfig from "../../../tailwind.config";

interface NumericFacetProps extends FacetCardProps {
  readonly rangeDatatype: string;
  readonly minimum?: number;
  readonly maximum?: number;
}

type NumericFacetData = Pick<
  NumericFacetProps,
  "field" | "minimum" | "maximum" | "docType" | "indexType"
>;

/**
 * Represent a range. Used to configure a row
 * of a range list
 */
interface RangeBucketElement {
  readonly from: number;
  readonly to: number;
  readonly key: string; // key for facet range
  readonly label: string; // label for value
  readonly valueLabel?: string; // string representation of the count
  value?: number; // count of items in range
}

const RadioStyle =
  "form-check-input form-check-input appearance-none rounded-full h-3 w-3 border border-nci-gray-light bg-white checked:bg-nci-blue-dark checked:bg-nci-blue-dark focus:ring-0 focus:ring-offset-0 focus:outline-none focus:bg-nci-blue-darkest active:bg-nci-blue-dark transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer";

export const ApplyButton = tw.div`
        flex
        flex-row
        subpixel-antialiased
        rounded-md
        text-base
        font-montserrat
        font-medium
        text-sm
        text-white
        transition
        w-full
        justify-center
        align-center
        py-1
        bg-nci-blue-dark
        hover:bg-nci-blue-darkest
        hover:shadow-[0_4px_5px_0px_rgba(0,0,0,0.35)]
`;

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

/**
 * Given an operation, determine if range is open or closed and extract
 * the range values and operands as a NumericRange
 * @param filter - operation to test
 */
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
 * returns 10 value range from to for a "bucket"
 * @param x - current bucket index
 * @param units - string to append to label
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
 * Builds a Dictionary like object contain the range and label for each "bucket" in the range
 * @param numBuckets - number of buckets to create
 * @param units - units such as days or percent
 * @param minimum - start value of range
 * @param rangeFunction - function to compute range boundaries
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
    .map((_x, i) => {
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
 * @param field - facet managed by this component
 * @param valueLabel - string representing the datatype of values (e.g. "Cases")
 * @param selected - which range, if any, is selected
 * @param rangeLabelsAndValues - list of range keys, labels and values
 * @param itemsToShow - number of ranges to render
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

  // toggle to handle sorting by value vs. label
  const [isSortedByValue, setIsSortedByValue] = useState(false);

  // process when range is selected
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
  };

  if (rangeLabelsAndValues === undefined) return null;

  return (
    <div className="flex flex-col px-1">
      {Object.keys(rangeLabelsAndValues).length > 1 ? (
        <div className="flex flex-row items-center justify-between flex-wrap border-b-2 py-1">
          <button
            className={
              "border rounded-sm border-nci-gray-darkest bg-nci-gray hover:bg-nci-gray-lightest text-white hover:text-nci-gray-darker"
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
            <p className="px-1">{valueLabel}</p>
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
                  className={RadioStyle}
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

/**
 * A Component which manages a range. The From/To values are managed by a numeric text entry
 * @param field - field for this range
 * @param minimum - range minimum value
 * @param maximum - range maximum value
 * @param values - the current value of the range
 * @param changedCallback - function called when FromTo values change
 * @param units - string represention of unit: "days" | "years" | "year", "percent" | "numeric"
 * @constructor
 */
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
    <div className="relative">
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
        <div className="flex items-stretch w-100 pt-1">
          <ApplyButton onClick={handleApply}>Apply</ApplyButton>
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

/**
 * Component which manages the compact/expanded state of a FacetCard
 * @param remainingValues - number of remaining values when compact "show 4"
 * @param isGroupExpanded - true if expanded, false if compact
 * @param onShowChanged - callback to call when the expand/compact button is clicked
 * @constructor
 */
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
          <div className="pl-1 text-nci-gray-darkest font-bold">
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
          <div className="pl-1 text-nci-gray-darkest font-bold"> show less</div>
        </div>
      ) : null}
    </div>
  );
};

const BuildRangeLabelsAndValues = (
  bucketRanges: Record<string, any>,
  totalCount: number,
  rangeData?: Record<string, string | number>,
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
  readonly docType: GQLDocType;
  readonly indexType: GQLIndexType;
  readonly minimum: number;
  readonly maximum: number;
  readonly units: string;
  readonly showZero?: boolean;
}

const RangeInputWithPrefixedRanges: React.FC<
  RangeInputWithPrefixedRangesProps
> = ({
  field,
  docType,
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
    selectCurrentCohortFiltersByName(state, `${field}`),
  );

  const totalCount = useCoreSelector((state) =>
    selectTotalCountsByName(state, FacetDocTypeToCountsIndexMap[docType]),
  );

  // giving the filter value, extract the From/To values and
  // build it's key
  const [filterValues, filterKey] = useMemo(() => {
    const values = ExtractRangeValues(filter);
    const key = ClassifyRangeType(values);
    return [values, key];
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

    const bucketEntries = BuildRanges(
      numBuckets,
      RangeBuilder[units].label,
      minimum,
      RangeBuilder[units].builder,
    );
    // build ranges for continuous range query
    const r = Object.keys(bucketEntries).map((x) => {
      return { from: bucketEntries[x].from, to: bucketEntries[x].to };
    });
    return [bucketEntries, r];
  }, [minimum, numBuckets, units]);

  const [isCustom, setIsCustom] = useState(filterKey === "custom"); // in custom Range Mode
  const [selectedRange, setSelectedRange] = useState(filterKey); // the current selected range

  const { data: rangeData, isSuccess } = useRangeFacet(
    field,
    ranges,
    docType,
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
  const bucketsToShow = isGroupExpanded ? totalBuckets : DEFAULT_VISIBLE_ITEMS;
  const remainingValues = totalBuckets - bucketsToShow;

  const onShowModeChanged = () => {
    setIsGroupExpanded(!isGroupExpanded);
  };

  return (
    <div className="flex flex-col w-100 space-y-2 mt-1 ">
      <LoadingOverlay visible={!isSuccess} />
      <div className="flex flex-row justify-between items-center">
        <input
          type="radio"
          className={RadioStyle}
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
          field={`${field}`}
          units={units}
          changedCallback={resetToCustom}
        />
      </div>
      <div className="flex flex-col border-t-2">
        {totalBuckets == 0 ? (
          <div className="mx-4">No data for this field</div>
        ) : isSuccess ? (
          <RangeValueSelector
            field={`${field}`}
            valueLabel={FacetDocTypeToLabelsMap[docType]}
            itemsToShow={bucketsToShow}
            rangeLabelsAndValues={rangeLabelsAndValues}
            selected={selectedRange}
            setSelected={(value) => {
              setIsCustom(false); // no longer a customRange
              // this is the only way user interaction
              // can set this to False
              setSelectedRange(value);
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
  docType,
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
        docType={docType}
        indexType={indexType}
      />
    </div>
  );
};

const Year: React.FC<NumericFacetData> = ({
  field,
  docType,
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
        docType={docType}
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
  docType,
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
        docType={docType}
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

const NumericRangePanel: React.FC<NumericFacetData> = ({
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
  docType,
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
        docType={docType}
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
  docType,
  description,
  minimum = undefined,
  maximum = undefined,
  facetName = null,
  indexType = "explore",
}: NumericFacetProps) => {
  const [isFacetView, setIsFacetView] = useState(true);
  const coreDispatch = useCoreDispatch();

  const clearFilters = () => {
    coreDispatch(removeCohortFilter(`${field}`));
  };

  const toggleFlip = () => {
    setIsFacetView(!isFacetView);
  };

  return (
    <div>
      <div className="flex flex-col  mx-1 bg-white relative shadow-lg border-nci-gray-lightest border-1 rounded-b-md text-xs transition ">
        <div className="flex items-center justify-between flex-wrap bg-nci-blue-lightest shadow-md px-1.5">
          <div className="has-tooltip text-nci-gray-darkest font-heading font-semibold text-md">
            {facetName === null ? convertFieldToName(field) : facetName}
            <div className="inline-block tooltip w-full border-b-2 border-nci-cyan-lightest rounded shadow-lg p-2 bg-gray-100 text-nci-blue-darkest mt-8 absolute">
              {description}
            </div>
          </div>
          <div className="flex flex-row">
            <button
              className="hover:bg-nci-grey-darker text-nci-gray font-bold py-2 px-1 rounded inline-flex items-center"
              onClick={toggleFlip}
              aria-label="Flip between form and chart"
            >
              <FlipIcon
                size="1.25em"
                color={tailwindConfig.theme.extend.colors["gdc-blue"].darker}
              />
            </button>
            <button
              className="hover:bg-nci-grey-darker text-nci-gray font-bold py-2 px-1 rounded inline-flex items-center"
              onClick={clearFilters}
            >
              <UndoIcon
                size="1.25em"
                color={tailwindConfig.theme.extend.colors["gdc-blue"].darker}
              />
            </button>
          </div>
        </div>
        {
          {
            age: (
              <DaysOrYears
                docType={docType}
                indexType={indexType}
                field={field}
                minimum={minimum}
                maximum={maximum}
              />
            ),
            year: (
              <Year
                docType={docType}
                indexType={indexType}
                field={field}
                minimum={minimum}
                maximum={maximum}
              />
            ),
            years: (
              <Years
                docType={docType}
                indexType={indexType}
                field={field}
                minimum={minimum}
                maximum={maximum}
              />
            ),
            days: (
              <DaysOrYears
                docType={docType}
                indexType={indexType}
                field={field}
                minimum={minimum}
                maximum={maximum}
              />
            ),
            numeric: (
              <NumericRangePanel
                docType={docType}
                indexType={indexType}
                field={field}
                minimum={minimum}
                maximum={maximum}
              />
            ),
            percent: (
              <PercentRange
                docType={docType}
                indexType={indexType}
                field={field}
                minimum={minimum}
                maximum={maximum}
              />
            ),
            integer: (
              <NumericRangePanel
                docType={docType}
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
