import {
  isRangeBucketsAggregation,
  processRangeResults,
} from "./continuousAggregationApi";

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
});
