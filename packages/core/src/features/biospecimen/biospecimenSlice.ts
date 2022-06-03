import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CoreDataSelectorResponse,
  createUseCoreDataHook,
  DataStatus,
} from "../../dataAcess";
import { CoreState } from "../../store";
import { GraphQLApiResponse } from "../gdcapi/gdcgraphql";
import { fetchBioSpecimenQuery } from "./bioSpecimenApi";

export const fetchBiospecimenData = createAsyncThunk(
  "biospecimen/fetchBiospecimenData",
  async (params: string): Promise<GraphQLApiResponse> => {
    return await fetchBioSpecimenQuery(params);
  },
);

export interface biospecimenSliceInitialState {
  readonly status: DataStatus;
  readonly files: any;
  readonly samples: any;
}

export const initialState: biospecimenSliceInitialState = {
  status: "uninitialized",
  files: {},
  samples: {},
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
  files: Array<any>;
  samples: Array<any>;
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
