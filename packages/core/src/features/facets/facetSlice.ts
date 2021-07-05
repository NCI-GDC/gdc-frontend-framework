import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CoreDispatch, CoreState } from "../../store";
import * as api from "./facetApi";

export type FacetBuckets = Record<string, number>;

export const fetchFacetByName = createAsyncThunk<
  api.GdcApiResponse,
  string,
  { dispatch: CoreDispatch; state: CoreState }
>("facet/fetchFacetByName", async (name: string) => {
  return await api.fetchFacetByName(name);
});

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
      if (!response.data.aggregations) {
        return state;
      }

      Object.entries(response.data.aggregations).forEach(([field, buckets]) => {
        state.cases[field] = buckets.buckets.reduce(
          (facetBuckets, apiBucket) => {
            facetBuckets[apiBucket.key] = apiBucket.doc_count;
            return facetBuckets;
          },
          {} as FacetBuckets
        );
      });
    });
  },
});

export const facetsReducer = slice.reducer;

export const selectCases = (state: CoreState) => state.facets.cases;

export const selectCasesFacetByField = (state: CoreState, field: string) => {
  const cases = state.facets.cases;
  return cases[field];
}