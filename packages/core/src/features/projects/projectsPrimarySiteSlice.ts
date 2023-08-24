import { Reducer } from "@reduxjs/toolkit";
import { graphqlAPISlice, GraphQLApiResponse } from "../gdcapi/gdcgraphql";
export interface ProjectPrimarySites {
  readonly primary_site: string;
  readonly disease_types: string[];
  readonly files__experimental_strategy: string[];
  readonly casesTotal: number;
  readonly filesTotal: number;
}
export interface ProjectPrimarySitesApiResponse {
  readonly repository: {
    readonly cases: {
      readonly aggregations: {
        readonly disease_type: {
          readonly buckets: {
            readonly key: string;
          }[];
        };
        readonly files__experimental_strategy: {
          readonly buckets: {
            readonly key: string;
          }[];
        };
      };
      readonly hits: {
        readonly total: number;
      };
    };
    readonly files: {
      readonly hits: {
        readonly total: number;
      };
    };
  };
}

const primaryQuery = `query PrimarySiteSummary_relayQuery(
  $filters: FiltersArgument
) {
  repository {
    files {
      hits(case_filters: $filters) {
        total
      }
    }
    cases {
      hits(case_filters: $filters) {
        total
      }
      aggregations(case_filters: $filters) {
        files__experimental_strategy {
          buckets {
            key
          }
        }
        disease_type {
          buckets {
            key
          }
        }
      }
    }
  }
}`;

const transformResponse = ({
  primary_site,
  response,
}: {
  primary_site: string;
  response: GraphQLApiResponse<ProjectPrimarySitesApiResponse>;
}): ProjectPrimarySites => ({
  primary_site: primary_site,
  disease_types:
    response.data.repository.cases.aggregations.disease_type.buckets.map(
      (obj) => obj.key,
    ),
  files__experimental_strategy:
    response.data.repository.cases.aggregations.files__experimental_strategy.buckets
      .map((obj) => obj.key)
      .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())),
  casesTotal: response.data.repository.cases.hits.total,
  filesTotal: response.data.repository.files.hits.total,
});

export const projectsPrimarySiteSlice = graphqlAPISlice.injectEndpoints({
  endpoints: (builder) => ({
    getProjectsPrimarySitesAll: builder.query<
      any,
      { projectId: string; primary_sites: string[] }
    >({
      queryFn: async (_arg, _queryApi, _extraOptions, fetchWithBQ) => {
        const result = [] as any;
        const concurrencyLimit = 10;

        const fetchPromises = _arg.primary_sites.map(async (primary_site) => {
          try {
            const data = await fetchWithBQ({
              graphQLQuery: primaryQuery,
              graphQLFilters: {
                filters: {
                  content: [
                    {
                      content: {
                        field: "cases.primary_site",
                        value: [primary_site],
                      },
                      op: "in",
                    },
                    {
                      content: {
                        field: "cases.project.project_id",
                        value: [_arg.projectId],
                      },
                      op: "in",
                    },
                  ],
                  op: "and",
                },
              },
            });

            return transformResponse({
              primary_site,
              response: data.data as any,
            });
          } catch (error) {
            console.error("Error fetching data:", error);
            return null;
          }
        });

        for (let i = 0; i < fetchPromises.length; i += concurrencyLimit) {
          const chunk = fetchPromises.slice(i, i + concurrencyLimit);
          const results = await Promise.all(chunk);
          result.push(...results.filter((r) => r !== null));
        }

        return { data: result };
      },
    }),
  }),
});

export const { useGetProjectsPrimarySitesAllQuery } = projectsPrimarySiteSlice;

export const projectPrimarySiteApiSliceReducerPath: string =
  projectsPrimarySiteSlice.reducerPath;
export const projectPrimarySiteApiSliceReducer: Reducer =
  projectsPrimarySiteSlice.reducer as Reducer;
