import {
  isRangeBucketsAggregation,
  processRangeResults,
} from "./continuousAggregationApi";
import { fetchFacetContinuousAggregation } from "./continuousAggregationSlice";
import * as cohort from "../cohort/availableCohortsSlice";
import { coreStore } from "../../store";
import { GqlOperation } from "../gdcapi/filters";

const queryResults = {
  aggregations: {
    diagnoses__age_at_diagnosis: {
      range: {
        buckets: [
          {
            doc_count: 4007,
            key: "0.0-3652.5",
          },
          {
            doc_count: 2029,
            key: "3652.5-7305.0",
          },
          {
            doc_count: 955,
            key: "7305.0-10957.5",
          },
          {
            doc_count: 2234,
            key: "10957.5-14610.0",
          },
          {
            doc_count: 1914,
            key: "14610.0-18262.5",
          },
          {
            doc_count: 0,
            key: "18262.5-21915.0",
          },
          {
            doc_count: 0,
            key: "21915.0-25567.5",
          },
          {
            doc_count: 0,
            key: "25567.5-29220.0",
          },
          {
            doc_count: 0,
            key: "29220.0-32872.5",
          },
        ],
      },
      stats: {
        Max: 16434,
        Mean: 7550.933476972798,
        Min: 0,
        SD: 5727.081131932855,
        count: 11139,
      },
    },
  },
};

describe("continuous range slice tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("isRange valid", () => {
    expect(
      isRangeBucketsAggregation(
        queryResults.aggregations.diagnoses__age_at_diagnosis,
      ),
    ).toBeTruthy();
  });

  test("isRange invalid", () => {
    const badResults = {
      data: {
        not: "real",
      },
    };
    expect(isRangeBucketsAggregation(badResults)).toBeFalsy();
  });

  test("process buckets ", () => {
    const expected = {
      "diagnoses.age_at_diagnosis": {
        buckets: {
          "0.0-3652.5": 4007,
          "10957.5-14610.0": 2234,
          "14610.0-18262.5": 1914,
          "18262.5-21915.0": 0,
          "21915.0-25567.5": 0,
          "25567.5-29220.0": 0,
          "29220.0-32872.5": 0,
          "3652.5-7305.0": 2029,
          "7305.0-10957.5": 955,
        },
        stats: {
          Max: 16434,
          Mean: 7550.933476972798,
          Min: 0,
          SD: 5727.081131932855,
          count: 11139,
        },
        status: "fulfilled",
      },
    };
    const initialState = {
      "diagnoses.age_at_diagnosis": { status: "uninitialized" },
    };

    const results = processRangeResults(
      queryResults.aggregations,
      initialState,
    );
    expect(results).toEqual(expected);
  });

  test("fetch without overriding filters", async () => {
    const spyFetch = jest
      .spyOn(global, "fetch")
      .mockImplementation(
        jest.fn(() =>
          Promise.resolve({ json: () => Promise.resolve({ ok: true }) }),
        ) as jest.Mock,
      );
    jest.spyOn(cohort, "selectCurrentCohortGqlFilters").mockImplementation(
      (): GqlOperation => ({
        op: "and",
        content: [
          {
            op: "in",
            content: {
              field: "cases.demographic.gender",
              value: ["female"],
            },
          },
        ],
      }),
    );
    coreStore.dispatch(
      fetchFacetContinuousAggregation({
        field: "diagnoses.age_at_diagnosis",
        ranges: [
          {
            from: 0,
            to: 6574.4,
          },
          {
            from: 6574.4,
            to: 13148.8,
          },
          {
            from: 13148.8,
            to: 19723.199999999997,
          },
          {
            from: 19723.199999999997,
            to: 26297.6,
          },
          {
            from: 26297.6,
            to: 32873,
          },
        ],
      }),
    );
    expect(spyFetch).toBeCalledWith(
      "https://portal.gdc.cancer.gov/auth/api/v0/graphql",
      {
        body: '{"query":"\\n  query ContinuousAggregationQuery($caseFilters: FiltersArgument, $filters: FiltersArgument, $filters2: FiltersArgument) {\\n  viewer {\\n    explore {\\n      cases {\\n        aggregations(case_filters: $caseFilters, filters: $filters) {\\n          diagnoses__age_at_diagnosis : diagnoses__age_at_diagnosis {\\n           stats {\\n                Min : min\\n                Max: max\\n                Mean: avg\\n                SD: std_deviation\\n                count\\n            }\\n            range(ranges: $filters2) {\\n              buckets {\\n                doc_count\\n                key\\n              }\\n            }\\n          }\\n        }\\n      }\\n    }\\n  }\\n}\\n","variables":{"caseFilters":{"op":"and","content":[{"op":"in","content":{"field":"cases.demographic.gender","value":["female"]}}]},"filters":{},"filters2":{"op":"range","content":[{"ranges":[{"from":0,"to":6574.4},{"from":6574.4,"to":13148.8},{"from":13148.8,"to":19723.199999999997},{"from":19723.199999999997,"to":26297.6},{"from":26297.6,"to":32873}]}]}}}',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
      },
    );
  });

  test("fetch with overriding filters", async () => {
    const spyFetch = jest
      .spyOn(global, "fetch")
      .mockImplementation(
        jest.fn(() =>
          Promise.resolve({ json: () => Promise.resolve({ ok: true }) }),
        ) as jest.Mock,
      );
    jest
      .spyOn(cohort, "selectCurrentCohortGqlFilters")
      .mockImplementation(() => ({
        op: "and",
        content: [
          {
            op: "in",
            content: {
              field: "cases.demographic.gender",
              value: ["female"],
            },
          },
        ],
      }));
    coreStore.dispatch(
      fetchFacetContinuousAggregation({
        field: "diagnoses.age_at_diagnosis",
        ranges: [
          {
            from: 0,
            to: 6574.4,
          },
          {
            from: 6574.4,
            to: 13148.8,
          },
          {
            from: 13148.8,
            to: 19723.199999999997,
          },
          {
            from: 19723.199999999997,
            to: 26297.6,
          },
          {
            from: 26297.6,
            to: 32873,
          },
        ],
        overrideFilters: {
          op: "and",
          content: [
            {
              op: "in",
              content: {
                field: "cases.project.project_id",
                value: ["TCGA-LGG"],
              },
            },
          ],
        },
      }),
    );
    expect(spyFetch).toBeCalledWith(
      "https://portal.gdc.cancer.gov/auth/api/v0/graphql",
      {
        body: '{"query":"\\n  query ContinuousAggregationQuery($caseFilters: FiltersArgument, $filters: FiltersArgument, $filters2: FiltersArgument) {\\n  viewer {\\n    explore {\\n      cases {\\n        aggregations(case_filters: $caseFilters, filters: $filters) {\\n          diagnoses__age_at_diagnosis : diagnoses__age_at_diagnosis {\\n           stats {\\n                Min : min\\n                Max: max\\n                Mean: avg\\n                SD: std_deviation\\n                count\\n            }\\n            range(ranges: $filters2) {\\n              buckets {\\n                doc_count\\n                key\\n              }\\n            }\\n          }\\n        }\\n      }\\n    }\\n  }\\n}\\n","variables":{"caseFilters":{"op":"and","content":[{"op":"in","content":{"field":"cases.project.project_id","value":["TCGA-LGG"]}}]},"filters":{},"filters2":{"op":"range","content":[{"ranges":[{"from":0,"to":6574.4},{"from":6574.4,"to":13148.8},{"from":13148.8,"to":19723.199999999997},{"from":19723.199999999997,"to":26297.6},{"from":26297.6,"to":32873}]}]}}}',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
      },
    );
  });
});
