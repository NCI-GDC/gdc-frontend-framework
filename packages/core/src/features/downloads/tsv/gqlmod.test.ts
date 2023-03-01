import {
  getVersion,
  getGQLParams,
  getAliasFilters,
  getAliasGraphQLQuery,
} from "./gqlmod";

describe("getVersion", () => {
  it('should return the correct object for "genes"', () => {
    const result = getVersion("genes");
    expect(result).toEqual({ filters: "$filters_genes", id: "gene_id" });
  });

  it('should return the correct object for "ssms"', () => {
    const result = getVersion("ssms");
    expect(result).toEqual({ filters: "$filters_ssms", id: "ssm_id" });
  });

  it("should return an empty object for any other input", () => {
    const result = getVersion("empty");
    expect(result).toEqual({ filters: "", id: "" });
  });
});

describe("test getGQLParams for different entities", () => {
  it('should return the correct string for a single ID and "genes" version', () => {
    const result = getGQLParams(["123"], "genes");
    expect(result).toBe(
      "$filters_case: FiltersArgument,\nfilters_genes_123: FiltersArgument",
    );
  });

  it('should return the correct string for multiple IDs and "ssms" version', () => {
    const result = getGQLParams(["456", "789"], "ssms");
    expect(result).toBe(
      "$filters_case: FiltersArgument,\nfilters_ssms_456: FiltersArgument,\nfilters_ssms_789: FiltersArgument",
    );
  });
});

describe("test getAliasGraphQLQuery for different entities", () => {
  it('should return the correct string for a single ID and "genes" version', () => {
    const result = getAliasGraphQLQuery(["123"], "genes");
    expect(result).toContain(
      "$filters_case: FiltersArgument,\nfilters_genes_123: FiltersArgument",
    );
    expect(result).toContain("geneId");
  });

  it('should return the correct string for multiple IDs and "ssms" version', () => {
    const result = getAliasGraphQLQuery(["456", "789"], "ssms");
    expect(result).toContain(
      "$filters_case: FiltersArgument,\nfilters_ssms_456: FiltersArgument,\nfilters_ssms_789: FiltersArgument",
    );
    expect(result).toContain("ssmId");
  });
});

describe("returns correct gql aliased filters", () => {
  test("returns gql filters for 4 gene ids", () => {
    const { filters } = getAliasFilters(
      ["bulbasaur", "squirtle", "charmander"],
      "genes",
    );
    const pokeFilters = {
      filters_genes_bulbasaur: {
        op: "and",
        content: [
          {
            content: {
              field: "genes.gene_id",
              value: ["bulbasaur"],
            },
            op: "in",
          },
          {
            op: "NOT",
            content: {
              field: "cases.gene.ssm.observation.observation_id",
              value: "MISSING",
            },
          },
        ],
      },
      filters_genes_squirtle: {
        op: "and",
        content: [
          {
            content: {
              field: "genes.gene_id",
              value: ["squirtle"],
            },
            op: "in",
          },
          {
            op: "NOT",
            content: {
              field: "cases.gene.ssm.observation.observation_id",
              value: "MISSING",
            },
          },
        ],
      },
      filters_genes_charmander: {
        op: "and",
        content: [
          {
            content: {
              field: "genes.gene_id",
              value: ["charmander"],
            },
            op: "in",
          },
          {
            op: "NOT",
            content: {
              field: "cases.gene.ssm.observation.observation_id",
              value: "MISSING",
            },
          },
        ],
      },
    };
    expect(filters).toEqual(pokeFilters);
  });
});
