import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDeepCompareEffect } from "react-use";
import {
  MdClose as CloseIcon,
  MdFlip as FlipIcon,
  MdWarning as WarningIcon,
} from "react-icons/md";
import { FaUndo as UndoIcon } from "react-icons/fa";
import tw from "tailwind-styled-components";
import {
  LoadingOverlay,
  NumberInput,
  SegmentedControl,
  Tooltip,
} from "@mantine/core";
import { DAYS_IN_YEAR, fieldNameToTitle } from "@gff/core";
import { SortType } from "./types";

import {
  DEFAULT_VISIBLE_ITEMS,
  getLowerAgeYears,
  buildRangeOperator,
  extractRangeValues,
  buildRangeBuckets,
  adjustYearsToDaysIfUnitsAreYears,
  adjustDaysToYearsIfUnitsAreYears,
} from "./utils";
import {
  FacetCardProps,
  FromToRange,
  RangeFromOp,
  RangeToOp,
  RangeFacetHooks,
  ClearFacetHook,
  UpdateFacetFilterFunction,
  UpdateFacetFilterHook,
  RangeBucketElement,
} from "@/features/facets/types";
import {
  FacetIconButton,
  FacetText,
  FacetHeader,
  controlsIconStyle,
} from "./components";
import FacetExpander from "@/features/facets/FacetExpander";
import FacetSortPanel from "@/features/facets/FacetSortPanel";
import { EnumFacetChart } from "../charts/EnumFacetChart";

interface NumericFacetProps extends FacetCardProps<RangeFacetHooks> {
  readonly rangeDatatype: string;
  readonly minimum?: number;
  readonly maximum?: number;
  readonly clearValues?: boolean;
}

interface NumericFacetData
  extends Pick<
    NumericFacetProps,
    "field" | "minimum" | "maximum" | "valueLabel" | "hooks" | "clearValues"
  > {
  isFacetView?: boolean;
  rangeDatatype?: string;
}

const RadioStyle =
  "form-check-input form-check-input appearance-none rounded-full h-3 w-3 border border-base-light bg-base-lightest checked:bg-primary-dark checked:bg-primary-dark focus:ring-0 focus:ring-offset-0 focus:outline-none focus:bg-primary-darkest active:bg-primary-dark transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer";

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
        bg-primary-dark
        hover:bg-primary-darkest
        hover:shadow-[0_4px_5px_0px_rgba(0,0,0,0.35)]
`;

interface RangeValueSelectorProps {
  readonly itemsToShow: number;
  readonly field: string;
  readonly valueLabel: string;
  readonly rangeLabelsAndValues: Record<string, RangeBucketElement>;
  selected: string;
  setSelected: (value: string) => void;
  useUpdateFacetFilters: () => UpdateFacetFilterFunction;
}

const WARNING_DAYS = Math.floor(90 * DAYS_IN_YEAR);

/**
 * Given a range compute the key if possibly matches a predefined range
 * otherwise classify as "custom"
 * @param range - Range to classify
 * @param precision - number of values after .
 */
const ClassifyRangeType = (
  range?: FromToRange<number>,
  precision = 1,
): string => {
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
 * Create a list of radio buttons where each line
 * represents bucket for a range \> "from" \<= "to"
 * @param field - facet managed by this component
 * @param valueLabel - string representing the datatype of values (e.g. "Cases")
 * @param selected - which range, if any, is selected
 * @param setSelected - function to handle selected range
 * @param rangeLabelsAndValues - list of range keys, labels and values
 * @param itemsToShow - number of ranges to render
 * @param useUpdateFacetFilters - hook to update facet filters with new values
 */
const RangeValueSelector: React.FC<RangeValueSelectorProps> = ({
  field,
  valueLabel,
  selected,
  setSelected,
  rangeLabelsAndValues,
  itemsToShow,
  useUpdateFacetFilters,
}: RangeValueSelectorProps) => {
  const updateFilters = useUpdateFacetFilters();

  // toggle to handle sorting by value vs. label
  const [sortType, setSortType] = useState<SortType>({
    type: "alpha",
    direction: "dsc",
  });

  // process when range is selected
  const handleSelection = (rangeKey) => {
    const data: FromToRange<number> = {
      from: rangeLabelsAndValues[rangeKey].from,
      to: rangeLabelsAndValues[rangeKey].to,
      fromOp: ">=",
      toOp: "<",
    };
    const rangeFilters = buildRangeOperator(field, data);

    updateFilters(field, rangeFilters);
    setSelected(rangeKey);
  };

  if (rangeLabelsAndValues === undefined) return null;

  return (
    <div className="flex flex-col px-1">
      {Object.keys(rangeLabelsAndValues).length > 1 ? (
        <>
          <FacetSortPanel
            sortType={sortType}
            valueLabel={valueLabel}
            setSort={setSortType}
            field={field}
          />
        </>
      ) : null}
      <fieldset className="mt-1">
        <legend className="sr-only">Numeric range filters</legend>
        {Object.keys(rangeLabelsAndValues)
          .slice(0, itemsToShow)
          .sort(
            sortType.type === "value"
              ? (a, b) =>
                  sortType.direction === "dsc"
                    ? rangeLabelsAndValues[b].value -
                      rangeLabelsAndValues[a].value
                    : rangeLabelsAndValues[a].value -
                      rangeLabelsAndValues[b].value
              : (a, b) =>
                  sortType.direction === "dsc"
                    ? rangeLabelsAndValues[b].from -
                      rangeLabelsAndValues[a].from
                    : rangeLabelsAndValues[a].from -
                      rangeLabelsAndValues[b].from,
          )
          .map((rangeKey, i) => {
            return (
              <div
                key={`${field}_${rangeKey}`}
                className="flex justify-start items-center form-check mb-1 font-content text-sm"
              >
                <input
                  type="radio"
                  id={`${field}_${rangeKey}_${i}`}
                  name={`${field}_range_selection`}
                  aria-label={rangeLabelsAndValues[rangeKey].valueLabel}
                  value={rangeKey}
                  checked={rangeKey === selected}
                  className={RadioStyle}
                  onChange={() => handleSelection(rangeKey)}
                  data-testid={`checkbox-${rangeLabelsAndValues[rangeKey].label}`}
                />
                <span>{rangeLabelsAndValues[rangeKey].label}</span>
                <span
                  data-testid={`text-${rangeLabelsAndValues[rangeKey].label}`}
                  className="ml-auto"
                >
                  {rangeLabelsAndValues[rangeKey].valueLabel}
                </span>
              </div>
            );
          })}
      </fieldset>
    </div>
  );
};

// clamp value between min and max
const clamp = (value: number, min: number, max: number): number | undefined => {
  if (value === undefined) return undefined;
  return Math.min(Math.max(value, min), max);
};

interface FromToProps {
  readonly minimum: number;
  readonly maximum: number;
  readonly units: string;
  readonly field: string;
  readonly useClearFilter: ClearFacetHook;
  readonly useUpdateFacetFilters: UpdateFacetFilterHook;
  readonly values?: FromToRange<number>;
  readonly changedCallback?: () => void;
  readonly clearValues?: boolean;
}

/**
 * A Component which manages a range. The From/To values are managed by a numeric text entry
 * @param field - field for this range
 * @param minimum - range minimum value
 * @param maximum - range maximum value
 * @param values - the current value of the range
 * @param changedCallback - function called when FromTo values change
 * @param units - string representation of unit: "days" | "years" | "year", "percent" | "numeric"
 * @param useClearFilter - hook to clear (e.x. reset)  field (facet) filters
 * @param clearValues - prop set to true to clear FromTo input fields
 * @param useUpdateFacetFilters - hook to update facet filters with new values
 */
const FromTo: React.FC<FromToProps> = ({
  field,
  useClearFilter,
  useUpdateFacetFilters,
  minimum,
  maximum,
  values,
  changedCallback = () => null,
  units = "years",
  clearValues = undefined,
}: FromToProps) => {
  const unitsLabel = "%" != units ? ` ${units}` : "%";
  const [fromOp, setFromOp] = useState(values?.fromOp ?? ">=");
  const [fromValue, setFromValue] = useState(values?.from);
  const [toOp, setToOp] = useState(values?.toOp ?? "<");
  const [toValue, setToValue] = useState(values?.to);
  const [isWarning, setIsWarning] = useState(false);

  const clearFilter = useClearFilter();
  const updateFacetFilters = useUpdateFacetFilters();

  useEffect(() => {
    setFromOp(values?.fromOp ?? ">=");
    setFromValue(values?.from);
    setToOp(values?.toOp ?? "<");
    setToValue(values?.to);
  }, [values]);

  useEffect(() => {
    if (clearValues) {
      setFromValue(undefined);
      setToValue(undefined);
    }
  }, [clearValues]);

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
      clearFilter(field);
    } else {
      updateFacetFilters(field, rangeFilters);
    }
  };

  const lowerUnitRange =
    units !== "years" ? minimum : getLowerAgeYears(minimum);
  const upperUnitRange =
    units !== "years" ? maximum : getLowerAgeYears(maximum);

  return (
    <div className="flex flex-col grow m-2 text-base-contrast-max bg-base-max">
      <fieldset className="flex flex-col gap-y-1 text-sm">
        <legend className="sr-only">Numeric from/to filters</legend>
        <div className="flex gap-0.5 items-center flex-nowrap border font-content">
          <div className="basis-1/5 text-center">From</div>
          <SegmentedControl
            className="flex-1"
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
            data-testid="textbox-input-from-value"
            className="text-sm flex-1"
            placeholder={`eg. ${lowerUnitRange}${unitsLabel} `}
            min={lowerUnitRange}
            max={upperUnitRange}
            // units are always days
            value={adjustDaysToYearsIfUnitsAreYears(fromValue, units)}
            onChange={(value) => {
              if (value === "" || typeof value === "string") return;
              setFromValue(
                adjustYearsToDaysIfUnitsAreYears(
                  clamp(value, lowerUnitRange, upperUnitRange),
                  units,
                ),
              );
              changedCallback();
            }}
            hideControls
            aria-label="input from value"
          />
        </div>
        <div className="flex gap-0.5 items-center flex-nowrap border font-content">
          <div className="basis-1/5 text-center">To</div>
          <SegmentedControl
            className="flex-1"
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
            data-testid="textbox-input-to-value"
            className="flex-1 text-sm"
            placeholder={`eg. ${upperUnitRange}${unitsLabel} `}
            min={lowerUnitRange}
            max={upperUnitRange}
            onChange={(value) => {
              if (value === "" || typeof value === "string") return;
              setToValue(
                adjustYearsToDaysIfUnitsAreYears(
                  clamp(value, lowerUnitRange, upperUnitRange),
                  units,
                ),
              );
              changedCallback();
            }}
            value={adjustDaysToYearsIfUnitsAreYears(toValue, units)}
            hideControls
            aria-label="input to value"
          />
        </div>
      </fieldset>
      {isWarning ? (
        <div className="bg-utility-warning border-utility-warning">
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
        ? `${rangeData[x]?.toLocaleString()} (${(
            ((rangeData[x] as number) / totalCount) *
            100
          ).toFixed(2)}%)`
        : "",
    };
    return b;
  }, {} as Record<string, RangeBucketElement>);
};

interface RangeInputWithPrefixedRangesProps {
  readonly field: string;
  readonly rangeDatatype?: string;
  readonly hooks: RangeFacetHooks;
  readonly numBuckets: number;
  readonly minimum: number;
  readonly maximum: number;
  readonly units: string;
  readonly valueLabel: string;
  readonly showZero?: boolean;
  readonly clearValues?: boolean;
  readonly isFacetView?: boolean;
  readonly setHasData?: (boolean) => void;
}

const RangeInputWithPrefixedRanges: React.FC<
  RangeInputWithPrefixedRangesProps
> = ({
  field,
  hooks,
  units,
  numBuckets,
  minimum,
  maximum,
  valueLabel,
  rangeDatatype,
  showZero = false,
  clearValues = undefined,
  isFacetView = true,
  setHasData = () => null,
}: RangeInputWithPrefixedRangesProps) => {
  const [isGroupExpanded, setIsGroupExpanded] = useState(false); // handles the expanded group

  // get the current filter for this facet
  const filter = hooks.useGetFacetFilters(field);
  const totalCount = hooks.useTotalCounts();

  // giving the filter value, extract the From/To values and
  // build it's key
  const [filterValues, filterKey] = useMemo(() => {
    const values = extractRangeValues<number>(filter);
    const key = ClassifyRangeType(values);
    return [values, key];
  }, [filter]);

  const queryInYears = rangeDatatype === "age_in_years";
  // build the range for the useRangeFacet and the facet query
  const [bucketRanges, ranges] = useMemo(() => {
    return buildRangeBuckets(numBuckets, units, minimum, queryInYears);
  }, [minimum, numBuckets, units, queryInYears]);

  const [isCustom, setIsCustom] = useState(filterKey === "custom"); // in custom Range Mode
  const [selectedRange, setSelectedRange] = useState(filterKey); // the current selected range

  const { data: rangeData, isSuccess } = hooks.useGetFacetData(field, ranges);
  const rangeLabelsAndValues = BuildRangeLabelsAndValues(
    bucketRanges,
    totalCount,
    rangeData,
    showZero,
  );
  const chartData = useMemo(
    () =>
      Object.fromEntries(
        Object.values(rangeLabelsAndValues).map((range) => [
          range.label,
          range.value,
        ]),
      ),
    [rangeLabelsAndValues],
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
  const numberOfBarsToDisplay = isGroupExpanded
    ? Math.min(16, totalBuckets)
    : Math.min(DEFAULT_VISIBLE_ITEMS, totalBuckets);

  const onShowModeChanged = () => {
    setIsGroupExpanded(!isGroupExpanded);
  };

  // informs the parent component if there is data or no data
  // only used by the DaysOrYears component
  useDeepCompareEffect(() => {
    if (isSuccess && filterValues === undefined && totalBuckets === 0)
      setHasData(false);
    else setHasData(true);
  }, [filterValues, isSuccess, setHasData, totalBuckets]);

  // If no data and no filter values, show the no data message
  // otherwise this facet has some filters set and the custom range
  // should be shown
  if (isSuccess && filterValues === undefined && totalBuckets === 0) {
    return (
      <div className="mx-4 font-content pb-2 text-sm">
        No data for this field
      </div>
    );
  }

  return (
    <>
      <LoadingOverlay data-testid="loading-spinner" visible={!isSuccess} />
      <div className="flex flex-col space-y-2 mt-1 ">
        <div className="flex justify-items-stretch items-center">
          <input
            aria-label="custom range"
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
            {...hooks}
            clearValues={clearValues}
          />
        </div>
        <div
          className={
            isFacetView
              ? `flip-card h-full `
              : `flip-card flip-card-flipped h-full`
          }
        >
          <div
            className={`flex flex-col border-t-2 card-face bg-base-max ${
              !isFacetView ? "invisible" : ""
            }`}
          >
            {totalBuckets == 0 ? (
              <div className="mx-4 font-content">No data for this field</div>
            ) : isSuccess ? (
              <RangeValueSelector
                field={`${field}`}
                valueLabel={valueLabel}
                itemsToShow={bucketsToShow}
                rangeLabelsAndValues={rangeLabelsAndValues}
                selected={selectedRange}
                useUpdateFacetFilters={hooks.useUpdateFacetFilters}
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
          <div
            className={`card-face card-back rounded-b-md bg-base-max h-full pb-1 ${
              isFacetView ? "invisible" : ""
            }`}
          >
            {!isFacetView && totalBuckets > 0 && (
              <EnumFacetChart
                field={field}
                data={chartData}
                selectedEnums={[]}
                showTitle={false}
                isSuccess={isSuccess}
                valueLabel={valueLabel}
                maxBins={numberOfBarsToDisplay}
                height={
                  (numberOfBarsToDisplay == 1
                    ? 110
                    : numberOfBarsToDisplay == 2
                    ? 220
                    : numberOfBarsToDisplay == 3
                    ? 240
                    : numberOfBarsToDisplay * 65 + 10) -
                  (isGroupExpanded ? 15 : 0)
                }
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const DaysOrYears: React.FC<NumericFacetData> = ({
  field,
  rangeDatatype,
  hooks,
  valueLabel,
  clearValues,
  isFacetView,
}: NumericFacetData) => {
  const [units, setUnits] = useState("years");
  // no data if true means the Day/Year SegmentedControl should not be rendered.
  // TODO: this is not ideal and perhaps should be refactored
  const [hasData, setHasData] = useState(true);
  // set up a fixed range -90 to 90 years over 19 buckets
  const rangeMinimum = -32873;
  const rangeMaximum = 32873;
  const numBuckets = 18;

  return (
    <div className="flex flex-col w-100 space-y-2 px-2 mt-1 ">
      {hasData && (
        <SegmentedControl
          data={[
            { label: "Days", value: "days" },
            { label: "Years", value: "years" },
          ]}
          value={units}
          color="primary"
          onChange={setUnits}
        />
      )}

      <RangeInputWithPrefixedRanges
        units={units}
        rangeDatatype={rangeDatatype}
        hooks={{ ...hooks }}
        minimum={rangeMinimum}
        maximum={rangeMaximum}
        numBuckets={numBuckets}
        field={field}
        valueLabel={valueLabel}
        clearValues={clearValues}
        isFacetView={isFacetView}
        setHasData={(value) => setHasData(value)}
      />
    </div>
  );
};

const Year: React.FC<NumericFacetData> = ({
  field,
  hooks,
  valueLabel,
  clearValues,
  minimum = undefined,
  maximum = undefined,
  isFacetView,
}: NumericFacetData) => {
  const adjMinimum = minimum != undefined ? minimum : 1900;
  const adjMaximum = maximum != undefined ? maximum : 2050;
  const numBuckets = Math.round((adjMaximum - adjMinimum) / 10);

  return (
    <div className="flex flex-col w-100 space-y-2 px-2 mt-1 ">
      <RangeInputWithPrefixedRanges
        hooks={{ ...hooks }}
        units="year"
        valueLabel={valueLabel}
        minimum={adjMinimum}
        maximum={adjMaximum}
        numBuckets={numBuckets}
        field={field}
        clearValues={clearValues}
        isFacetView={isFacetView}
      />
    </div>
  );
};

const Years: React.FC<NumericFacetData> = ({
  field,
  valueLabel,
  hooks,
  clearValues,
  minimum = undefined,
  maximum = undefined,
  isFacetView,
}: NumericFacetData) => {
  const adjMinimum = minimum != undefined ? minimum : 0;
  const adjMaximum = maximum != undefined ? maximum : 89;
  const numBuckets = Math.round((adjMaximum - adjMinimum) / 10);

  return (
    <div className="flex flex-col w-100 space-y-2 px-1  mt-1 ">
      <RangeInputWithPrefixedRanges
        valueLabel={valueLabel}
        hooks={{ ...hooks }}
        units="years"
        minimum={adjMinimum}
        maximum={adjMaximum}
        numBuckets={numBuckets}
        field={field}
        clearValues={clearValues}
        isFacetView={isFacetView}
      />
    </div>
  );
};

const NumericRangePanel: React.FC<NumericFacetData> = ({
  field,
  hooks,
  clearValues,
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
        units="range"
        {...hooks}
        clearValues={clearValues}
      />
    </div>
  );
};

const PercentRange: React.FC<NumericFacetData> = ({
  field,
  valueLabel,
  hooks,
  clearValues,
  minimum = undefined,
  maximum = undefined,
  isFacetView,
}: NumericFacetData) => {
  const adjMinimum = minimum != undefined ? minimum : 0;
  const adjMaximum = maximum != undefined ? maximum : 100;
  const numBuckets = Math.round((adjMaximum - adjMinimum) / 10);

  return (
    <div className="flex flex-col w-100 space-y-2 px-2  mt-2">
      <RangeInputWithPrefixedRanges
        valueLabel={valueLabel}
        hooks={hooks}
        units="percent"
        minimum={adjMinimum}
        maximum={adjMaximum}
        numBuckets={numBuckets}
        field={field}
        clearValues={clearValues}
        isFacetView={isFacetView}
      />
    </div>
  );
};

/**
 * A component which manages a numeric range facet
 * @param field - field for this facet
 * @param hooks - hooks to manage facet
 * @param rangeDatatype - the datatype of the range
 * @param description - description of the facet
 * @param valueLabel  - string representing the datatype of values (e.g. "Cases")
 * @param minimum - minimum value for the range
 * @param maximum - maximum value for the range
 * @param facetName - name of the facet
 * @param dismissCallback  - function to call when facet is dismissed
 * @param width - width of the facet
 * @category Facets
 */

const NumericRangeFacet: React.FC<NumericFacetProps> = ({
  field,
  hooks,
  rangeDatatype,
  description,
  valueLabel,
  minimum = undefined,
  maximum = undefined,
  facetName = null,
  dismissCallback = undefined,
  width = undefined,
}: NumericFacetProps) => {
  const clearFilters = hooks.useClearFilter();
  const [isFacetView, setIsFacetView] = useState(true);

  const toggleFlip = () => {
    setIsFacetView(!isFacetView);
  };

  const [clearValues, setClearValues] = useState(false);

  useEffect(() => {
    if (clearValues) {
      setClearValues(false);
    }
  }, [clearValues]);
  return (
    <div
      className={`flex flex-col ${
        width ? width : "mx-0"
      } bg-base-max relative border-base-lighter border-1 rounded-b-md text-xs transition`}
      id={field}
    >
      <FacetHeader>
        <Tooltip
          disabled={!description}
          label={description}
          position="bottom-start"
          multiline
          w={220}
          withArrow
          transitionProps={{ duration: 200, transition: "fade" }}
        >
          <FacetText>
            {facetName ? facetName : fieldNameToTitle(field)}
          </FacetText>
        </Tooltip>
        <div className="flex flex-row">
          {rangeDatatype !== "range" && (
            <Tooltip label={isFacetView ? "Chart view" : "Selection view"}>
              <FacetIconButton
                onClick={toggleFlip}
                aria-pressed={!isFacetView}
                aria-label={isFacetView ? "Chart view" : "Selection view"}
              >
                <FlipIcon size="1.45em" className={controlsIconStyle} />
              </FacetIconButton>
            </Tooltip>
          )}
          <Tooltip label="Clear selection">
            <FacetIconButton
              onClick={() => {
                clearFilters(field);
                setClearValues(true);
              }}
              aria-label="clear selection"
            >
              <UndoIcon size="1.15em" />
            </FacetIconButton>
          </Tooltip>
          {dismissCallback ? (
            <Tooltip label="Remove the facet">
              <FacetIconButton
                onClick={() => {
                  dismissCallback(field);
                }}
                aria-label="Remove the facet"
              >
                <CloseIcon size="1.25em" />
              </FacetIconButton>
            </Tooltip>
          ) : null}
        </div>
      </FacetHeader>
      {
        {
          age: (
            <DaysOrYears
              valueLabel={valueLabel}
              field={field}
              rangeDatatype={rangeDatatype}
              hooks={{ ...hooks }}
              minimum={minimum}
              maximum={maximum}
              clearValues={clearValues}
              isFacetView={isFacetView}
            />
          ),
          age_in_years: (
            <DaysOrYears
              valueLabel={valueLabel}
              field={field}
              rangeDatatype={rangeDatatype}
              hooks={{ ...hooks }}
              minimum={minimum}
              maximum={maximum}
              clearValues={clearValues}
              isFacetView={isFacetView}
            />
          ),
          year: (
            <Year
              valueLabel={valueLabel}
              field={field}
              hooks={{ ...hooks }}
              minimum={minimum}
              maximum={maximum}
              clearValues={clearValues}
              isFacetView={isFacetView}
            />
          ),
          years: (
            <Years
              valueLabel={valueLabel}
              field={field}
              hooks={{ ...hooks }}
              minimum={minimum}
              maximum={maximum}
              clearValues={clearValues}
              isFacetView={isFacetView}
            />
          ),
          days: (
            <DaysOrYears
              valueLabel={valueLabel}
              field={field}
              rangeDatatype={rangeDatatype}
              hooks={{ ...hooks }}
              minimum={minimum}
              maximum={maximum}
              clearValues={clearValues}
              isFacetView={isFacetView}
            />
          ),
          percent: (
            <PercentRange
              valueLabel={valueLabel}
              field={field}
              hooks={{ ...hooks }}
              minimum={minimum}
              maximum={maximum}
              clearValues={clearValues}
              isFacetView={isFacetView}
            />
          ),
          range: (
            <NumericRangePanel
              valueLabel={valueLabel}
              field={field}
              hooks={{ ...hooks }}
              minimum={minimum}
              maximum={maximum}
              clearValues={clearValues}
              isFacetView={isFacetView}
            />
          ),
        }[rangeDatatype as string]
      }
    </div>
  );
};

export default NumericRangeFacet;
