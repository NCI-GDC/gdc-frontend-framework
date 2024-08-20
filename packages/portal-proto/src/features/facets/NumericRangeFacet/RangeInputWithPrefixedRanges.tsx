import { EnumFacetChart } from "@/features/charts/EnumFacetChart";
import { LoadingOverlay } from "@mantine/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDeepCompareEffect } from "use-deep-compare";
import FacetExpander from "../FacetExpander";
import { RangeFacetHooks } from "../types";
import {
  buildRangeBuckets,
  DEFAULT_VISIBLE_ITEMS,
  extractRangeValues,
} from "../utils";
import FromTo from "./FromTo";
import RangeValueSelector from "./RangeValueSelector";
import {
  buildRangeLabelsAndValues,
  classifyRangeType,
  radioStyle,
} from "./utils";

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
  const totalCount = hooks.useTotalCounts(field);

  // giving the filter value, extract the From/To values and
  // build it's key
  const [filterValues, filterKey] = useMemo(() => {
    const values = extractRangeValues<number>(filter);
    const key = classifyRangeType(values);
    return [values, key];
  }, [filter]);

  const queryInYears = rangeDatatype === "age_in_years";
  // build the range for the useRangeFacet and the facet query
  const [bucketRanges, ranges] = useMemo(() => {
    return buildRangeBuckets(numBuckets, units, minimum, queryInYears);
  }, [minimum, numBuckets, units, queryInYears]);

  const [isCustom, setIsCustom] = useState(filterKey === "custom"); // in custom Range Mode
  const [selectedRange, setSelectedRange] = useState(filterKey); // the current selected range

  const { data: rangeData, isSuccess } = hooks.useGetRangeFacetData(
    field,
    ranges,
  );
  const rangeLabelsAndValues = buildRangeLabelsAndValues(
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
      <div className="flex flex-col space-y-2 mt-1">
        <div className="flex justify-items-stretch items-center">
          <div>
            <input
              aria-label="custom range"
              type="radio"
              className={radioStyle}
              id={`${field}_custom`}
              name={`${field}_range_selection`}
              checked={selectedRange === "custom"}
              onChange={() => {
                setSelectedRange("custom");
                setIsCustom(true);
              }}
            />
          </div>
          <FromTo
            minimum={minimum}
            maximum={maximum}
            values={filterValues}
            field={`${field}`}
            units={units}
            changedCallback={resetToCustom}
            {...hooks}
            clearValues={clearValues}
            rangeDatatype={rangeDatatype}
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

export default RangeInputWithPrefixedRanges;
