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
  readonly edges: any;
}

export const initialState: biospecimenSliceInitialState = {
  status: "uninitialized",
  edges: {},
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
        console.log(response);
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
  edges: any;
}

export const selectBiospecimenInfo = (
  state: CoreState,
): CoreDataSelectorResponse<biospecimenSelectorType> => ({
  data: {
    edges: state.biospecimen.edges,
  },
  status: state.biospecimen.status,
});

export const useBiospecimenData = createUseCoreDataHook(
  fetchBiospecimenData,
  selectBiospecimenInfo,
);
