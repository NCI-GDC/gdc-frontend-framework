import React from "react";
import RangeInputWithPrefixedRanges from "./RangeInputWithPrefixedRanges";
import { NumericFacetProps } from "./types";

const PercentRange: React.FC<NumericFacetProps> = ({
  field,
  valueLabel,
  hooks,
  clearValues,
  minimum = undefined,
  maximum = undefined,
  isFacetView,
  queryOptions,
  Chart,
}) => {
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
        queryOptions={queryOptions}
        Chart={Chart}
      />
    </div>
  );
};

export default PercentRange;
