import {
  Intersection,
  Union,
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

export const getSSMTestedCases = (geneSymbol?: string): GqlOperation => {
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
      // ...gqlCohortIntersection,
    ],
    op: "and",
  };
};

/**
 * Get a the SSM tested cases for a gene
 * @param geneSymbol - gene symbol
 */
export const getSSMGeneTestedCases = (geneSymbol?: string): GqlOperation => {
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
    ],
    op: "and",
  };
};
