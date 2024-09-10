import RangeInputWithPrefixedRanges from "./RangeInputWithPrefixedRanges";
import { NumericFacetData } from "./types";

// Calendar Year
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

export default Year;
