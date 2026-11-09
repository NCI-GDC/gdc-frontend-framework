import { coreStore } from "../../store";
import { facetsGQLReducer, fetchFacetByNameGQL } from "./facetSliceGQL";
import { userAuthChanged } from "../users/usersSlice";

jest.mock("src/constants", () => ({
  ...jest.requireActual("src/constants"),
  GDC_APP_API_AUTH: "https://portal.gdc.cancer.gov/auth/api/v0",
}));

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
    coreStore.dispatch(
      fetchFacetByNameGQL({
        field: "cases.primary_site",
        docType: "cases",
        index: "explore",
      }),
    );

    expect(spyFetch).toHaveBeenCalledWith(
      "https://portal.gdc.cancer.gov/auth/api/v0/graphql",
      {
        body: '{"query":"query QueryBucketCounts($filters: FiltersArgument) {\\n      viewer {\\n          explore {\\n            cases {\\n              aggregations(\\n                \\n                filters:$filters,\\n                aggregations_filter_themselves: false\\n              ) {\\n                 cases__primary_site : primary_site{buckets { doc_count key }}\\n              }\\n            }\\n          }\\n        }\\n      }\\n  ","variables":{}}',
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
        docType: "cases",
        index: "explore",
      }),
    );

    expect(spyFetch).toHaveBeenCalledWith(
      "https://portal.gdc.cancer.gov/auth/api/v0/graphql",
      {
        body: '{"query":"query QueryBucketCounts($filters: FiltersArgument) {\\n      viewer {\\n          explore {\\n            cases {\\n              aggregations(\\n                \\n                filters:$filters,\\n                aggregations_filter_themselves: false\\n              ) {\\n                 cases__primary_site : primary_site{buckets { doc_count key }}, cases__disease_type : disease_type{buckets { doc_count key }}\\n              }\\n            }\\n          }\\n        }\\n      }\\n  ","variables":{}}',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
      },
    );
  });
});

describe("facets reducer", () => {
  test("clears cached facet buckets when the user changes", () => {
    const empty = facetsGQLReducer(undefined, { type: "init" });
    const cached = {
      ...empty,
      cases: {
        "cases.primary_site": {
          status: "fulfilled" as const,
          buckets: { breast: 10 },
        },
      },
    };

    expect(
      facetsGQLReducer(cached, userAuthChanged({ username: "alice" })),
    ).toEqual(empty);
  });
});
