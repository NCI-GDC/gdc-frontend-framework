import {
  convertFilterToGqlFilter,
  FilterSet,
  GqlIntersection,
  GqlOperation,
  GqlUnion,
} from "@gff/core";

// TODO Move this to core and deprecate buildCohortGqlOperator
/**
 * Converts a FilterSet into a possible empty GqlUnion or GqlIntersection
 * This is also intended to replace buildCohortGqlOperator
 * @param fs - FilterSet to convert to Gql representation
 */
export const FilterSet2GqlOperator = (
  fs: FilterSet | undefined,
): GqlUnion | GqlIntersection => {
  if (!fs) return { op: "and", content: [] };
  switch (fs.mode) {
    case "and":
      return Object.keys(fs.root).length == 0
        ? { op: "and", content: [] }
        : {
            // TODO: Replace fixed AND with cohort top level operation like Union or Intersection
            op: fs.mode,
            content: Object.keys(fs.root).map((k): GqlOperation => {
              return convertFilterToGqlFilter(fs.root[k]);
            }),
          };
  }
  return { op: "and", content: [] };
};
