import { coreStore } from "../../store";
import { graphqlAPISlice } from "../gdcapi/gdcgraphql";
import {
  buildGeneTableSearchFilters,
  genesTableApiSlice,
} from "./genesTableSlice";
import { appendFilterToOperation } from "./utils";
import { FilterSet, filterSetToOperation } from "../cohort";
import { Intersection, Union } from "../gdcapi/filters";

const emptyFilters: FilterSet = { mode: "and", root: {} };

const tp53Node = {
  id: "gene-tp53",
  numCases: 40,
  symbol: "TP53",
  name: "tumor protein p53",
  cytoband: ["17p13.1"],
  biotype: "protein_coding",
  gene_id: "ENSG00000141510",
  is_cancer_gene_census: true,
  ssm_case: { hits: { total: 41 } },
  cnv_case: { hits: { total: 30 } },
  case_cnv_gain: { hits: { total: 5 } },
  case_cnv_loss: { hits: { total: 6 } },
  case_cnv_amplification: { hits: { total: 7 } },
  case_cnv_homozygous_deletion: { hits: { total: 8 } },
};

const genesTableResponse = {
  data: {
    genesTableViewer: {
      explore: {
        cases: { hits: { total: 100 } },
        filteredCases: { hits: { total: 80 } },
        cnvCases: { hits: { total: 60 } },
        genes: { hits: { total: 1, edges: [{ node: tp53Node }] } },
      },
    },
  },
};

const mutationCountsResponse = {
  data: {
    ssmsAggregationsViewer: {
      explore: {
        ssms: {
          aggregations: {
            consequence__transcript__gene__gene_id: {
              buckets: [{ key: "ENSG00000141510", doc_count: 1234 }],
            },
          },
        },
      },
    },
  },
};

describe("genes table endpoint", () => {
  let respondTo: {
    genesTable: () => unknown;
    mutationCounts: () => unknown;
  };
  const fetchSpy: jest.SpyInstance = jest
    .spyOn(global, "fetch")
    .mockImplementation(
      jest.fn((_url: string, init: RequestInit) => {
        const { query } = JSON.parse(String(init.body));
        const response = query.includes("query GenesTable")
          ? respondTo.genesTable()
          : respondTo.mutationCounts();
        return Promise.resolve({ ok: true, json: () => response });
      }) as jest.Mock,
    );

  const requestedVariables = () =>
    fetchSpy.mock.calls.map(([, init]) => JSON.parse(init.body).variables);

  const fetchGenesTable = () =>
    coreStore.dispatch(
      genesTableApiSlice.endpoints.genesTable.initiate(
        {
          pageSize: 10,
          offset: 0,
          genesTableFilters: emptyFilters,
          genomicFilters: emptyFilters,
          cohortFilters: emptyFilters,
        },
        { subscribe: false },
      ),
    );

  afterAll(() => {
    coreStore.dispatch(graphqlAPISlice.util.resetApiState());
  });

  beforeEach(() => {
    jest.clearAllMocks();
    coreStore.dispatch(graphqlAPISlice.util.resetApiState());
    respondTo = {
      genesTable: () => genesTableResponse,
      mutationCounts: () => mutationCountsResponse,
    };
  });

  test("returns the genes with mutation counts for the genes on the page", async () => {
    const { data } = await fetchGenesTable();

    expect(data).toEqual({
      cases: 100,
      filteredCases: 80,
      cnvCases: 60,
      genes_total: 1,
      mutationCounts: { ENSG00000141510: "1,234" },
      genes: [
        {
          id: "gene-tp53",
          numCases: 40,
          symbol: "TP53",
          name: "tumor protein p53",
          cytoband: ["17p13.1"],
          biotype: "protein_coding",
          gene_id: "ENSG00000141510",
          is_cancer_gene_census: true,
          ssm_case: 41,
          cnv_case: 30,
          case_cnv_gain: 5,
          case_cnv_loss: 6,
          case_cnv_amplification: 7,
          case_cnv_homozygous_deletion: 8,
        },
      ],
    });
    expect(
      requestedVariables()[1].ssmCountsfilters.content[0].content.value,
    ).toEqual(["ENSG00000141510"]);
  });

  test("fails when the genes table query returns errors", async () => {
    respondTo.genesTable = () => ({ errors: { filters: "bad filter" } });

    const { isError } = await fetchGenesTable();

    expect(isError).toBe(true);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  test("still returns the genes when the mutation counts query fails", async () => {
    respondTo.mutationCounts = () => ({ errors: { filters: "bad filter" } });

    const { data } = await fetchGenesTable();

    expect(data?.genes).toHaveLength(1);
    expect(data?.mutationCounts).toEqual({});
  });

  test("still returns the genes when the mutation counts request fails", async () => {
    respondTo.mutationCounts = () => {
      throw new TypeError("Failed to fetch");
    };

    const { data } = await fetchGenesTable();

    expect(data?.genes).toHaveLength(1);
    expect(data?.mutationCounts).toEqual({});
  });
});

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
