import {
  buildGeneTableSearchFilters,
  appendFilterToOperation,
} from "./genesTableSlice";
import { FilterSet, filterSetToOperation } from "../cohort";
import { Intersection, Union } from "../gdcapi/filters";

describe("Test creation of geneTable Filters with Search term", () => {
  const cohortFilter = {
    mode: "and",
    root: {
      "cases.primary_site": {
        operator: "includes",
        field: "cases.primary_site",
        operands: ["breast", "bronchus and lung"],
      },
      disease_type: {
        operator: "includes",
        field: "disease_type",
        operands: ["ductal and lobular neoplasms"],
      },
    },
  } as FilterSet;

  const expected = {
    operator: "and",
    operands: [
      {
        operator: "includes",
        field: "cases.primary_site",
        operands: ["breast", "bronchus and lung"],
      },
      {
        operator: "includes",
        field: "disease_type",
        operands: ["ductal and lobular neoplasms"],
      },
      {
        operator: "or",
        operands: [
          {
            operator: "includes",
            field: "genes.cytoband",
            operands: ["*protein*"],
          },
          {
            operator: "includes",
            field: "genes.gene_id",
            operands: ["*protein*"],
          },
          {
            operator: "includes",
            field: "genes.symbol",
            operands: ["*protein*"],
          },
          {
            operator: "includes",
            field: "genes.name",
            operands: ["*protein*"],
          },
        ],
      },
    ],
  };

  test(`add search filters`, () => {
    const cohortGQLFilters = filterSetToOperation(cohortFilter) as
      | Union
      | Intersection
      | undefined;
    const searchFilters = buildGeneTableSearchFilters("protein");
    expect(appendFilterToOperation(cohortGQLFilters, searchFilters)).toEqual(
      expected,
    );
  });
});
