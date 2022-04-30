import React, { useState, useCallback, useEffect } from "react";
import { convertFieldToName, FacetProps, useCaseFacet } from "./utility";
import {
  MdAddCircle as MoreIcon,
  MdFlip as FlipIcon,
  MdRemoveCircle as LessIcon,
} from "react-icons/md";
import {
  Button,
  LoadingOverlay,
  NumberInput,
  SegmentedControl,
} from "@mantine/core";
import { Icon } from "@iconify/react";
import {
  DAYS_IN_YEAR,
  DAYS_IN_DECADE,
  updateCohortFilter,
  Operation,
  useCoreDispatch,
} from "@gff/core";

const BUCKETS_TO_SHOW = 6;

interface NumericFacetProps extends FacetProps {
  readonly facet_type: string;
  readonly minimum?: number;
  readonly maximum?: number;
}

interface FacetData {
  readonly field: string;
  readonly data: Record<string, any>;
  readonly minimum?: number;
  readonly maximum?: number;
}

interface LowHigh {
  readonly low: number;
  readonly high: number;
}

interface RangeValueSelectorProps {
  readonly numBuckets: number;
  readonly field: string;
  readonly units: string;
  readonly minimum: number;
  readonly buildLowHigh: (x: number, units: string, minimum: number) => LowHigh;
}

type RangeFromOp = "gt" | "ge";
type RangeToOp = "lt" | "le";

interface NumericRange {
  readonly fromOp: RangeFromOp;
  readonly fromValue: number;
  readonly toOp: RangeToOp;
  readonly toValue: number;
}

/**
 * returns the range from low to high for a "bucket"
 * @param x - current bucket index
 * @param units - custom units for this range: "years" or "days"
 * @param minimum - staring value of range
 */
const buildDayYearRangeBucket = (x: number, units: string, minimum: number) => {
  return {
    low: (minimum + x * 3652.5) / (units == "years" ? DAYS_IN_YEAR : 1),
    high: (minimum + (x + 1) * 3652.5) / (units == "years" ? DAYS_IN_YEAR : 1),
  };
};

/**
 * returns 10 value range from low to high for a "bucket"
 * @param x - current bucket index
 * @param _ unused
 * @param minimum - staring value of range
 */
const build10UnitRange = (x: number, _: string, minimum: number) => {
  return {
    low: minimum + x * 10,
    high: minimum + (x + 1) * 10,
  };
};

/**
 * Create a list of radio buttons where each line
 * represents bucket for a range > "from" <= "to"
 * @param numBuckets: number of buckets to consider
 * @param field: name of field this range id for
 * @param units: units "days", "years" or "percent"
 * @param minimum starting value for range buckets
 * @param buildLowHigh: function to create the range for a bucket
 */

const RangeValueSelector: React.FC<RangeValueSelectorProps> = ({
  numBuckets,
  field,
  units,
  minimum,
  buildLowHigh,
}: RangeValueSelectorProps) => {
  return (
    <div role="group" className="mt-1">
      {[...Array(numBuckets)].map((_, i) => {
        const { low, high } = buildLowHigh(i, units, minimum);
        return (
          <div
            key={`${field}_${i}`}
            className="flex flex-row justify-start items-center form-check mb-1"
          >
            <input
              type="radio"
              id={`${field}_${i}`}
              name={`${field}_range_selection`}
              className="form-radio mr-4"
            />
            <span>
              {"\u2265"} {low} to {"<"} {high} {units}{" "}
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
            <div className={`flex flex-row items-center ${lastItem} `}>
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
  readonly applyCallback: (_: NumericRange) => void;
}

const FromTo: React.FC<FromToProps> = ({
  minimum,
  maximum,
  applyCallback,
  units = "years",
}: FromToProps) => {
  const unitsLabel = units != "%" ? ` ${units}` : "%";
  const [fromOp, setFromOp] = useState("ge");
  const [fromValue, setFromValue] = useState(undefined);
  const [toOp, setToOp] = useState("lt");
  const [toValue, setToValue] = useState(undefined);

  const handleApply = (event) => {
    applyCallback({
      fromOp: fromOp as RangeFromOp,
      fromValue: fromValue,
      toOp: toOp as RangeToOp,
      toValue,
    });
    event.preventDefault();
  };
  return (
    <div className="flex flex-col text-nci-gray-darkest  text-md">
      <div className="flex flex-row justify-end items-center flex-nowrap border">
        <div className="basis-1/5 text-center">From</div>
        <SegmentedControl
          className="basis-2/5"
          size="sm"
          value={fromOp}
          onChange={setFromOp}
          data={[
            { label: "\u2265", value: "ge" },
            { label: ">", value: "gt" },
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
            { label: "\u2264", value: "le" },
            { label: "<", value: "lt" },
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
        {" "}
        <Button onClick={handleApply}>Apply</Button> <Button>Reset</Button>
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

const DaysOrYears: React.FC<FacetData> = ({
  field,
  data,
  minimum = undefined,
  maximum = undefined,
}: FacetData) => {
  const [isGroupExpanded, setIsGroupExpanded] = useState(false);
  const [units, setUnits] = useState("years");
  const handleSearch = () => null;

  const updateFilters = useCallback((data) => {
    console.log("sendFilters: ", data);
  }, []);

  let adjMinimum = minimum != undefined ? minimum : 0;
  let adjMaximum = maximum != undefined ? maximum : 32872;
  const numBuckets = Math.round((adjMaximum - adjMinimum) / DAYS_IN_DECADE);
  adjMinimum =
    Math.round(10 * (adjMinimum / (units == "years" ? DAYS_IN_YEAR : 1))) / 10;
  adjMaximum =
    Math.round(10 * (adjMaximum / (units == "years" ? DAYS_IN_YEAR : 1))) / 10;

  const bucketsToShow = isGroupExpanded ? numBuckets : BUCKETS_TO_SHOW;
  const remainingValues = numBuckets - bucketsToShow;

  const onShowModeChanged = () => {
    setIsGroupExpanded(!isGroupExpanded);
  };

  const handleRadioSelection = (e) => {
    console.log(e);
  };

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
      <div className="flex flex-row justify-between items-center">
        <input
          type="radio"
          className="form-check-input  mr-4"
          id={`${field}_custom`}
          name={`${field}_age_range_selection`}
          onChange={handleRadioSelection}
        />
        <FromTo
          minimum={adjMinimum}
          maximum={adjMaximum}
          units={units}
          applyCallback={updateFilters}
        />
      </div>
      <div className="flex flex-col border-t-2">
        <RangeValueSelector
          numBuckets={bucketsToShow}
          field={field}
          units={units}
          minimum={adjMinimum}
          buildLowHigh={buildDayYearRangeBucket}
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

const buildRangeOperator = (
  field: string,
  rangeData: NumericRange,
): Operation | undefined => {
  // couple of different cases
  // * no from/to return undefined
  if (rangeData.fromValue === undefined && rangeData.toValue === undefined)
    return undefined;

  const fromOperation: Operation = rangeData.fromValue
    ? {
        field: field,
        operator: rangeData.fromOp === "gt" ? ">" : ">=",
        operand: rangeData.fromValue,
      }
    : undefined;
  const toOperation: Operation = rangeData.toValue
    ? {
        field: field,
        operator: rangeData.toOp === "lt" ? "<" : "<=",
        operand: rangeData.toValue,
      }
    : undefined;

  if (fromOperation && toOperation)
    return { operator: "and", operands: [fromOperation, toOperation] };
  if (fromOperation) return fromOperation;
  return toOperation;
};

const Year: React.FC<FacetData> = ({
  field,
  data,
  minimum = undefined,
  maximum = undefined,
}: FacetData) => {
  const [isGroupExpanded, setIsGroupExpanded] = useState(false);
  const [rangeFilters, setRangeFilters] = useState<Operation>(undefined);
  const adjMinimum = minimum != undefined ? minimum : 1900;
  const adjMaximum = maximum != undefined ? maximum : 2050;
  const numBuckets = Math.round((adjMaximum - adjMinimum) / 10);
  const bucketsToShow = isGroupExpanded ? numBuckets : 3;
  const remainingValues = numBuckets - bucketsToShow;
  const handleSearch = () => null;
  const coreDispatch = useCoreDispatch();

  const onShowModeChanged = () => {
    setIsGroupExpanded(!isGroupExpanded);
  };

  const updateFilters = useCallback(
    (data) => {
      const ops = buildRangeOperator(field, data);
      console.log("sendFilters: ", ops);
      setRangeFilters(ops);
      coreDispatch(updateCohortFilter({ field: field, operation: ops }));
    },
    [field],
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
          numBuckets={bucketsToShow}
          field={field}
          units=""
          minimum={adjMinimum}
          buildLowHigh={build10UnitRange}
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

const Years: React.FC<FacetData> = ({
  field,
  data,
  minimum = undefined,
  maximum = undefined,
}: FacetData) => {
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

const NumericRange: React.FC<FacetData> = ({
  field,
  data,
  minimum = undefined,
  maximum = undefined,
}: FacetData) => {
  const adjMinimum = minimum != undefined ? minimum : 0;
  const adjMaximum = maximum != undefined ? maximum : 999999;
  return (
    <div>
      <FromTo minimum={adjMinimum} maximum={adjMaximum} units="" />
    </div>
  );
};

const PercentRange: React.FC<FacetData> = ({
  field,
  data,
  minimum = undefined,
  maximum = undefined,
}: FacetData) => {
  const [isGroupExpanded, setIsGroupExpanded] = useState(false);

  const adjMinimum = minimum != undefined ? minimum : 0;
  const adjMaximum = maximum != undefined ? maximum : 100;
  const numBuckets = Math.round((adjMaximum - adjMinimum) / 10);

  const bucketsToShow = isGroupExpanded ? numBuckets : BUCKETS_TO_SHOW;
  const remainingValues = numBuckets - bucketsToShow;
  const handleSearch = () => null;

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
            numBuckets={bucketsToShow}
            field={field}
            units="%"
            minimum={adjMinimum}
            buildLowHigh={build10UnitRange}
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
  const { data, error, isUninitialized, isFetching, isError } =
    useCaseFacet(field);

  const [isSearching, setIsSearching] = useState(false);
  const [isFacetView, setIsFacetView] = useState(true);

  if (isUninitialized) {
    return <div>Initializing facet...</div>;
  }

  if (isFetching) {
    return <div>Fetching facet...</div>;
  }

  if (isError) {
    return <div>Failed to fetch facet: {error}</div>;
  }

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
              <DaysOrYears
                field={field}
                data={data}
                minimum={minimum}
                maximum={maximum}
              />
            ),
            year: (
              <Year
                field={field}
                data={data}
                minimum={minimum}
                maximum={maximum}
              />
            ),
            years: (
              <Years
                field={field}
                data={data}
                minimum={minimum}
                maximum={maximum}
              />
            ),
            days: (
              <DaysOrYears
                field={field}
                data={data}
                minimum={minimum}
                maximum={maximum}
              />
            ),
            numeric: (
              <NumericRange
                field={field}
                data={data}
                minimum={minimum}
                maximum={maximum}
              />
            ),
            percent: (
              <PercentRange
                field={field}
                data={data}
                minimum={minimum}
                maximum={maximum}
              />
            ),
            integer: (
              <NumericRange
                field={field}
                data={data}
                minimum={minimum}
                maximum={maximum}
              />
            ),
          }[facet_type]
        }
      </div>
    </div>
  );
};

export default NumericRangeFacet;
