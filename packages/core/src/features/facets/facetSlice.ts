import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CoreDispatch, CoreState } from "../../store";
import { GdcApiResponse } from "../gdcapi/gdcapi";
import * as api from "./facetApi";

export const fetchFacetByName = createAsyncThunk<
  GdcApiResponse,
  string,
  { dispatch: CoreDispatch; state: CoreState }
>("facet/fetchFacetByName", async (name: string) => {
  return await api.fetchFacetByName(name);
});

export interface FacetBuckets {
  readonly status: "pending" | "fulfilled" | "rejected";
  readonly error?: string;
  readonly buckets?: Record<string, number>;
}

// these top-level properties should match the gdcapi indices.
// however, this implementation detail should not be exposed to the portal
export interface FacetsState {
  readonly cases: Record<string, FacetBuckets>;
  readonly files: Record<string, FacetBuckets>;
}

const initialState: FacetsState = {
  cases: {},
  files: {},
};

const slice = createSlice({
  name: "facets",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFacetByName.fulfilled, (state, action) => {
        const response = action.payload;

        if (response.warnings && Object.keys(response.warnings).length > 0) {
          state.cases[action.meta.arg].status = "rejected";
          state.cases[action.meta.arg].error = response.warnings.facets;
        } else {
          response.data.aggregations &&
            Object.entries(response.data.aggregations).forEach(
              ([field, buckets]) => {
                state.cases[field].status = "fulfilled";
                state.cases[field].buckets = buckets.buckets.reduce(
                  (facetBuckets, apiBucket) => {
                    facetBuckets[apiBucket.key] = apiBucket.doc_count;
                    return facetBuckets;
                  },
                  {} as Record<string, number>
                );
              }
            );
        }
      })
      .addCase(fetchFacetByName.pending, (state, action) => {
        const field = action.meta.arg;
        state.cases[field] = {
          status: "pending",
        };
      })
      .addCase(fetchFacetByName.rejected, (state, action) => {
        const field = action.meta.arg;
        state.cases[field] = {
          status: "rejected",
        };
      });
  },
});

export const facetsReducer = slice.reducer;

export const selectCases = (state: CoreState) => state.facets.cases;

export const selectCasesFacetByField = (state: CoreState, field: string) => {
  const cases = state.facets.cases;
  return cases[field];
};
