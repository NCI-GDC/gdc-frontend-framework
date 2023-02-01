import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  CoreDataSelectorResponse,
  DataStatus,
  createUseCoreDataHook,
} from "src/dataAccess";
import { GraphQLApiResponse } from "src/features/gdcapi/gdcgraphql";
import { CoreState } from "src/reducers";
import {
  fetchMutationsFreqQuery,
  MutationsFreqResponse,
} from "./mutationsFreqApi";

export const fetchMutationsFreq = createAsyncThunk(
  "MutationsFreq/fetchMutationsFreq",
  async ({
    currentFilters,
    size,
  }: {
    currentFilters: any;
    size: number;
  }): Promise<GraphQLApiResponse<MutationsFreqResponse>> => {
    return await fetchMutationsFreqQuery({ currentFilters, size });
  },
);

export interface MutationsFreqData {
  genomic_dna_change: string;
  mutation_subtype: string;
  consequence: {
    transcript: {
      is_canonical: boolean;
      annotation: {
        vep_impact: string;
        polyphen_impact: string;
        sift_impact: string;
      };
      consequence_type: string;
      gene: {
        gene_id: string;
        symbol: string;
      };
      aa_change: string;
    };
  };
  biotype: string;
  gene_id: string;
}

export interface MutationsFreqInitialState {
  status: DataStatus;
  mutationsFreq?: MutationsFreqData[];
}

const initialState: MutationsFreqInitialState = {
  status: "uninitialized",
};

const slice = createSlice({
  name: "mutationsFreq",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMutationsFreq.fulfilled, (state, action) => {
        const response = action.payload;
        state.status = "fulfilled";

        const edges = response?.data?.viewer?.explore?.ssms?.hits?.edges;
        console.log("edges", edges);

        if (edges?.length === 0) return undefined;

        // genomic_dna_change: string;
        // mutation_subtype: string;
        // consequence: {
        //   transcript: {
        //     is_canonical: boolean;
        //     annotation: {
        //       vep_impact: string;
        //       polyphen_impact: string;
        //       sift_impact: string;
        //     };
        //     consequence_type: string;
        //     gene: {
        //       gene_id: string;
        //       symbol: string;
        //     };
        //     aa_change: string;
        //   };
        // };
        // biotype: string;
        // gene_id: string;

        const mtns = edges.map(
          ({
            node: {
              genomic_dna_change,
              mutation_subtype,
              consequence,
              biotype,
              gene_id,
            },
          }) => {
            return {
              genomic_dna_change,
              mutation_subtype,
              consequence: consequence?.edges.map(
                ({
                  node: {
                    transcript: {
                      is_canonical,
                      annotation: { vep_impact, polyphen_impact, sift_impact },
                      consequence_type,
                      gene: { gene_id, symbol },
                      aa_change,
                    },
                  },
                }) => {
                  return {
                    transcript: {
                      is_canonical,
                      annotation: {
                        vep_impact,
                        polyphen_impact,
                        sift_impact,
                      },
                      consequence_type,
                      gene: {
                        gene_id,
                        symbol,
                      },
                      aa_change,
                    },
                  };
                },
              ),
              biotype,
              gene_id,
            };
          },
        );
        console.log("mtns", mtns);
        debugger;
        // state.mutationsFreq = mtns;
        return state;
      })
      .addCase(fetchMutationsFreq.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchMutationsFreq.rejected, (state) => {
        state.status = "rejected";
      });
  },
});

export const mutationsFreqReducer = slice.reducer;

export const selectMutationsFreqData = (
  state: CoreState,
): CoreDataSelectorResponse<{
  mutationsFreq: MutationsFreqData[] | undefined;
}> => {
  return {
    data: {
      mutationsFreq: state.downloads.mutationsFreq.mutationsFreq,
    },
    status: state.downloads.mutationsFreq.status,
  };
};

export const useMutationsFreqData = createUseCoreDataHook(
  fetchMutationsFreq,
  selectMutationsFreqData,
);
