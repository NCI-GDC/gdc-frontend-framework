import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CoreDispatch, CoreState } from "../../store";
import * as api from "./facetApi";

export const fetchFacetByName = createAsyncThunk<
  api.GdcApiResponse,
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
    builder.addCase(fetchFacetByName.fulfilled, (state, action) => {
      const response = action.payload;

      if (response.warnings && Object.keys(response.warnings).length > 0) {
        state.cases[action.meta.arg].status = "rejected";
        state.cases[action.meta.arg].error = response.warnings.facets;
      }

      if (!response.data.aggregations) {
        return state;
      }

      Object.entries(response.data.aggregations).forEach(([field, buckets]) => {
        const facet = state.cases[field];
        facet.status = "fulfilled";
        facet.buckets = buckets.buckets.reduce((facetBuckets, apiBucket) => {
          facetBuckets[apiBucket.key] = apiBucket.doc_count;
          return facetBuckets;
        }, {} as Record<string, number>);
      });
    }),
      builder.addCase(fetchFacetByName.pending, (state, action) => {
        const field = action.meta.arg;
        state.cases[field] = {
          status: "pending",
        };
      }),
      builder.addCase(fetchFacetByName.rejected, (state, action) => {
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
