import React, { useCallback, useEffect, useMemo, useState } from "react";
import { convertFieldToName, FacetProps, useRangeFacet } from "./utility";
import {
  MdAddCircle as MoreIcon,
  MdFlip as FlipIcon,
  MdRemoveCircle as LessIcon,
} from "react-icons/md";
import {
  Button,
  LoadingOverlay,
  NumberInput,
  Overlay,
  SegmentedControl,
} from "@mantine/core";
import { Icon } from "@iconify/react";
import {
  DAYS_IN_DECADE,
  DAYS_IN_YEAR,
  FacetBuckets,
  Operation,
  removeCohortFilter,
  selectCurrentCohortFiltersByName,
  updateCohortFilter,
  useCoreDispatch,
  useCoreSelector,
} from "@gff/core";

import { DEFAULT_VISIBLE_ITEMS } from "./utils";

interface NumericFacetProps extends FacetProps {
  readonly facet_type: string;
  readonly minimum?: number;
  readonly maximum?: number;
}

interface NumericFacetData {
  readonly field: string;
  readonly minimum?: number;
  readonly maximum?: number;
}

interface RangeBucketElement {
  readonly from: number;
  readonly to: number;
  readonly key: string;
  readonly label: string;
  value?: number;
}

interface RangeValueSelectorProps {
  readonly itemsToShow: number;
  readonly field: string;
  readonly rangeLabelsAndValues: Record<string, RangeBucketElement>;
  selected: string;
  setSelected: (value: string) => void;
}

type RangeFromOp = ">" | ">=";
type RangeToOp = "<" | "<=";

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

const ClassifyRangeType = (range?: NumericRange, precision = 1): string => {
  if (range === undefined) return "custom";
  if (
    range.fromOp == ">=" &&
    range.toOp == "<" &&
    range.from !== undefined &&
    range.to !== undefined
  )
    return `${range.from.toFixed(precision)}-${range.to.toFixed(precision)}`;
  return "custom";
};

/**
 * returns the range from from to to for a "bucket"
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

/**
 * Create a list of radio buttons where each line
 * represents bucket for a range > "from" <= "to"
 * @param numBuckets: number of buckets to consider
 * @param field: name of field this range id for
 * @param minimum starting value for range buckets
 * @param buildLowHigh: function to create the range for a bucket
 */

const RangeValueSelector: React.FC<RangeValueSelectorProps> = ({
  field,
  selected,
  setSelected,
  rangeLabelsAndValues,
  itemsToShow,
}: RangeValueSelectorProps) => {
  const coreDispatch = useCoreDispatch();

  const handleSelection = (rangeKey) => {
    const data: NumericRange = {
      from: rangeLabelsAndValues[rangeKey].from,
      to: rangeLabelsAndValues[rangeKey].to,
      fromOp: ">=",
      toOp: "<",
    };
    const rangeFilters = buildRangeOperator(field, data);
    console.log("RangeValueSelector ", data, rangeFilters);
    coreDispatch(updateCohortFilter({ field: field, operation: rangeFilters }));
  };

  if (rangeLabelsAndValues === undefined) return <></>;
  return (
    <div role="group" className="mt-1">
      {Object.keys(rangeLabelsAndValues)
        .slice(0, itemsToShow)
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
                className="form-radio mr-4"
                onChange={() => handleSelection(rangeKey)}
              />
              <span>{rangeLabelsAndValues[rangeKey].label}</span>
              <span className="ml-auto">
                {rangeLabelsAndValues[rangeKey].value}
              </span>
            </div>
          );
        })}
    </div>
  );
};

interface ItemElement {
  readonly label?: string;
  readonly icon?: any;
  readonly onClick?: () => void;
}

interface FacetItemListHeaderProps {
  readonly items: ItemElement[];
}

const FacetItemListHeader: React.FC<FacetItemListHeaderProps> = ({
  items,
}: FacetItemListHeaderProps) => {
  return (
    <div className="flex flex-row items-center flex-nowrap border-2">
      {items.map((x, index, { length }) => {
        const lastItem =
          length == 1 ? "" : index + 1 == length ? "ml-auto" : "";
        return (
          <>
            <div key={``} className={`flex flex-row items-center ${lastItem} `}>
              <button className="hover:bg-grey text-grey-darkest font-medium px-6 rounded-sm inline-flex items-center ">
                {x.icon != undefined ? <Icon icon={x.icon}> </Icon> : null}
                {x.label != undefined ? (
                  <p className="px-2">{x.label} </p>
                ) : null}
              </button>
            </div>
          </>
        );
      })}
    </div>
  );
};

interface FromToProps {
  readonly minimum: number;
  readonly maximum: number;
  readonly units: string;
  readonly applyCallback: (data: NumericRange) => void;
  readonly disabled: boolean;
  readonly field: string;
}

const FromTo: React.FC<FromToProps> = ({
  field,
  minimum,
  maximum,
  units = "years",
  disabled,
}: FromToProps) => {
  const unitsLabel = units != "%" ? ` ${units}` : "%";
  const [fromOp, setFromOp] = useState(">=");
  const [fromValue, setFromValue] = useState(undefined);
  const [toOp, setToOp] = useState("<");
  const [toValue, setToValue] = useState(undefined);
  const coreDispatch = useCoreDispatch();

  const handleApply = (event) => {
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
    event.preventDefault();
  };
  return (
    <div className="relative p-1">
      {disabled && (
        <Overlay opacity={0.02} color="#000" zIndex={5} radius="md" blur={2} />
      )}
      <div className="flex flex-col text-nci-gray-dark text-md ">
        <div className="flex flex-row justify-end items-center flex-nowrap border">
          <div className="basis-1/5 text-center">From</div>
          <SegmentedControl
            className="basis-2/5"
            size="sm"
            value={fromOp}
            onChange={setFromOp}
            data={[
              { label: "\u2265", value: ">=" },
              { label: ">", value: "<" },
            ]}
          />
          <NumberInput
            className="basis-2/5 text-sm"
            placeholder={`eg. ${minimum}${unitsLabel} `}
            min={minimum}
            max={maximum}
            onChange={setFromValue}
            hideControls
          />
        </div>
        <div className="flex flex-row mt-1 justify-center items-center flex-nowrap border ">
          <div className="basis-1/5 text-center">To</div>
          <SegmentedControl
            className="basis-2/5"
            size="sm"
            value={toOp}
            onChange={setToOp}
            data={[
              { label: "\u2264", value: "<=" },
              { label: "<", value: "<" },
            ]}
          />
          <NumberInput
            className="basis-2/5"
            placeholder={`eg. ${maximum}${unitsLabel} `}
            min={minimum}
            max={maximum}
            onChange={setToValue}
            hideControls
          />
        </div>
        <div className={"flex flex-row"}>
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
      {!isGroupExpanded ? (
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
      ) : (
        <div className="flex flex-row justify-end items-center border-t-2 border-b-0 border-r-0 border-l-0 p-1.5">
          <LessIcon
            key="show-less"
            size="1.5em"
            className="text-nci-gray-darkest"
            onClick={() => onShowChanged(!isGroupExpanded)}
          />
          <div className="pl-1 text-nci-gray-darkest"> show less</div>
        </div>
      )}
    </div>
  );
};

function BuildRangeLabelsAndValues(
  bucketRanges: Record<string, any>,
  rangeData?: FacetBuckets,
) {
  return Object.keys(bucketRanges).reduce((b, x) => {
    b[x] = {
      ...bucketRanges[x],
      key: x,
      value: rangeData ? rangeData[x] : undefined,
    };
    return b;
  }, {} as Record<string, RangeBucketElement>);
}

interface RangeInputWithPrefixedRangesProps {
  readonly numBuckets: number;
  readonly field: string;
  readonly minimum: number;
  readonly maximum: number;
  readonly units: string;
  readonly showZero: boolean;
}

const RangeInputWithPrefixedRanges: React.FC<RangeInputWithPrefixedRangesProps> =
  ({
    field,
    units,
    numBuckets,
    minimum,
    maximum,
    showZero = true,
  }: RangeInputWithPrefixedRangesProps) => {
    const [isGroupExpanded, setIsGroupExpanded] = useState(false); // handles the expanded group

    // get the current filter for this facet
    const filter = useCoreSelector((state) =>
      selectCurrentCohortFiltersByName(state, field),
    );

    const filterValues = ExtractRangeValues(filter);

    // build the range for the useRangeFacet and the facet query
    const bucketRanges = useMemo(
      () => BuildRanges(numBuckets, units, minimum, buildDayYearRangeBucket),
      [minimum, numBuckets, units],
    );
    // build ranges for facet query
    const ranges = Object.keys(bucketRanges).map((x) => {
      return { from: bucketRanges[x].from, to: bucketRanges[x].to };
    });

    const filterKey = ClassifyRangeType(filterValues);
    console.log("filterKey: ", filterKey);

    const [rangeFilters, setRangeFilters] = useState<Operation | undefined>(
      filter,
    ); // Current Filter or none
    const [visibleItems, setVisibleItems] = useState(DEFAULT_VISIBLE_ITEMS);
    const [selectedRange, setSelectedRange] = useState(filterKey);
    const coreDispatch = useCoreDispatch();

    const { data: rangeData, isSuccess } = useRangeFacet(field, ranges);
    const rangeLabelsAndValues = BuildRangeLabelsAndValues(
      bucketRanges,
      rangeData,
    );

    const clearFilters = () => {
      coreDispatch(removeCohortFilter(field));
    };

    useEffect(() => {
      if (filterKey == selectedRange) return;

      console.log(
        "useEffect: ",
        field,
        filterKey,
        Object.keys(rangeLabelsAndValues),
      );
      if (Object.keys(rangeLabelsAndValues).includes(filterKey)) {
        if (filterKey !== selectedRange) setSelectedRange(filterKey);
        console.log("useEffect: ", field, "setSelectedRange");
      }
    }, [rangeLabelsAndValues, selectedRange]);

    // callback for Apply Button in FromToComponent
    const updateFilters = useCallback(
      (data: NumericRange) => {
        const ops = buildRangeOperator(field, data);
        setRangeFilters(ops);
      },
      [field],
    );

    /*
    useEffect(() => {
      // handle predefine range selection
      if (selectedRange !== "custom") {
        const data: NumericRange = {
          ...bucketRanges[selectedRange].range,
          fromOp: ">=",
          toOp: "<",
        };
        updateFilters(data);
      } // switching back to custom range
      // rule: remove filter until apply is clicked
      else setRangeFilters(undefined); //
    }, [bucketRanges, selectedRange, updateFilters]);
    */
    /*
    // update this facet's filters when changed
    useEffect(() => {
      if (rangeFilters === undefined) coreDispatch(removeCohortFilter(field));
      else {
        coreDispatch(
          updateCohortFilter({ field: field, operation: rangeFilters }),
        );
      }
    }, [coreDispatch, field, rangeFilters]);
    */
    const bucketsToShow = isGroupExpanded ? numBuckets : DEFAULT_VISIBLE_ITEMS;
    const remainingValues = numBuckets - bucketsToShow;

    const onShowModeChanged = () => {
      setIsGroupExpanded(!isGroupExpanded);
    };

    console.log("selectedRange: ", selectedRange);
    return (
      <div className="flex flex-col w-100 space-y-2 px-2  mt-1 ">
        <LoadingOverlay visible={!isSuccess} />
        <div className="flex flex-row justify-between items-center">
          <input
            type="radio"
            className="form-check-input mr-4"
            id={`${field}_custom`}
            name={`${field}_range_selection`}
            checked={selectedRange === "custom"}
            onChange={() => {
              clearFilters();
              setSelectedRange("custom");
            }}
          />
          <FromTo
            disabled={selectedRange !== "custom"}
            minimum={minimum}
            maximum={maximum}
            field={field}
            units={units}
          />
        </div>
        <div className="flex flex-col border-t-2">
          <RangeValueSelector
            field={field}
            itemsToShow={bucketsToShow}
            rangeLabelsAndValues={rangeLabelsAndValues}
            selected={selectedRange}
            setSelected={setSelectedRange}
          />
          <FacetExpander
            remainingValues={remainingValues}
            isGroupExpanded={isGroupExpanded}
            onShowChanged={onShowModeChanged}
          />
        </div>
      </div>
    );
  };

const DaysOrYears: React.FC<NumericFacetData> = ({
  field,
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
      />
    </div>
  );
};

const buildRangeOperator = (
  field: string,
  rangeData: NumericRange,
): Operation | undefined => {
  // couple of different cases
  // * no from/to return undefined
  if (rangeData.from === undefined && rangeData.to === undefined)
    return undefined;

  const fromOperation: Operation = rangeData.from
    ? {
        field: field,
        operator: rangeData.fromOp,
        operand: rangeData.from,
      }
    : undefined;
  const toOperation: Operation = rangeData.to
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

const Year: React.FC<NumericFacetData> = ({
  field,
  minimum = undefined,
  maximum = undefined,
}: NumericFacetData) => {
  const [isGroupExpanded, setIsGroupExpanded] = useState(false);
  const [rangeFilters, setRangeFilters] = useState<Operation>(undefined);
  const adjMinimum = minimum != undefined ? minimum : 1900;
  const adjMaximum = maximum != undefined ? maximum : 2050;
  const numBuckets = Math.round((adjMaximum - adjMinimum) / 10);
  const bucketsToShow = isGroupExpanded ? numBuckets : DEFAULT_VISIBLE_ITEMS;
  const handleSearch = () => null;
  const coreDispatch = useCoreDispatch();

  // build the range for the useRangeFacet, as well as the labels.
  const bucketRanges = useMemo(
    () => BuildRanges(numBuckets, "", adjMinimum, build10UnitRange),
    [adjMinimum, numBuckets],
  );

  const onShowModeChanged = () => {
    setIsGroupExpanded(!isGroupExpanded);
  };

  // build ranges for facet query
  const ranges = Object.keys(bucketRanges).map((x) => {
    return bucketRanges[x].range;
  });
  const { data: rangeData, isSuccess } = useRangeFacet(field, ranges);
  const rangeLabelsAndValues = BuildRangeLabelsAndValues(
    bucketRanges,
    rangeData,
  );

  const remainingValues = numBuckets - bucketsToShow;

  const updateFilters = useCallback(
    (data) => {
      const ops = buildRangeOperator(field, data);
      console.log("sendFilters: ", ops);
      setRangeFilters(ops);
      coreDispatch(updateCohortFilter({ field: field, operation: ops }));
    },
    [coreDispatch, field],
  );

  return (
    <div className="flex flex-col w-100 space-y-2 px-2  mt-1 ">
      <div className="flex flex-row justify-between items-center">
        <input
          type="radio"
          className="form-check-input  mr-4"
          id={`${field}_custom`}
          name={`${field}_year_range_selection`}
        />
        <FromTo
          minimum={adjMinimum}
          maximum={adjMaximum}
          units="year"
          applyCallback={updateFilters}
        />
      </div>
      <div className="flex flex-col border-t-2">
        <RangeValueSelector
          itemsToShow={bucketsToShow}
          field={field}
          rangeLabelsAndValues={rangeLabelsAndValues}
        />
        <FacetExpander
          remainingValues={remainingValues}
          isGroupExpanded={isGroupExpanded}
          onShowChanged={onShowModeChanged}
        />
      </div>
    </div>
  );
};

const Years: React.FC<NumericFacetData> = ({
  field,
  minimum = undefined,
  maximum = undefined,
}: NumericFacetData) => {
  const adjMinimum = minimum != undefined ? minimum : 0;
  const adjMaximum = maximum != undefined ? maximum : 89;
  const numBuckets = Math.round((adjMaximum - adjMinimum) / 10);

  const handleSearch = () => null;
  return (
    <div>
      <FacetItemListHeader
        items={[{ icon: "mdi:sort", onClick: handleSearch }]}
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
      <FromTo minimum={adjMinimum} maximum={adjMaximum} units="" />
    </div>
  );
};

const PercentRange: React.FC<NumericFacetData> = ({
  field,
  minimum = undefined,
  maximum = undefined,
}: NumericFacetData) => {
  const [isGroupExpanded, setIsGroupExpanded] = useState(false);

  const adjMinimum = minimum != undefined ? minimum : 0;
  const adjMaximum = maximum != undefined ? maximum : 100;
  const numBuckets = Math.round((adjMaximum - adjMinimum) / 10);

  const bucketsToShow = isGroupExpanded ? numBuckets : DEFAULT_VISIBLE_ITEMS;
  const remainingValues = numBuckets - bucketsToShow;
  const handleSearch = () => null;

  // build the range for the useRangeFacet, as well as the labels.
  const bucketRanges = useMemo(
    () => BuildRanges(numBuckets, "%", adjMinimum, build10UnitRange),
    [adjMinimum, numBuckets],
  );

  // build ranges for facet query
  const ranges = Object.keys(bucketRanges).map((x) => {
    return bucketRanges[x].range;
  });
  const { data: rangeData, isSuccess } = useRangeFacet(field, ranges);
  const rangeLabelsAndValues = BuildRangeLabelsAndValues(
    bucketRanges,
    rangeData,
  );

  const onShowModeChanged = () => {
    setIsGroupExpanded(!isGroupExpanded);
  };

  return (
    <div className="flex flex-col w-100 space-y-2 px-2  mt-1 ">
      <div className="flex flex-row justify-between items-center">
        <input
          type="radio"
          className="form-check-input  mr-4"
          id={`${field}_custom`}
          name={`${field}_percent_range_selection`}
        />
        <FromTo minimum={adjMinimum} maximum={adjMaximum} units="%" />
      </div>
      <div className="flex flex-col">
        <div className="flex flex-col border-t-2">
          <RangeValueSelector
            itemsToShow={bucketsToShow}
            field={field}
            rangeLabelsAndValues={rangeLabelsAndValues}
          />
          <FacetExpander
            remainingValues={remainingValues}
            isGroupExpanded={isGroupExpanded}
            onShowChanged={onShowModeChanged}
          />
        </div>
      </div>
    </div>
  );
};

const NumericRangeFacet: React.FC<NumericFacetProps> = ({
  field,
  description,
  facet_type,
  minimum = undefined,
  maximum = undefined,
  facetName = null,
}: NumericFacetProps) => {
  const [isSearching, setIsSearching] = useState(false);
  const [isFacetView, setIsFacetView] = useState(true);

  const toggleSearch = () => {
    setIsSearching(!isSearching);
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
          </div>
        </div>
        {
          {
            age: (
              <DaysOrYears field={field} minimum={minimum} maximum={maximum} />
            ),
            year: <Year field={field} minimum={minimum} maximum={maximum} />,
            years: <Years field={field} minimum={minimum} maximum={maximum} />,
            days: (
              <DaysOrYears field={field} minimum={minimum} maximum={maximum} />
            ),
            numeric: (
              <NumericRange field={field} minimum={minimum} maximum={maximum} />
            ),
            percent: (
              <PercentRange field={field} minimum={minimum} maximum={maximum} />
            ),
            integer: (
              <NumericRange field={field} minimum={minimum} maximum={maximum} />
            ),
          }[facet_type]
        }
      </div>
    </div>
  );
};

export default NumericRangeFacet;
