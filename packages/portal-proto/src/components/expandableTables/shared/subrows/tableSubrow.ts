import {
  Buckets,
  Bucket,
} from "../../../../../../core/src/features/gdcapi/gdcapi";
import {
  GraphQLApiResponse,
  graphqlAPISlice,
} from "../../../../../../core/src/features/gdcapi/gdcgraphql";
import { convertGeneFilter } from "../../genes/genesTableUtils";
import { convertMutationFilter } from "../../somaticMutations/smTableUtils";

interface GeneSubrowResponse {
  explore: {
    cases: {
      aggregations: {
        denominators: Buckets;
        numerators: Buckets;
      };
    };
  };
}

interface SSMSSubrowResponse {
  explore: {
    cases: {
      aggregations: {
        denominators: Buckets;
        numerators: Buckets;
      };
    };
  };
}

interface TableSubrowData {
  // todo transform
  something: any;
}

export const tableSubrowApiSlice = graphqlAPISlice.injectEndpoints({
  endpoints: (builder) => ({
    getGeneTableSubrow: builder.query({
      query: (request: { geneId: string }) => ({
        graphQLQuery: `
                    query GeneTableSubrow(
                        $filters_case: FiltersArgument
                        $filters_gene: FiltersArgument
                    ) {
                        explore {
                            cases {
                                denominators: aggregations(filters: $filters_case) {
                                    project__project_id {
                                        buckets {
                                            key
                                            doc_count
                                        }
                                    }
                                }
                                numerators: aggregations(filters: $filters_gene) {
                                    project__project_id {
                                        buckets {
                                            doc_count
                                            key
                                        }
                                    }
                                }
                            }
                        }
                    }
                    `,
        graphQLFilters: convertGeneFilter(request.geneId),
      }),
      transformResponse: (
        response: GraphQLApiResponse<GeneSubrowResponse>,
      ): TableSubrowData => {
        console.log("gene res", response);
        return {
          something: response,
        };
      },
    }),
    getSomaticMutationTableSubrow: builder.query({
      query: (request: { mutationId: string }) => ({
        graphQLQuery: `
                query SomaticMutationTableSubrow(
                  $filters_case: FiltersArgument
                  $filters_mutation: FiltersArgument
                ) {
                  explore {
                    cases {
                      denominators: aggregations(filters: $filters_case) {
                        project__project_id {
                          buckets {
                            key
                            doc_count
                          }
                        }
                      }
                      numerators: aggregations(filters: $filters_mutation) {
                        project__project_id {
                          buckets {
                            doc_count
                            key
                          }
                        }
                      }
                    }
                  }
                }
              `,
        graphQLFilters: convertMutationFilter(request.mutationId),
      }),
      transformResponse: (
        response: GraphQLApiResponse<GeneSubrowResponse>,
      ): TableSubrowData => {
        console.log("mtn res", response);
        return {
          something: response,
        };
      },
    }),
  }),
});

export const {
  useGetGeneTableSubrowQuery,
  useGetSomaticMutationTableSubrowQuery,
} = tableSubrowApiSlice;
