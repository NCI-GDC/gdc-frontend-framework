/**
  * Handle Mutation Facets
 */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CoreDispatch, CoreState } from "../../store";
import {
  graphqlAPI,
  GraphQLApiResponse
} from "../gdcapi/gdcgraphql";

import { FacetBuckets, buildGraphGLBucketQuery, processBuckets } from "./facetApiGQL";
import { selectGenomicAndCohortGqlFilters } from "../genomic/genomicFilters";

export const fetchMutationsFacetByName = createAsyncThunk<
  GraphQLApiResponse<Record<string, unknown>>,
  string,
  { dispatch: CoreDispatch; state: CoreState }
>("facet/fetchMutationsFacetByName", async (name: string, thunkAPI) => {
  const filters = selectGenomicAndCohortGqlFilters(thunkAPI.getState());
  const queryGQL = buildGraphGLBucketQuery("ssms", name);
  const filtersGQL =
    {
      "filters_0": filters? filters: {}
    }

  return await graphqlAPI(queryGQL, filtersGQL);
});

export interface MutationsState {
  readonly ssms: Record<string, FacetBuckets>;
}

const initialState: Record<string, FacetBuckets>  = { }

const slice = createSlice({
  name: "facet/genesFacet",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMutationsFacetByName.fulfilled, (state, action) => {
        const response = action.payload;
        if (response.errors && Object.keys(response.errors).length > 0) {
          state[action.meta.arg].status = "rejected";
          state[action.meta.arg].error = response.errors.facets;
        } else {
          const aggregations = Object(response).data.viewer.explore.ssms.aggregations;
           aggregations && processBuckets(aggregations, state);
        }
      })
      .addCase(fetchMutationsFacetByName.pending, (state, action) => {
        const field = action.meta.arg;
        state[field] = {
          status: "pending",
        };
      })
      .addCase(fetchMutationsFacetByName.rejected, (state, action) => {
        const field = action.meta.arg;
        state[field] = {
          status: "rejected",
        };
      });
  },
});

export const mutationsFacetReducer = slice.reducer;

export const selectMutationsFacets = (state: CoreState): Record<string, FacetBuckets> =>
  state.facetsGQL.ssms;

export const selectMutationsFacetByField = (
  state: CoreState,
  field: string,
): FacetBuckets => {
  const ssms = state.facetsGQL.ssms;
  return ssms[field];
};


