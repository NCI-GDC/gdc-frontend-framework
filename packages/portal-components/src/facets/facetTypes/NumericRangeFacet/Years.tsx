import React from "react";
import RangeInputWithPrefixedRanges from "./RangeInputWithPrefixedRanges";
import { NumericFacetProps } from "./types";

const Years: React.FC<NumericFacetProps> = ({
  field,
  valueLabel,
  rangeDatatype,
  hooks,
  clearValues,
  minimum = undefined,
  maximum = undefined,
  isFacetView,
  queryOptions,
  Chart,
}: NumericFacetProps) => {
  const adjMinimum = minimum ?? 0;
  const adjMaximum = maximum ?? 89;
  const numBuckets = Math.round((adjMaximum - adjMinimum) / 10);

  return (
    <div className="flex flex-col w-full space-y-2 px-1  mt-1 ">
      <RangeInputWithPrefixedRanges
        valueLabel={valueLabel}
        hooks={{ ...hooks }}
        rangeDatatype={rangeDatatype}
        units="years"
        minimum={adjMinimum}
        maximum={adjMaximum}
        numBuckets={numBuckets}
        field={field}
        clearValues={clearValues}
        isFacetView={isFacetView}
        queryOptions={queryOptions}
        Chart={Chart}
      />
    </div>
  );
};

export default Years;
