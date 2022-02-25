/**
  * Handle Genes Facets
 */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CoreDispatch, CoreState } from "../../store";
import {
  graphqlAPI,
  GraphQLApiResponse
} from "../gdcapi/gdcgraphql";

import { FacetBuckets, buildGraphGLBucketQuery, processBuckets } from "./facetApiGQL";
import { selectCurrentCohortGqlFilters } from "../cohort/cohortFilterSlice";

export const fetchGenesFacetByName = createAsyncThunk<
  GraphQLApiResponse<Record<string, unknown>>,
  string,
  { dispatch: CoreDispatch; state: CoreState }
>("facet/fetchGenesFacetByName", async (name: string, thunkAPI) => {
  const filters = selectCurrentCohortGqlFilters(thunkAPI.getState());
  const queryGQL = buildGraphGLBucketQuery("genes", name);
  const filtersGQL =
    {
      "filters_0": filters? filters: {}
    }

  return await graphqlAPI(queryGQL, filtersGQL);
});

const initialState: Record<string, FacetBuckets>  = { };

const slice = createSlice({
  name: "facet/genesFacet",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGenesFacetByName.fulfilled, (state, action) => {
        const response = action.payload;

        if (response.errors && Object.keys(response.errors).length > 0) {
          state[action.meta.arg].status = "rejected";
          state[action.meta.arg].error = response.errors.facets;
        } else {
          const aggregations = Object(response).data.viewer.explore.genes.aggregations;
           aggregations && processBuckets(aggregations, state);
        }
      })
      .addCase(fetchGenesFacetByName.pending, (state, action) => {
        const field = action.meta.arg;
        state[field] = {
          status: "pending",
        };
      })
      .addCase(fetchGenesFacetByName.rejected, (state, action) => {
        const field = action.meta.arg;
        state[field] = {
          status: "rejected",
        };
      });
  },
});

export const genesFacetReducer = slice.reducer;

export const selectGenesFacets = (state: CoreState): Record<string, FacetBuckets> =>
  state.facetsGQL.genes;

export const selectGenesFacetByField = (
  state: CoreState,
  field: string,
): FacetBuckets => {
  const genes = state.facetsGQL.genes;
  return genes[field];
};


