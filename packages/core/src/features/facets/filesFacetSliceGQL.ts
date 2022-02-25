import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CoreDispatch, CoreState } from "../../store";
import {
  graphqlAPI,
  GraphQLApiResponse
} from "../gdcapi/gdcgraphql";

import { selectCurrentCohortGqlFilters } from "../cohort/cohortFilterSlice";
import {
  FacetBuckets,
  buildGraphGLBucketQuery, processBuckets,
} from "./facetApiGQL";

/**
 *  GraphQL methods to fetch files from the GraphQL endpoint
 *  TODO: Really need to refactor this code
 */
export const fetchFileFacetByName = createAsyncThunk<
  GraphQLApiResponse<Record<string, unknown>>,
  string,
  { dispatch: CoreDispatch; state: CoreState }
  >("facet/fetchFilesFacetByName", async (field: string, thunkAPI) => {
  const filters = selectCurrentCohortGqlFilters(thunkAPI.getState());
  const queryGQL = buildGraphGLBucketQuery("files", field, "repository" );
  const filtersGQL =
    {
      "filters_0": filters? filters: {}
    }
  return await graphqlAPI(queryGQL, filtersGQL);
});

const initialState: Record<string, FacetBuckets> = {};

const filesSlice = createSlice({
  name: "facet/filesFacet",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFileFacetByName.fulfilled, (state, action) => {
        const response = action.payload;

        if (response.errors && Object.keys(response.errors).length > 0) {
          state[action.meta.arg].status = "rejected";
          state[action.meta.arg].error = response.errors.facets;
        } else {
          const aggregations = Object(response).data.viewer.repository.files.aggregations;
           aggregations && processBuckets(aggregations, state);
        }
      })
      .addCase(fetchFileFacetByName.pending, (state, action) => {
        const field = action.meta.arg;
        state[field] = {
          status: "pending",
        };
      })
      .addCase(fetchFileFacetByName.rejected, (state, action) => {
        const field = action.meta.arg;
        state[field] = {
          status: "rejected",
        };
      });
  },
});


export const fileFacetsReducer = filesSlice.reducer;

export const selectFilesFacets = (state: CoreState): Record<string, FacetBuckets> =>
  state.facetsGQL.files;

export const selectFilesFacetByField = (
  state: CoreState,
  field: string,
): FacetBuckets => {
  const files = state.facetsGQL.files;
  return files[field];
};


