import { FilterSet } from "../filters";
import { extractFiltersWithPrefixFromFilterSet } from "../utils";

describe("extract filters by prefix", () => {
  test("should return a FilterSet with only the filters that have the given prefix in their field name", () => {
    const fs: FilterSet = {
      mode: "and",
      root: {
        "genes.is_cancer_gene_census": {
          field: "genes.is_cancer_gene_census",
          operator: "includes",
          operands: ["true"],
        },
        "genes.biotype": {
          operator: "includes",
          field: "genes.biotype",
          operands: ["protein_coding"],
        },
        "ssms.consequence.transcript.annotation.vep_impact": {
          operator: "includes",
          field: "ssms.consequence.transcript.annotation.vep_impact",
          operands: ["moderate"],
        },
      },
    };

    const result = extractFiltersWithPrefixFromFilterSet(fs, "genes.");

    expect(result).toEqual({
      mode: "and",
      root: {
        "genes.biotype": {
          field: "genes.biotype",
          operands: ["protein_coding"],
          operator: "includes",
        },
        "genes.is_cancer_gene_census": {
          field: "genes.is_cancer_gene_census",
          operands: ["true"],
          operator: "includes",
        },
      },
    });
  });

  test("should return an empty FilterSet", () => {
    const fs: FilterSet = {
      mode: "and",
      root: {
        "genes.is_cancer_gene_census": {
          field: "genes.is_cancer_gene_census",
          operator: "includes",
          operands: ["true"],
        },
        "genes.biotype": {
          operator: "includes",
          field: "genes.biotype",
          operands: ["protein_coding"],
        },
        "ssms.consequence.transcript.annotation.vep_impact": {
          operator: "includes",
          field: "ssms.consequence.transcript.annotation.vep_impact",
          operands: ["moderate"],
        },
      },
    };

    const result = extractFiltersWithPrefixFromFilterSet(fs, "cases.");

    expect(result).toEqual({
      mode: "and",
      root: {},
    });
  });
});
