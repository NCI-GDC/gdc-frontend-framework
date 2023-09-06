import { Reducer } from "@reduxjs/toolkit";
import Queue from "queue";
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

const primaryQuery = `query PrimarySiteSummaryQuery(
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
      ProjectPrimarySites[],
      { projectId: string; primary_sites: string[] }
    >({
      queryFn: async (_arg, _queryApi, _extraOptions, fetchWithBQ) => {
        const queryMutiple = async (): Promise<ProjectPrimarySites[]> => {
          let result = [] as ProjectPrimarySites[];
          const queue = Queue({ concurrency: 15 });
          for (const primary_site of _arg.primary_sites) {
            queue.push((callback) => {
              fetchWithBQ({
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
              }).then((data) => {
                result = [
                  ...result,
                  transformResponse({
                    primary_site,
                    response:
                      data.data as GraphQLApiResponse<ProjectPrimarySitesApiResponse>,
                  }),
                ];

                if (callback) {
                  callback();
                }
              });
            });
          }

          return new Promise((resolve, reject) => {
            queue.start((err) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            });
          });
        };

        const result = await queryMutiple();

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
