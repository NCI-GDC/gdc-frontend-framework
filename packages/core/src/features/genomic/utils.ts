import { FilterSet, buildCohortGqlOperator } from "../cohort";
import {
  Intersection,
  Union,
  GqlIntersection,
  GqlOperation,
  GqlIncludes,
} from "../gdcapi/filters";

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

export const getSSMTestedCases = (
  cohortFilters: FilterSet,
  geneSymbol?: string,
): GqlOperation => {
  const cohortFiltersGQl = buildCohortGqlOperator(cohortFilters);

  const gqlCohortIntersection =
    cohortFiltersGQl && (cohortFiltersGQl as GqlIntersection).content
      ? (cohortFiltersGQl as GqlIntersection).content
      : [];

  return {
    content: [
      ...[
        {
          content: {
            field: "available_variation_data",
            value: ["ssm"],
          },
          op: "in",
        } as GqlIncludes,
        ...(geneSymbol
          ? [
              {
                content: {
                  field: "genes.symbol",
                  value: [geneSymbol],
                },
                op: "in",
              } as GqlIncludes,
            ]
          : []),
      ],
      // For case filter only use cohort filter and not genomic filter
      ...gqlCohortIntersection,
    ],
    op: "and",
  };
};
