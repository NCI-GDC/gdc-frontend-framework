import { coreStore } from "../../store";
import { fetchFacetByNameGQL } from "./facetSliceGQL";

describe("test enum facet bucket queries", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("test single filter query", async () => {
    const spyFetch = jest
      .spyOn(global, "fetch")
      .mockImplementation(
        jest.fn(() =>
          Promise.resolve({ json: () => Promise.resolve({ ok: true }) }),
        ) as jest.Mock,
      );
    coreStore.dispatch(fetchFacetByNameGQL({ field: "cases.primary_site" }));
    expect(spyFetch).toBeCalledWith(
      "https://portal.gdc.cancer.gov/auth/api/v0/graphql",
      {
        body: '{"query":"query QueryBucketCounts($caseFilters: FiltersArgument, $filters: FiltersArgument) {\\n      viewer {\\n          explore {\\n            cases {\\n              aggregations(\\n                case_filters: $caseFilters,\\n                filters:$filters,\\n                aggregations_filter_themselves: false\\n              ) {\\n                 cases__primary_site : primary_site{buckets { doc_count key }}\\n              }\\n            }\\n          }\\n        }\\n      }\\n  ","variables":{"caseFilters":{}}}',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
      },
    );
  });
  test("test multiple filter query", async () => {
    const spyFetch = jest
      .spyOn(global, "fetch")
      .mockImplementation(
        jest.fn(() =>
          Promise.resolve({ json: () => Promise.resolve({ ok: true }) }),
        ) as jest.Mock,
      );
    coreStore.dispatch(
      fetchFacetByNameGQL({
        field: ["cases.primary_site", "cases.disease_type"],
      }),
    );
    expect(spyFetch).toBeCalledWith(
      "https://portal.gdc.cancer.gov/auth/api/v0/graphql",
      {
        body: '{"query":"query QueryBucketCounts($filters_0: FiltersArgument!) {\\n      viewer {\\n          explore {\\n            cases {\\n              aggregations(\\n                case_filters: $filters_0\\n                filters: $filters_0\\n                aggregations_filter_themselves: false\\n              ) {\\n                 cases__primary_site : primary_site{buckets { doc_count key }}, cases__disease_type : disease_type{buckets { doc_count key }}\\n              }\\n            }\\n          }\\n        }\\n      }\\n  ","variables":{"filters_0":{}}}',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
      },
    );
  });
});
