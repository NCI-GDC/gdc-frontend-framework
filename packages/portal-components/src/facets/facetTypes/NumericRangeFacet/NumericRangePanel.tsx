import React from "react";
import { useDeepCompareMemo } from "use-deep-compare";
import { extractRangeValues } from "../../utils";
import FromTo from "./FromTo";
import { NumericFacetProps } from "./types";
import { classifyRangeType } from "./utils";

const NumericRangePanel: React.FC<NumericFacetProps> = ({
  field,
  hooks,
  clearValues,
  minimum = undefined,
  maximum = undefined,
}) => {
  const adjMinimum = minimum != undefined ? minimum : 0;
  const adjMaximum = maximum != undefined ? maximum : 999999;

  const filter = hooks.useGetFacetFilters(field);
  const [filterValues] = useDeepCompareMemo(() => {
    const values = extractRangeValues<number>(filter);
    const key = classifyRangeType(values);
    return [values, key];
  }, [filter]);

  return (
    <div className="px-2 my-2">
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
