import { useDeepCompareMemo } from "use-deep-compare";
import { extractRangeValues } from "../utils";
import FromTo from "./FromTo";
import { NumericFacetData } from "./types";
import { classifyRangeType } from "./utils";

const NumericRangePanel: React.FC<NumericFacetData> = ({
  field,
  hooks,
  clearValues,
  minimum = undefined,
  maximum = undefined,
}: NumericFacetData) => {
  const adjMinimum = minimum != undefined ? minimum : 0;
  const adjMaximum = maximum != undefined ? maximum : 999999;

  const filter = hooks.useGetFacetFilters(field);
  const [filterValues] = useDeepCompareMemo(() => {
    const values = extractRangeValues<number>(filter);
    const key = classifyRangeType(values);
    return [values, key];
  }, [filter]);

  return (
    <div>
      <FromTo
        field={field}
        minimum={adjMinimum}
        maximum={adjMaximum}
        values={filterValues}
        {...hooks}
        clearValues={clearValues}
      />
    </div>
  );
};

export default NumericRangePanel;
