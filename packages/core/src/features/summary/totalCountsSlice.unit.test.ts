import { fetchTotalCounts, totalCountsReducer } from "./totalCountsSlice";

const initialCounts = {
  counts: {
    caseCounts: -1,
    fileCounts: -1,
    genesCounts: -1,
    mutationCounts: -1,
    repositoryCaseCounts: -1,
  },
};

describe("totalCounts reducer", () => {
  test("should return the default state for unknown actions", () => {
    const state = totalCountsReducer(undefined, { type: "asdf" });
    expect(state).toEqual(initialCounts);
  });

  test("gets total counts", () => {
    const state = totalCountsReducer(
      {
        counts: {
          caseCounts: -1,
          fileCounts: -1,
          genesCounts: -1,
          mutationCounts: -1,
          repositoryCaseCounts: -1,
        },
        status: "uninitialized",
      },
      {
        type: fetchTotalCounts.fulfilled,
        payload: {
          response: {
            data: {
              viewer: {
                explore: {
                  cases: {
                    hits: {
                      total: 10000,
                    },
                  },
                  genes: {
                    hits: {
                      total: 20000,
                    },
                  },
                  ssms: {
                    hits: {
                      total: 30000,
                    },
                  },
                },
                repository: {
                  cases: {
                    hits: {
                      total: 5000,
                    },
                  },
                  files: {
                    hits: {
                      total: 900,
                    },
                  },
                },
              },
            },
          },
        },
      },
    );
    expect(state).toEqual([
      { id: 1, dismissed: false, components: ["PORTAL"] },
      { id: 2, dismissed: false, components: ["API"] },
    ]);
  });
});
