import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DataStatus } from "../../dataAcess";
import { CoreDispatch, CoreState } from "../../store";
import {
  fetchGdcCases,
  GdcApiResponse,
  isBucketsAggregation,
} from "../gdcapi/gdcapi";

import { selectCurrentCohortGqlFilters } from "../cohort/cohortFilterSlice";

export const fetchFacetByName = createAsyncThunk<
  GdcApiResponse<unknown>,
  string,
  { dispatch: CoreDispatch; state: CoreState }
>("facet/fetchFacetByName", async (name: string, thunkAPI) => {
  const filters = selectCurrentCohortGqlFilters(thunkAPI.getState());
  return await fetchGdcCases({
    size: 0,
    ...(filters? {filters: filters}: {}),
    facets: [name],
  });
});

export interface FacetBuckets {
  readonly status: DataStatus;
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
              ([field, aggregation]) => {
                if (isBucketsAggregation(aggregation)) {
                  state.cases[field].status = "fulfilled";
                  state.cases[field].buckets = aggregation.buckets.reduce(
                    (facetBuckets, apiBucket) => {
                      facetBuckets[apiBucket.key] = apiBucket.doc_count;
                      return facetBuckets;
                    },
                    {} as Record<string, number>,
                  );
                } else {
                  // Unhandled aggregation
                }
              },
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

export const selectCases = (state: CoreState): Record<string, FacetBuckets> =>
  state.facets.cases;

export const selectCasesFacetByField = (
  state: CoreState,
  field: string,
): FacetBuckets => {
  const cases = state.facets.cases;
  return cases[field];
};
