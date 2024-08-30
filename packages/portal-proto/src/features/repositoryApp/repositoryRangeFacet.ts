import {
  buildContinuousAggregationRangeOnlyQuery,
  FacetBuckets,
  GqlOperation,
  graphqlAPI,
  GraphQLApiResponse,
  NumericFromTo,
  processRangeResults,
  RangeBuckets,
} from "@gff/core";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppDispatch, AppState } from "@/features/repositoryApp/appApi";

export interface FetchContinuousAggregationProps {
  readonly field: string;
  caseFilters?: GqlOperation;
  localFilters?: GqlOperation;
  readonly ranges: ReadonlyArray<NumericFromTo>;
  readonly overrideFilters?: GqlOperation;
}

export const fetchRepositoryFacetContinuousAggregation = createAsyncThunk<
  GraphQLApiResponse<RangeBuckets>,
  FetchContinuousAggregationProps,
  { dispatch: AppDispatch; state: AppState }
>(
  "facet/fetchRepositoryFacetContinuousAggregation",
  async ({
    field,
    ranges,
    caseFilters = undefined,
    localFilters = undefined,
    overrideFilters = undefined,
  }) => {
    const adjField = field.includes("files.")
      ? field.replace("files.", "")
      : field;
    const queryGQL = buildContinuousAggregationRangeOnlyQuery(
      adjField,
      "files",
      "repository",
      field,
    );
    const filtersGQL = {
      caseFilters: overrideFilters ?? caseFilters ?? {},
      filters: localFilters ?? {},
      filters2: { op: "range", content: [{ ranges: ranges }] },
    };

    return await graphqlAPI(queryGQL, filtersGQL);
  },
);

const initialState: Record<string, FacetBuckets> = {};

const repositoryRangeFacetAggregation = createSlice({
  name: "facet/rangeFacetAggregation",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchRepositoryFacetContinuousAggregation.fulfilled,
        (state, action) => {
          const response = action.payload;
          if (response.errors && Object.keys(response.errors).length > 0) {
            state[action.meta.arg.field].status = "rejected";
            state[action.meta.arg.field].error = response.errors.facets;
          } else {
            const aggregations =
              Object(response).data.viewer["repository"]["files"].aggregations;
            if (aggregations) {
              processRangeResults(action.meta.requestId, aggregations, state);
            }
          }
        },
      )
      .addCase(
        fetchRepositoryFacetContinuousAggregation.pending,
        (state, action) => {
          const field = action.meta.arg.field;
          state[field] = {
            status: "pending",
            requestId: action.meta.requestId,
          };
        },
      )
      .addCase(
        fetchRepositoryFacetContinuousAggregation.rejected,
        (state, action) => {
          const field = action.meta.arg.field;
          state[field] = {
            status: "rejected",
          };
        },
      );
  },
});

export const repositoryRangeFacetsReducer =
  repositoryRangeFacetAggregation.reducer;

export const selectRangeFacets = (
  state: AppState,
): Record<string, FacetBuckets> => state.facetRanges;

export const selectRangeFacetByField = (
  state: AppState,
  field: string,
): FacetBuckets => state.facetRanges[field];
