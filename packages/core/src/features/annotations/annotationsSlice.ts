import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DataStatus, CoreDataSelectorResponse } from "../../dataAccess";
import { CoreDispatch } from "../../store";
import { CoreState } from "../../reducers";
import {
  fetchGdcAnnotations,
  GdcApiRequest,
  GdcApiResponse,
  AnnotationDefaults,
} from "../gdcapi/gdcapi";

export const fetchAnnotations = createAsyncThunk<
  GdcApiResponse<AnnotationDefaults>,
  GdcApiRequest,
  { dispatch: CoreDispatch; state: CoreState }
>("facet/fetchAnnotations", async (request?: GdcApiRequest) => {
  return fetchGdcAnnotations(request);
});

export interface AnnotationsState {
  annotations: {
    list: Array<AnnotationDefaults>;
    count: number;
  };

  status: DataStatus;
  error?: string;
  readonly requestId?: string;
}

export const annotationInitialState: AnnotationsState = {
  annotations: {
    list: [],
    count: 0,
  },
  status: "uninitialized",
};

const slice = createSlice({
  name: "annotations",
  initialState: annotationInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnnotations.fulfilled, (state, action) => {
        if (state.requestId != action.meta.requestId) return state;

        const response = action.payload;
        state.annotations.list = response.data.hits.map((hit) => hit);
        state.annotations.count = response.data.pagination.total ?? 0;
        state.status = "fulfilled";

        return state;
      })
      .addCase(fetchAnnotations.pending, (state, action) => {
        state.status = "pending";
        state.requestId = action.meta.requestId;
        state.error = undefined;
        return state;
      })
      .addCase(fetchAnnotations.rejected, (state, action) => {
        if (state.requestId != action.meta.requestId) return state;
        state.status = "rejected";
        // TODO get error from action
        state.error = undefined;

        return state;
      });
  },
});

export const annotationsReducer = slice.reducer;

export const selectAnnotationsState = (state: CoreState): AnnotationsState =>
  state.annotations;

export const selectAnnotationsData = (
  state: CoreState,
): CoreDataSelectorResponse<{
  list: Array<AnnotationDefaults>;
  count: number;
}> => {
  return {
    data: state.annotations.annotations,
    status: state.annotations.status,
    error: state.annotations.error,
  };
};
