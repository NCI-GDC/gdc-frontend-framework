import { createSlice } from "@reduxjs/toolkit";
import {
  CoreDataSelectorResponse,
  DataStatus,
  createUseCoreDataHook,
} from "src/dataAccess";
import { CoreState } from "src/reducers";
import { fetchMutationsFreq } from "./mutationsFreqApi";

export interface MutationsFreqEdges {
  node: {
    consequence: {
      hits: { edges: any };
      mutation_subtype: string;
      genomic_dna_change: string;
      ssm_id: string;
    };
  };
}

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
  mutations?: MutationsFreqData[];
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
        const { edges: ssmsEdges } =
          response?.data?.viewer?.explore?.ssms?.hits;
        const mtns = ssmsEdges.map(
          ({
            node: {
              mutation_subtype,
              ssm_id,
              genomic_dna_change,
              consequence: {
                hits: { edges: consequenceEdges },
              },
            },
          }: any) => {
            return {
              consequence: consequenceEdges.map(
                ({
                  node: {
                    transcript: {
                      aa_change,
                      annotation,
                      gene,
                      is_canonical,
                      consequence_type,
                    },
                  },
                }: any) => {
                  return {
                    transcript: {
                      aa_change,
                      annotation,
                      gene,
                      is_canonical,
                      consequence_type,
                    },
                  };
                },
              )[0],
              mutation_subtype,
              genomic_dna_change,
              ssm_id,
            };
          },
        );
        state.mutations = mtns;
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
  mutations: MutationsFreqData[] | undefined;
}> => {
  return {
    data: {
      mutations: state.downloads.mutationsFreq.mutations,
    },
    status: state.downloads.mutationsFreq.status,
  };
};

export const useMutationsFreqData = createUseCoreDataHook(
  fetchMutationsFreq,
  selectMutationsFreqData,
);
