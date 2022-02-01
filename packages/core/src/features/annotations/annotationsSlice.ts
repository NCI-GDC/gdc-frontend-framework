import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DataStatus } from "../../dataAcess";
import { CoreDataSelectorResponse } from "../../dataAcess";
import { CoreDispatch, CoreState } from "../../store";
import { GqlEquals } from "../gdcapi/filters";
import {
  fetchGdcAnnotations,
  GdcApiRequest,
  GdcApiResponse,
  AnnotationDefaults,
} from "../gdcapi/gdcapi";

export interface Annotation {
  readonly projectId: string | number;
  readonly annotationCount: number;
}

export const fetchAnnotations = createAsyncThunk<
  GdcApiResponse<AnnotationDefaults>,
  GdcApiRequest,
  { dispatch: CoreDispatch; state: CoreState }
>("facet/fetchAnnotations", async (request?: GdcApiRequest) => {
  return await fetchGdcAnnotations(request);
});

export interface AnnotationsState {
  // annotations by project id
  readonly annotations: Record<string, Annotation>;
  readonly status: DataStatus;
  readonly error?: string;
}

const initialState: AnnotationsState = {
  annotations: {},
  status: "uninitialized",
};

const slice = createSlice({
  name: "annotations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnnotations.fulfilled, (state, action) => {
        //annotations only available through individual project api call
        const apiFilters = (<GqlEquals>action?.meta?.arg?.filters)?.content;
        const response = action.payload;
        if (apiFilters?.field !== "project.project_id" && !apiFilters?.value) {
          state.status = "rejected";
          state.error = "no project id provided";
        } else if (response.warnings && Object.keys(response.warnings).length > 0) {
          state.status = "rejected";
          state.error = response.warnings.facets;
        } else {
          if (response.data.pagination) {            
            state.annotations = {[apiFilters.value]: {
                  projectId: apiFilters.value,
                  annotationCount: response.data.pagination.total?response.data.pagination.total : 0,
                }
              };
          } else {
            state.annotations = {};
          }
          state.status = "fulfilled";
        }
      })
      .addCase(fetchAnnotations.pending, (state) => {
        state.status = "pending";
        state.error = undefined;
      })
      .addCase(fetchAnnotations.rejected, (state) => {
        state.status = "rejected";
        // TODO get error from action
        state.error = undefined;
      });
  },
});

export const annotationsReducer = slice.reducer;

export const selectAnnotationsState = (state: CoreState): AnnotationsState =>
  state.annotations;

export const selectAnnotations = (state: CoreState): ReadonlyArray<Annotation> => {
  return Object.values(state.annotations.annotations);
};

export const selectAnnotationsData = (
  state: CoreState,
): CoreDataSelectorResponse<ReadonlyArray<Annotation>> => {
  return {
    data: Object.values(state.annotations.annotations),
    status: state.annotations.status,
    error: state.annotations.error,
  };
};
