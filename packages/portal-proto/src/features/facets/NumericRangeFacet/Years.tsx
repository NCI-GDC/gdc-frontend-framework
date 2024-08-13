import RangeInputWithPrefixedRanges from "./RangeInputWithPrefixedRanges";
import { NumericFacetData } from "./types";

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

export default Years;