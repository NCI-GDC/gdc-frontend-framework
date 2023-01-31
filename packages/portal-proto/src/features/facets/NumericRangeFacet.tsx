import React, { useCallback, useEffect, useMemo, useState } from "react";
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

import {
  DEFAULT_VISIBLE_ITEMS,
  getLowerAgeYears,
  buildRangeOperator,
  extractRangeValues,
  buildRangeBuckets,
  adjustAgeInYearsToDays,
  adjustAgeInDaysToDays,
  getUpperAgeYears,
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
 * represents bucket for a range > "from" <= "to"
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
  const [isSortedByValue, setIsSortedByValue] = useState(false);

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
            isSortedByValue={isSortedByValue}
            valueLabel={valueLabel}
            setIsSortedByValue={setIsSortedByValue}
            isNumberSort={true}
          />
        </>
      ) : null}
      <div role="group" className="mt-1">
        {Object.keys(rangeLabelsAndValues)
          .slice(0, itemsToShow)
          .sort(
            isSortedByValue
              ? (a, b) =>
                  rangeLabelsAndValues[b].value - rangeLabelsAndValues[a].value
              : (a, b) =>
                  rangeLabelsAndValues[a].from - rangeLabelsAndValues[b].from,
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
 * @param clearValues: prop set to true to clear FromTo input fields
 * @param useUpdateFacetFilters - hook to update facet filters with new values
 * @constructor
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
  console.log("from value", fromValue, units);
  return (
    <div className="relative w-full">
      <div className="flex flex-col text-base-contrast-max bg-base-max text-md ">
        <div className="flex flex-row justify-end items-center flex-nowrap border">
          <div className="basis-1/5 text-center">From</div>
          <SegmentedControl
            className="basis-2/5"
            size="sm"
            value={fromOp}
            onChange={(value) => {
              setFromOp(value as RangeFromOp);
              setFromValue(
                adjustAgeInDaysToDays(fromOp as RangeFromOp, fromValue, units),
              );
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
            placeholder={`eg. ${lowerUnitRange}${unitsLabel} `}
            min={lowerUnitRange}
            max={upperUnitRange}
            value={units !== "years" ? fromValue : getUpperAgeYears(fromValue)}
            onChange={(value) => {
              setFromValue(
                adjustAgeInYearsToDays(fromOp as RangeFromOp, value, units),
              );
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
              setToValue(
                adjustAgeInDaysToDays(value as RangeToOp, toValue, units),
              );
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
            placeholder={`eg. ${upperUnitRange}${unitsLabel} `}
            min={lowerUnitRange}
            max={upperUnitRange}
            onChange={(value) => {
              setToValue(
                adjustAgeInYearsToDays(toOp as RangeFromOp, value, units),
              );
              changedCallback();
            }}
            value={units !== "years" ? toValue : getUpperAgeYears(toValue)}
            hideControls
            aria-label="input to value"
          />
        </div>
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
        ? `${rangeData[x].toLocaleString()} (${(
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
  readonly hooks: RangeFacetHooks;
  readonly numBuckets: number;
  readonly minimum: number;
  readonly maximum: number;
  readonly units: string;
  readonly valueLabel: string;
  readonly showZero?: boolean;
  readonly clearValues?: boolean;
  readonly isFacetView?: boolean;
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
  showZero = false,
  clearValues = undefined,
  isFacetView = true,
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

  // build the range for the useRangeFacet and the facet query
  const [bucketRanges, ranges] = useMemo(() => {
    return buildRangeBuckets(numBuckets, units, minimum);
  }, [minimum, numBuckets, units]);

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

  return (
    <>
      <LoadingOverlay visible={!isSuccess} />
      <div className="flex flex-col w-100 space-y-2 mt-1 ">
        <div className="flex flex-row  justify-items-stretch items-center">
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
              <div className="mx-4">No data for this field</div>
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
            className={`card-face card-back bg-base-max h-full pb-1 ${
              isFacetView ? "invisible" : ""
            }`}
          >
            {!isFacetView && (
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
  hooks,
  valueLabel,
  clearValues,
  isFacetView,
}: NumericFacetData) => {
  const [units, setUnits] = useState("years");
  // set up a fixed range -90 to 90 years over 19 buckets
  const rangeMinimum = -32872.5;
  const rangeMaximum = 32872.5;
  const numBuckets = 19;

  return (
    <div className="flex flex-col w-100 space-y-2 px-2  mt-1 ">
      <SegmentedControl
        data={[
          { label: "Days", value: "days" },
          { label: "Years", value: "years" },
        ]}
        value={units}
        color={"primary.2"}
        onChange={setUnits}
      />
      <RangeInputWithPrefixedRanges
        units={units}
        hooks={{ ...hooks }}
        minimum={rangeMinimum}
        maximum={rangeMaximum}
        numBuckets={numBuckets}
        field={field}
        valueLabel={valueLabel}
        clearValues={clearValues}
        isFacetView={isFacetView}
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
    <div className="flex flex-col w-100 space-y-2 px-2  mt-1 ">
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
        units=""
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
    <div className="flex flex-col w-100 space-y-2 px-2  mt-1 ">
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
    <div id={field}>
      <div
        className={`flex flex-col ${
          width ? width : "mx-1"
        } bg-base-max relative shadow-lg border-base-lightest border-1 rounded-b-md text-xs transition `}
      >
        <FacetHeader>
          <Tooltip
            label={description}
            classNames={{
              arrow: "bg-base-light",
              tooltip: "bg-base-max text-base-contrast-max",
            }}
            position="bottom-start"
            multiline
            width={220}
            withArrow
            transition="fade"
            transitionDuration={200}
          >
            <FacetText>
              {facetName ? facetName : fieldNameToTitle(field)}
            </FacetText>
          </Tooltip>
          <div className="flex flex-row">
            <FacetIconButton
              onClick={toggleFlip}
              aria-label="Flip between form and chart"
            >
              <FlipIcon size="1.45em" className={controlsIconStyle} />
            </FacetIconButton>
            <FacetIconButton
              onClick={() => {
                clearFilters(field);
                setClearValues(true);
              }}
            >
              <UndoIcon size="1.15em" />
            </FacetIconButton>
            {dismissCallback ? (
              <FacetIconButton
                onClick={() => {
                  clearFilters(field);
                  dismissCallback(field);
                }}
                aria-label="Remove the facet"
              >
                <CloseIcon size="1.25em" />
              </FacetIconButton>
            ) : null}
          </div>
        </FacetHeader>
        {
          {
            age: (
              <DaysOrYears
                valueLabel={valueLabel}
                field={field}
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
    </div>
  );
};

export default NumericRangeFacet;
