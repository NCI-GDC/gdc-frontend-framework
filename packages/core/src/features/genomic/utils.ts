import { Intersection, Union } from "../gdcapi/filters";

export const appendFilterToOperation = (
  filter: Intersection | Union | undefined,
  addition: Intersection | Union | undefined,
): Intersection | Union => {
  if (filter === undefined)
    return { operator: "and", operands: addition ? [addition] : [] };
  return {
    ...filter,
    operands: addition ? [...filter.operands, addition] : filter.operands,
  };
};
