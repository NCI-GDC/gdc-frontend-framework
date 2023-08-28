import {
  AliasedFieldQuery,
  buildCohortGqlOperator,
  buildGraphGLBucketsQuery,
  GQLIndexType,
  graphqlAPI,
  GraphQLApiResponse,
  FilterSet,
  processBuckets,
  FacetBuckets,
} from "@gff/core";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppDispatch, AppState } from "@/features/repositoryApp/appApi";

const initialState: Record<string, FacetBuckets> = {};

export interface FetchRepositoryFacetByNameGQLProps {
  readonly field: string | ReadonlyArray<string>; // field or fields to fetch bucket counts for
  readonly caseFilters?: FilterSet; // the case filter selector
  readonly localFilters?: FilterSet; // repository filters
}

export const fetchRepositoryFacetsGQL = createAsyncThunk<
  GraphQLApiResponse<Record<string, unknown>>,
  FetchRepositoryFacetByNameGQLProps,
  { dispatch: AppDispatch; state: AppState }
>(
  "repository/fetchRepositoryFacetsGQL",
  async ({ field, caseFilters = undefined, localFilters = undefined }) => {
    const docType = "files";
    const index = "repository" as GQLIndexType;
    const filtersToUpdate = typeof field === "string" ? [field] : field;

    const filtersToQuery = filtersToUpdate.map((f) => ({
      facetName: f.includes(`${docType}.`) ? f.replace(`${docType}.`, "") : f,
      alias: f,
    })) as ReadonlyArray<AliasedFieldQuery>;

    const queryGQL = buildGraphGLBucketsQuery(
      filtersToQuery,
      docType,
      index,
      true,
    );

    const filtersGQL = {
      case_filters: buildCohortGqlOperator(caseFilters),
      filters: buildCohortGqlOperator(
        localFilters ?? { mode: "and", root: {} },
      ),
    };

    return graphqlAPI(queryGQL, filtersGQL);
  },
);

export const repositoryFacetsGQLSlice = createSlice({
  name: "repository/repositoryFacets",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRepositoryFacetsGQL.fulfilled, (state, action) => {
        const response = action.payload;
        const fields =
          typeof action.meta.arg.field === "string"
            ? [action.meta.arg.field]
            : action.meta.arg.field;
        if (response.errors && Object.keys(response.errors).length > 0) {
          fields.forEach(
            (f) =>
              (state[f] = {
                status: "rejected",
                error: response.errors.facets,
              }),
          );
        } else {
          const aggregations =
            Object(response).data.viewer["repository"]["files"].aggregations;
          aggregations && processBuckets(aggregations, state);
        }
      })
      .addCase(fetchRepositoryFacetsGQL.pending, (state, action) => {
        const fields =
          typeof action.meta.arg.field === "string"
            ? [action.meta.arg.field]
            : action.meta.arg.field;
        fields.forEach(
          (f) =>
            (state[f] = state[f] =
              {
                status: "pending",
              }),
        );
      })
      .addCase(fetchRepositoryFacetsGQL.rejected, (state, action) => {
        const fields =
          typeof action.meta.arg.field === "string"
            ? [action.meta.arg.field]
            : action.meta.arg.field;
        fields.forEach(
          (f) =>
            (state[f] = {
              status: "rejected",
            }),
        );
      });
  },
});

export const repositoryFacetsGQLReducer = repositoryFacetsGQLSlice.reducer;

export const selectRepositoryFacets = (
  state: AppState,
  field: string,
): FacetBuckets => state.facetBuckets[field];
