import { Intersection, Union } from "../gdcapi/filters";

export const appendFilterToOperation = (
  filter: Intersection | Union | undefined,
  addition: Intersection | Union | undefined,
): Intersection | Union => {
  if (filter === undefined && addition === undefined)
    return { operator: "and", operands: [] };
  if (addition === undefined && filter) return filter;
  if (filter === undefined && addition) return addition;
  return { ...filter, operands: [...(filter?.operands || []), addition] } as
    | Intersection
    | Union;
};
