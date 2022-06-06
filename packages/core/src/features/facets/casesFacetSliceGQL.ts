/**
 * Drop in replacement for facetSlice which uses the GraphQL API.
 */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CoreDispatch } from "../../store";
import { CoreState } from "../../reducers";
import { graphqlAPI, GraphQLApiResponse } from "../gdcapi/gdcgraphql";
import { processBuckets } from "./facetApiGQL";

import { selectCurrentCohortGqlFilters } from "../cohort/cohortFilterSlice";
import { FacetBuckets, buildGraphGLBucketQuery } from "./facetApiGQL";

export const fetchCaseFacetByName = createAsyncThunk<
  GraphQLApiResponse<Record<string, unknown>>,
  string,
  { dispatch: CoreDispatch; state: CoreState }
>("facet/fetchCasesFacetByName", async (field: string, thunkAPI) => {
  const filters = selectCurrentCohortGqlFilters(thunkAPI.getState());
  const queryGQL = buildGraphGLBucketQuery("cases", field);

  const filtersGQL = {
    filters_0: filters ? filters : {},
  };

  return await graphqlAPI(queryGQL, filtersGQL);
});

// these top-level properties should match the gdcapi indices.
// however, this implementation detail should not be exposed to the portal
// export interface FacetsState {
//   readonly cases: Record<string, FacetBuckets>;
// }

const initialState: Record<string, FacetBuckets> = {};

const casesSlice = createSlice({
  name: "facet/casesFacet",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCaseFacetByName.fulfilled, (state, action) => {
        const response = action.payload;

        if (response.errors && Object.keys(response.errors).length > 0) {
          state[action.meta.arg].status = "rejected";
          state[action.meta.arg].error = response.errors.facets;
        } else {
          const aggregations =
            Object(response).data.viewer.explore.cases.aggregations;
          aggregations && processBuckets(aggregations, state);
        }
      })
      .addCase(fetchCaseFacetByName.pending, (state, action) => {
        const field = action.meta.arg;
        state[field] = {
          status: "pending",
        };
      })
      .addCase(fetchCaseFacetByName.rejected, (state, action) => {
        const field = action.meta.arg;
        state[field] = {
          status: "rejected",
        };
      });
  },
});

export const caseFacetsReducer = casesSlice.reducer;

export const selectCaseFacets = (
  state: CoreState,
): Record<string, FacetBuckets> => state.facetsGQL.cases;

export const selectCaseFacetByField = (
  state: CoreState,
  field: string,
): FacetBuckets => {
  const cases = state.facetsGQL.cases;
  return cases[field];
};
