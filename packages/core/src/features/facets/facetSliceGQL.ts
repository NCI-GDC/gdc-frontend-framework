import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DataStatus } from "../../dataAcess";
import { CoreDispatch, CoreState } from "../../store";
import {
  graphqlAPI,
  GraphQLApiResponse
} from "../gdcapi/gdcgraphql";

import { isBucketsAggregation } from "../gdcapi/gdcapi";

import { selectCurrentCohortGqlFilters } from "../cohort/cohortFilterSlice";


const convertFacetNameToGQL = (x:string) => x.replaceAll('.', '__')
const normalizeGQLFacetName = (x:string) => x.replaceAll('__', '.')
export const fetchFacetByName = createAsyncThunk<
  GraphQLApiResponse<Record<string, unknown>>,
  string,
  { dispatch: CoreDispatch; state: CoreState }
>("facet/fetchFacetByName", async (name: string, thunkAPI) => {
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
  name: "facetsGQL",
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

export const selectCases = (state: CoreState): Record<string, FacetBuckets> =>
  state.facets.cases;

export const selectCasesFacetByField = (
  state: CoreState,
  field: string,
): FacetBuckets => {
  const cases = state.facets.cases;
  return cases[field];
};
