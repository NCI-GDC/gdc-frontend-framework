import { useState } from "react";
import FacetSortPanel from "../FacetSortPanel";
import {
  FromToRange,
  RangeBucketElement,
  SortType,
  UpdateFacetFilterFunction,
} from "../types";
import { buildRangeOperator } from "../utils";
import { radioStyle } from "./utils";

interface RangeValueSelectorProps {
  readonly itemsToShow: number;
  readonly field: string;
  readonly valueLabel: string;
  readonly rangeLabelsAndValues: Record<string, RangeBucketElement>;
  selected: string;
  setSelected: (value: string) => void;
  useUpdateFacetFilters: () => UpdateFacetFilterFunction;
}

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
                  className={radioStyle}
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

export default RangeValueSelector;
