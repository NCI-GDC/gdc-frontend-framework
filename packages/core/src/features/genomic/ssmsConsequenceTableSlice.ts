import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CoreDataSelectorResponse,
  createUseCoreDataHook,
  DataStatus,
} from "../../dataAccess";
import { castDraft } from "immer";
import { CoreDispatch } from "../../store";
import { CoreState } from "../../reducers";
import {
  GraphQLApiResponse,
  graphqlAPI,
  TablePageOffsetProps,
} from "../gdcapi/gdcgraphql";
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
  readonly pageSize: number;
  readonly offset: number;
}

export interface SsmsConsequenceTableRequestParameters
  extends TablePageOffsetProps {
  readonly mutationId?: string;
}

export const fetchSsmsConsequenceTable = createAsyncThunk<
  GraphQLApiResponse,
  SsmsConsequenceTableRequestParameters,
  { dispatch: CoreDispatch; state: CoreState }
>(
  "genomic/ssmsConsequenceTable",
  async ({
    pageSize,
    offset,
    mutationId,
  }: SsmsConsequenceTableRequestParameters): Promise<GraphQLApiResponse> => {
    const graphQlFilters = {
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

    return await graphqlAPI(SSMSConsequenceTableGraphQLQuery, graphQlFilters);
  },
);

export interface SsmsConsequenceTableState {
  readonly ssmsConsequence: GDCSsmsConsequenceTable;
  readonly status: DataStatus;
  readonly error?: string;
}

const initialState: SsmsConsequenceTableState = {
  ssmsConsequence: {
    id: "",
    consequenceTotal: 0,
    consequence: [],
    pageSize: 0,
    offset: 0,
  },
  status: "uninitialized",
};

const slice = createSlice({
  name: "ssmsConsequenceTable",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSsmsConsequenceTable.fulfilled, (state, action) => {
        const response = action.payload;
        if (response.errors) {
          state = castDraft(initialState);
          state.status = "rejected";
          state.error = response.errors.filters;
        }
        if (action.payload.data.viewer.explore.ssms.hits.edges.length == 0) {
          state = castDraft(initialState);
          state.status = "rejected";
          state.error = response.errors.filters;
        }
        const data = action.payload.data.viewer.explore.ssms.hits.edges[0].node;
        state.ssmsConsequence.id = data.id;
        state.ssmsConsequence.consequenceTotal = data.consequence.hits.total;
        (state.ssmsConsequence.consequence = data.consequence.hits.edges.map(
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
        )),
          (state.status = "fulfilled");
        state.error = undefined;
        return state;
      })
      .addCase(fetchSsmsConsequenceTable.pending, (state) => {
        state.status = "pending";
        return state;
      })
      .addCase(fetchSsmsConsequenceTable.rejected, (state, action) => {
        state.status = "rejected";
        if (action.error) {
          state.error = action.error.message;
        }
        return state;
      });
  },
});

export const ssmsConsequenceTableReducer = slice.reducer;

export const selectSsmsConsequenceTableState = (
  state: CoreState,
): GDCSsmsConsequenceTable =>
  state.genomic.ssmsConsequenceTable.ssmsConsequence;

export const selectSsmsConsequencesTableData = (
  state: CoreState,
): CoreDataSelectorResponse<SsmsConsequenceTableState> => {
  return {
    data: state.genomic.ssmsConsequenceTable,
    status: state.genomic.ssmsConsequenceTable.status,
    error: state.genomic.ssmsConsequenceTable.error,
  };
};

export const useSsmsConsequenceTable = createUseCoreDataHook(
  fetchSsmsConsequenceTable,
  selectSsmsConsequencesTableData,
);
