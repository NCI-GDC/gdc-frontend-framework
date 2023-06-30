import { Reducer } from "@reduxjs/toolkit";
import { graphqlAPISlice, GraphQLApiResponse } from "../gdcapi/gdcgraphql";
export interface ProjectPrimarySites {
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
export const projectsPrimarySiteSlice = graphqlAPISlice.injectEndpoints({
  endpoints: (builder) => ({
    getProjectPrimarySites: builder.query({
      query: (request: { projectId: string; primary_site: string }) => ({
        graphQLQuery: `query PrimarySiteSummary_relayQuery(
          $filters: FiltersArgument
        ) {
          repository {
            files {
              hits(filters: $filters) {
                total
              }
            }
            cases {
              hits(filters: $filters) {
                total
              }
              aggregations(filters: $filters) {
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
        }`,
        graphQLFilters: {
          filters: {
            content: [
              {
                content: {
                  field: "cases.primary_site",
                  value: [request.primary_site],
                },
                op: "in",
              },
              {
                content: {
                  field: "cases.project.project_id",
                  value: [request.projectId],
                },
                op: "in",
              },
            ],
            op: "and",
          },
        },
      }),
      transformResponse: (
        response: GraphQLApiResponse<ProjectPrimarySitesApiResponse>,
      ): ProjectPrimarySites => {
        return {
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
        };
      },
    }),
  }),
});

export const { useGetProjectPrimarySitesQuery } = projectsPrimarySiteSlice;

export const projectPrimarySiteApiSliceReducerPath: string =
  projectsPrimarySiteSlice.reducerPath;
export const projectPrimarySiteApiSliceReducer: Reducer =
  projectsPrimarySiteSlice.reducer as Reducer;
