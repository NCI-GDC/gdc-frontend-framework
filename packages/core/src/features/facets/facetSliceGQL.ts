/**
 * Drop in replacement for facetSlice which uses the GraphQL API.
 * This was done as genes/mutation filters do not seem to be supported by
 * the REST API.
 */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DataStatus } from "../../dataAcess";
import { CoreDispatch, CoreState } from "../../store";
import {
  graphqlAPI,
  GraphQLApiResponse
} from "../gdcapi/gdcgraphql";

import { isBucketsAggregation } from "../gdcapi/gdcapi";
import { selectCurrentCohortGqlFilters } from "../cohort/cohortFilterSlice";
import { combineReducers } from "redux";

const convertFacetNameToGQL = (x:string) => x.replaceAll('.', '__')
const normalizeGQLFacetName = (x:string) => x.replaceAll('__', '.')


export const fetchFacetByName = createAsyncThunk<
  GraphQLApiResponse<Record<string, unknown>>,
  string,
  { dispatch: CoreDispatch; state: CoreState }
>("facet/fetchCasesFacetByName", async (name: string, thunkAPI) => {
  const filters = selectCurrentCohortGqlFilters(thunkAPI.getState());

  const queryGQL = `
  query ExploreCasesPies($filters_0: FiltersArgument!) {
      viewer {
          explore {
            cases {
              aggregations(
                filters: $filters_0
                aggregations_filter_themselves: false
              ) {
                ${convertFacetNameToGQL(name)} {
                  buckets {
                    doc_count
                    key
                  }
                }
              }
            }
          }
        }
      }
  `

  const filtersGQL =
    {
      "filters_0": filters? filters: {}
    }

  return await graphqlAPI(queryGQL, filtersGQL);
});

/**
 *  GraphQL methods to fetch files from the GraphQL endpoint
 *  TODO: Really need to refactor this code
 */
export const fetchFileFacetByName = createAsyncThunk<
  GraphQLApiResponse<Record<string, unknown>>,
  string,
  { dispatch: CoreDispatch; state: CoreState }
  >("facet/fetchFilesFacetByName", async (name: string, thunkAPI) => {
  const filters = selectCurrentCohortGqlFilters(thunkAPI.getState());

  const queryGQL = `
  query ExploreFileEnums($filters_0: FiltersArgument!) {
      viewer {
          repository {
            files {
              aggregations(
                filters: $filters_0
                aggregations_filter_themselves: false
              ) {
                ${name} {
                  buckets {
                    doc_count
                    key
                  }
                }
              }
            }
          }
        }
      }
  `

  const filtersGQL =
    {
      "filters_0": filters? filters: {}
    }
  console.log("fetchFileFacetByName: ", queryGQL, JSON.stringify(filtersGQL));
  return await graphqlAPI(queryGQL, filtersGQL);
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

const filesSlice = createSlice({
  name: "facet/filesFacet",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFileFacetByName.fulfilled, (state, action) => {
        const response = action.payload;

        if (response.errors && Object.keys(response.errors).length > 0) {
          state.files[action.meta.arg].status = "rejected";
          state.files[action.meta.arg].error = response.errors.facets;
        } else {
          const aggregations = Object(response).data.viewer.repository.files.aggregations;
           aggregations &&
            Object.entries(aggregations).forEach(
              ([field, aggregation]) => {
                // const normalizedField = normalizeGQLFacetName(field)
                const normalizedField = field;
                if (isBucketsAggregation(aggregation)) {
                  state.files[normalizedField].status = "fulfilled";
                  state.files[normalizedField].buckets = aggregation.buckets.reduce(
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
      .addCase(fetchFileFacetByName.pending, (state, action) => {
        const field = action.meta.arg;
        state.files[field] = {
          status: "pending",
        };
      })
      .addCase(fetchFileFacetByName.rejected, (state, action) => {
        const field = action.meta.arg;
        state.files[field] = {
          status: "rejected",
        };
      });
  },
});

const slice = createSlice({
  name: "facet/casessFacet",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFacetByName.fulfilled, (state, action) => {
        const response = action.payload;

        if (response.errors && Object.keys(response.errors).length > 0) {
          state.cases[action.meta.arg].status = "rejected";
          state.cases[action.meta.arg].error = response.errors.facets;
        } else {
          const aggregations = Object(response).data.viewer.explore.cases.aggregations;
          aggregations &&
          Object.entries(aggregations).forEach(
            ([field, aggregation]) => {
              const normalizedField = normalizeGQLFacetName(field)
              if (isBucketsAggregation(aggregation)) {
                state.cases[normalizedField].status = "fulfilled";
                state.cases[normalizedField].buckets = aggregation.buckets.reduce(
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
export const fileFacetsReducer = filesSlice.reducer;

export const selectCases = (state: CoreState): Record<string, FacetBuckets> =>
  state.facets.cases.cases;

export const selectFilesFacets = (state: CoreState): Record<string, FacetBuckets> =>
  state.facets.files.files;

export const selectCasesFacetByField = (
  state: CoreState,
  field: string,
): FacetBuckets => {
  const cases = state.facets.cases.cases;
  return cases[field];
};

export const selectFilesFacetByField = (
  state: CoreState,
  field: string,
): FacetBuckets => {
  const files = state.facets.files.files;
  return files[field];
};

export const fileCaseFacetReducers = combineReducers({
  cases: facetsReducer,
  files: fileFacetsReducer
})

