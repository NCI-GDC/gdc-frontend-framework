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
    expect(result).toEqual(
      expect.stringContaining("$filters_case: FiltersArgument"),
    );
    expect(result).toEqual(
      expect.stringContaining("$filters_genes_123: FiltersArgument"),
    );
  });

  it('should return the correct string for multiple IDs and "ssms" version', () => {
    const result = getGQLParams(["456", "789"], "ssms");
    expect(result).toEqual(
      expect.stringContaining("$filters_case: FiltersArgument"),
    );
    expect(result).toEqual(
      expect.stringContaining("$filters_ssms_456: FiltersArgument"),
    );
    expect(result).toEqual(
      expect.stringContaining("$filters_ssms_789: FiltersArgument"),
    );
  });
});

describe("test getAliasGraphQLQuery for different entities", () => {
  it('should return the correct string for a single ID and "genes" version', () => {
    const result = getAliasGraphQLQuery(["123"], "genes");
    expect(result).toEqual(
      expect.stringContaining("$filters_genes_123: FiltersArgument"),
    );
  });

  it('should return the correct string for multiple IDs and "ssms" version', () => {
    const result = getAliasGraphQLQuery(["456", "789"], "ssms");
    expect(result).toEqual(expect.stringContaining("filters_ssms_456"));
    expect(result).toEqual(expect.stringContaining("filters_ssms_789"));
  });
});

describe("getAliasFilters", () => {
  it("returns expected filters for single id and genes version", () => {
    const ids = ["id1"];
    const version = "genes";
    const expectedFilters = {
      filters_genes_id1: {
        op: "and",
        content: [
          {
            content: {
              field: "genes.gene_id",
              value: ["id1"],
            },
            op: "in",
          },
          {
            content: {
              field: "cases.gene.ssm.observation.observation_id",
              value: "MISSING",
            },
            op: "NOT",
          },
        ],
      },
      ...{
        filters_case: {
          content: {
            field: "cases.gene.ssm.observation.observation_id",
            value: "MISSING",
          },
          op: "NOT",
        },
      },
    };
    expect(getAliasFilters(ids, version)).toEqual(expectedFilters);
  });

  it("returns expected filters for multiple ids and ssms version", () => {
    const ids = ["id1", "id2"];
    const version = "ssms";
    const expectedFilters = {
      filters_ssms_id1: {
        op: "and",
        content: [
          {
            content: {
              field: "ssms.ssm_id",
              value: ["id1"],
            },
            op: "in",
          },
          {
            content: {
              field: "cases.gene.ssm.observation.observation_id",
              value: "MISSING",
            },
            op: "NOT",
          },
        ],
      },
      filters_ssms_id2: {
        op: "and",
        content: [
          {
            content: {
              field: "ssms.ssm_id",
              value: ["id2"],
            },
            op: "in",
          },
          {
            content: {
              field: "cases.gene.ssm.observation.observation_id",
              value: "MISSING",
            },
            op: "NOT",
          },
        ],
      },
      ...{
        filters_case: {
          content: {
            field: "cases.gene.ssm.observation.observation_id",
            value: "MISSING",
          },
          op: "NOT",
        },
      },
    };
    expect(getAliasFilters(ids, version)).toEqual(expectedFilters);
  });
});
