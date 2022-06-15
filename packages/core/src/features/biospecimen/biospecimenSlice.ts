import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CoreDataSelectorResponse,
  createUseCoreDataHook,
  DataStatus,
} from "../../dataAcess";
import { CoreState } from "../../reducers";
import { GraphQLApiResponse } from "../gdcapi/gdcgraphql";
import { fetchBioSpecimenQuery } from "./bioSpecimenApi";

export const fetchBiospecimenData = createAsyncThunk(
  "biospecimen/fetchBiospecimenData",
  async (params: string): Promise<GraphQLApiResponse> => {
    return await fetchBioSpecimenQuery(params);
  },
);

export interface node {
  composition?: string | null;
  current_weight?: string | null;
  days_to_collection?: string | null;
  days_to_sample_procurement?: number | null;
  freezing_method?: string | null;
  id?: string | null;
  initial_weight?: string | null;
  intermediate_dimension?: string | null;
  is_ffpe?: string | null;
  longest_dimension?: string | null;
  oct_embedded?: string | null;
  pathology_report_uuid?: string | null;
  portions?: any;
  preservation_method?: string | null;
  sample_id?: string | null;
  portion_id?: string | null;
  analyte_id?: string | null;
  aliquot_id?: string | null;
  slide_id?: string | null;
  sample_type?: string | null;
  sample_type_id?: string | null;
  shortest_dimension?: string | null;
  submitter_id?: string | null;
  time_between_clamping_and_freezing?: string | null;
  time_between_excision_and_freezing?: string | null;
  tissue_type?: string | null;
  tumor_code?: string | null;
  tumor_code_id?: string | null;
  tumor_descriptor?: string | null;
}

interface nodeType {
  hits: { edges: Array<{ node: node }> };
}
export interface biospecimenSliceInitialState {
  readonly status: DataStatus;
  readonly files: nodeType;
  readonly samples: nodeType;
}

export const initialState: biospecimenSliceInitialState = {
  status: "uninitialized",
  files: { hits: { edges: [] } },
  samples: { hits: { edges: [] } },
};

const slice = createSlice({
  name: "biospecimen",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBiospecimenData.fulfilled, (state, action) => {
        const response = action.payload;
        state.status = "fulfilled";
        state.files =
          response?.data?.viewer?.repository?.cases?.hits?.edges?.[0]?.node?.files;
        state.samples =
          response?.data?.viewer?.repository?.cases?.hits?.edges?.[0]?.node?.samples;
        return state;
      })
      .addCase(fetchBiospecimenData.pending, (state) => {
        state.status = "pending";
        return state;
      })
      .addCase(fetchBiospecimenData.rejected, (state) => {
        state.status = "rejected";
        return state;
      });
  },
});

export const biospecimenReducer = slice.reducer;

export interface biospecimenSelectorType {
  files: { hits: { edges: [{ node: { [id: string]: any } }] } };
  samples: { hits: { edges: Array<{ node: node }> } };
}

export const selectBiospecimenInfo = (
  state: CoreState,
): CoreDataSelectorResponse<biospecimenSelectorType> => ({
  data: {
    files: state.biospecimen.files,
    samples: state.biospecimen.samples,
  },
  status: state.biospecimen.status,
});

export const useBiospecimenData = createUseCoreDataHook(
  fetchBiospecimenData,
  selectBiospecimenInfo,
);
