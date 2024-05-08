import { TablePageOffsetProps, graphqlAPISlice } from "../gdcapi/gdcgraphql";
import { SSMSConsequence } from "./ssmsTableSlice";

const SSMSConsequenceTableGraphQLQuery = `
query ConsequencesTable (
  $filters: FiltersArgument
  $table_size: Int
  $table_offset: Int
) {
  viewer {
    explore {
      ssms {
        hits(first: 1, filters: $filters) {
          edges {
            node {
              consequence {
                hits(first: $table_size, offset: $table_offset) {
                total
                  edges {
                    node {
                      transcript {
                        transcript_id
                        aa_change
                        is_canonical
                        consequence_type
                        annotation {
                          hgvsc
                          polyphen_impact
                          polyphen_score
                          sift_score
                          sift_impact
                          vep_impact
                        }
                        gene {
                          gene_id
                          symbol
                          gene_strand
                        }
                      }
                      id
                    }
                  }
                }
              }
              id
            }
          }
        }
      }
    }
  }
}
`;

export interface GDCSsmsConsequenceTable {
  readonly id: string;
  readonly consequence: ReadonlyArray<SSMSConsequence>;
  readonly consequenceTotal: number;
}

export interface SsmsConsequenceTableRequestParameters
  extends TablePageOffsetProps {
  readonly mutationId?: string;
}

const ssmsConsequenceTable = graphqlAPISlice.injectEndpoints({
  endpoints: (builder) => ({
    ssmsConsequenceTable: builder.query<
      GDCSsmsConsequenceTable,
      SsmsConsequenceTableRequestParameters
    >({
      query: ({ pageSize, offset, mutationId }) => {
        const graphQLFilters = {
          table_size: pageSize,
          table_offset: offset,
          filters: {
            content: [
              {
                content: {
                  field: "ssms.ssm_id",
                  value: [mutationId],
                },
                op: "in",
              },
            ],
            op: "and",
          },
        };

        return {
          graphQLFilters,
          graphQLQuery: SSMSConsequenceTableGraphQLQuery,
        };
      },
      transformResponse: (response) => {
        const data = response.data.viewer.explore.ssms.hits.edges[0].node;
        return {
          id: data.id,
          consequenceTotal: data.consequence.hits.total,
          consequence: data.consequence.hits.edges.map(
            ({ node }: { node: SSMSConsequence }) => {
              const transcript = node.transcript;
              return {
                id: node.id,
                transcript: {
                  aa_change: transcript.aa_change,
                  annotation: { ...transcript.annotation },
                  consequence_type: transcript.consequence_type,
                  gene: { ...transcript.gene },
                  is_canonical: transcript.is_canonical,
                  transcript_id: transcript.transcript_id,
                },
              };
            },
          ),
        };
      },
    }),
  }),
});

export const { useSsmsConsequenceTableQuery } = ssmsConsequenceTable;
