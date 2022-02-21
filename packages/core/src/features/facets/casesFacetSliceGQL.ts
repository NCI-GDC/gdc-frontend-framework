/**
 * Drop in replacement for facetSlice which uses the GraphQL API.
 * This was done as genes/mutation filters do not seem to be supported by
 * the REST API.
 */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CoreDispatch, CoreState } from "../../store";
import {
  graphqlAPI,
  GraphQLApiResponse
} from "../gdcapi/gdcgraphql";

import { isBucketsAggregation } from "../gdcapi/gdcapi";
import { selectCurrentCohortGqlFilters } from "../cohort/cohortFilterSlice";
import {
  FacetBuckets,
  normalizeGQLFacetName,
  buildGraphGLBucketQuery
} from "./facetApiGQL";


export const fetchCaseFacetByName = createAsyncThunk<
  GraphQLApiResponse<Record<string, unknown>>,
  string,
  { dispatch: CoreDispatch; state: CoreState }
>("facet/fetchCasesFacetByName", async (field: string, thunkAPI) => {
  const filters = selectCurrentCohortGqlFilters(thunkAPI.getState());
  const queryGQL = buildGraphGLBucketQuery("cases", field)

  const filtersGQL =
    {
      "filters_0": filters? filters: {}
    }

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
          const aggregations = Object(response).data.viewer.explore.cases.aggregations;
          aggregations &&
          Object.entries(aggregations).forEach(
            ([field, aggregation]) => {
              const normalizedField = normalizeGQLFacetName(field)
              if (isBucketsAggregation(aggregation)) {
                state[normalizedField].status = "fulfilled";
                state[normalizedField].buckets = aggregation.buckets.reduce(
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

export const selectCaseFacets = (state: CoreState): Record<string, FacetBuckets> =>
  state.facetsGQL.cases;

export const selectCaseFacetByField = (
  state: CoreState,
  field: string,
): FacetBuckets => {
  const cases = state.facetsGQL.cases;
  return cases[field];
};





