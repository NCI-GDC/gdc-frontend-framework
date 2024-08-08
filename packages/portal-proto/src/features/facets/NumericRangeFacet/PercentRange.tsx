import RangeInputWithPrefixedRanges from "./RangeInputWithPrefixedRanges";
import { NumericFacetData } from "./types";

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

export default PercentRange;
