import { Intersection, Union } from "../gdcapi/filters";

export const appendFilterToOperation = (
  filter: Intersection | Union | undefined,
  addition: Intersection | Union | undefined,
): Intersection | Union => {
  if (filter === undefined) return { operator: "and", operands: [] };
  if (addition === undefined) return filter;
  return { ...filter, operands: [...filter.operands, addition] };
};
