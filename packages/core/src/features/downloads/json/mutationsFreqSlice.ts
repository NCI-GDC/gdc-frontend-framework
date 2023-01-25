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
    edges: Array<{
      node: {
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
    }>;
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
  name: "mutations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMutationsFreq.fulfilled, (state, action) => {
        const response = action.payload;
        state.status = "fulfilled";
        // todo

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
  mutations: MutationsFreqData | undefined;
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
