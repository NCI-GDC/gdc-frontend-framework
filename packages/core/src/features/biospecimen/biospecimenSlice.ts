import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CoreDataSelectorResponse,
  createUseCoreDataHook,
  DataStatus,
} from "../../dataAccess";
import { CoreState } from "../../reducers";
import { GraphQLApiResponse } from "../gdcapi/gdcgraphql";
import { fetchBioSpecimenQuery } from "./bioSpecimenApi";

export const fetchBiospecimenData = createAsyncThunk(
  "biospecimen/fetchBiospecimenData",
  async (params: string): Promise<GraphQLApiResponse> => {
    return await fetchBioSpecimenQuery(params);
  },
);

export interface sampleNode {
  sample_id: string | null;
  submitter_id: string | null;
  sample_type: string | null;
  sample_type_id: string | null;
  tissue_type: string | null;
  tumor_code: string | null;
  tumor_code_id: string | null;
  oct_embedded: string | null;
  shortest_dimension: string | null;
  intermediate_dimension: string | null;
  longest_dimension: string | null;
  is_ffpe: string | null;
  pathology_report_uuid: string | null;
  tumor_descriptor: string | null;
  current_weight: string | null;
  initial_weight: string | null;
  composition: string | null;
  time_between_clamping_and_freezing: string | null;
  time_between_excision_and_freezing: string | null;
  days_to_sample_procurement: number | null;
  freezing_method: string | null;
  preservation_method: string | null;
  days_to_collection: string | null;
  portions: {
    hits: {
      edges: Array<{ node: Partial<portionNode> }>;
    };
  };
}

export interface portionNode {
  submitter_id: string | null;
  portion_id: string | null;
  portion_number: string | null;
  weight: string | null;
  is_ffpe: string | null;
  analytes: {
    hits: {
      edges: Array<{ node: Partial<analytesNode> }>;
    };
  };
  slides: {
    hits: {
      edges: Array<{ node: Partial<slidesNode> }>;
    };
  };
}

export interface analytesNode {
  submitter_id: string | null;
  analyte_id: string | null;
  analyte_type: string | null;
  analyte_type_id: string | null;
  well_number: string | null;
  amount: string | null;
  a260_a280_ratio: string | null;
  concentration: string | null;
  spectrophotometer_method: string | null;
  aliquots: {
    hits: {
      edges: Array<{ node: Partial<aliquotsNode> }>;
    };
  };
}

export interface slidesNode {
  submitter_id: string | null;
  slide_id: string | null;
  percent_tumor_nuclei: string | null;
  percent_monocyte_infiltration: string | null;
  percent_normal_cells: string | null;
  percent_stromal_cells: string | null;
  percent_eosinophil_infiltration: string | null;
  percent_lymphocyte_infiltration: string | null;
  percent_neutrophil_infiltration: string | null;
  section_location: string | null;
  percent_granulocyte_infiltration: string | null;
  percent_necrosis: string | null;
  percent_inflam_infiltration: string | null;
  number_proliferating_cells: string | null;
  percent_tumor_cells: string | null;
}

export interface aliquotsNode {
  submitter_id: string | null;
  aliquot_id: string | null;
  source_center: string | null;
  amount: string | null;
  concentration: string | null;
  analyte_type: string | null;
  analyte_type_id: string | null;
}

interface nodeType {
  hits: { edges: Array<{ node: sampleNode }> };
}

export type entityType =
  | sampleNode
  | portionNode
  | analytesNode
  | slidesNode
  | aliquotsNode;
// removed null is it safe?

export interface biospecimenSliceInitialState {
  readonly status: DataStatus;
  readonly files: { hits: { edges: Array<{ node: any }> } };
  readonly samples: nodeType;
  readonly requestId?: string;
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
        if (state.requestId != action.meta.requestId) return state;

        const response = action.payload;
        state.status = "fulfilled";
        state.files =
          response?.data?.viewer?.repository?.cases?.hits?.edges?.[0]?.node?.files;
        state.samples =
          response?.data?.viewer?.repository?.cases?.hits?.edges?.[0]?.node?.samples;
        return state;
      })
      .addCase(fetchBiospecimenData.pending, (state, action) => {
        state.status = "pending";
        state.requestId = action.meta.requestId;
        return state;
      })
      .addCase(fetchBiospecimenData.rejected, (state, action) => {
        if (state.requestId != action.meta.requestId) return state;
        state.status = "rejected";
        return state;
      });
  },
});

export const biospecimenReducer = slice.reducer;

export interface biospecimenSelectorType {
  files: { hits: { edges: Array<{ node: any }> } };
  samples: nodeType;
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
