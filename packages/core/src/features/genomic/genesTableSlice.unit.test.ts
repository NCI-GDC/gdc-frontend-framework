import { buildGeneTableSearchFilters } from "./genesTableSlice";
import { appendFilterToOperation } from "./utils";
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

  test(`add search filters`, () => {
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

    const cohortGQLFilters = filterSetToOperation(cohortFilter) as
      | Union
      | Intersection
      | undefined;
    const searchFilters = buildGeneTableSearchFilters("protein");
    expect(
      appendFilterToOperation(cohortGQLFilters, searchFilters as Union),
    ).toEqual(expected);
  });

  test(`add empty filters`, () => {
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
      ],
    };
    const cohortGQLFilters = filterSetToOperation(cohortFilter) as
      | Union
      | Intersection
      | undefined;

    expect(appendFilterToOperation(cohortGQLFilters, undefined)).toEqual(
      expected,
    );
  });
});
