import { fetchTotalCounts, totalCountsReducer } from "./totalCountsSlice";

const initialCounts = {
  counts: {
    caseCounts: -1,
    fileCounts: -1,
    genesCounts: -1,
    mutationCounts: -1,
    projectsCounts: -1,
    primarySiteCounts: -1,
    annotationCounts: -1,
  },
  status: "uninitialized",
};

describe("totalCounts reducer", () => {
  test("should return the default state for unknown actions", () => {
    const state = totalCountsReducer(undefined, {
      type: "asdf",
      meta: { requestId: "test" },
    });
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
          projectsCounts: -1,
          primarySiteCounts: -1,
          annotationCounts: -1,
        },
        status: "uninitialized",
        requestId: "test",
      },
      {
        type: fetchTotalCounts.fulfilled,
        meta: { requestId: "test" },
        payload: {
          data: {
            viewer: {
              projects: {
                aggregations: {
                  primary_site: {
                    buckets: [
                      {
                        key: "hematopoietic and reticuloendothelial systems",
                      },
                      {
                        key: "kidney",
                      },
                    ],
                  },
                },
                hits: {
                  total: 70,
                },
              },
              annotations: {
                hits: {
                  total: 9000,
                },
              },
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
    );
    expect(state).toEqual({
      counts: {
        caseCounts: 10000,
        fileCounts: 900,
        genesCounts: 20000,
        mutationCounts: 30000,
        projectsCounts: 70,
        primarySiteCounts: 2,
        annotationCounts: 9000,
      },
      status: "fulfilled",
      requestId: "test",
    });
  });
});
