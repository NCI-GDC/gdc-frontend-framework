import { GqlOperation } from "@gff/core";

export const buildGeneHaveAndHaveNotFilters = (
  currentFilters: GqlOperation,
  symbol: string,
  field: string,
  isGene: boolean,
): ReadonlyArray<GqlOperation> => {
  /**
   * given the contents, add two filters, one with the gene and one without
   */

  if (symbol === undefined) return [];

  return [
    {
      op: "and",
      content: [
        {
          //TODO: refactor cohortFilters to be Union | Intersection
          op: "excludeifany",
          content: {
            field: field,
            value: symbol,
          },
        },
        {
          content: {
            field: "cases.available_variation_data",
            value: isGene ? ["ssm", "cnv"] : ["ssm"],
          },
          op: "in",
        },
        ...(currentFilters ? (currentFilters.content as any) : []),
      ],
    },
    {
      op: "and",
      content: [
        {
          op: "=",
          content: {
            field: field,
            value: symbol,
          },
        },
        ...(currentFilters ? (currentFilters.content as any) : []),
      ],
    },
  ];
};
