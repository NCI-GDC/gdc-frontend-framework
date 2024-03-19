import { combineReducers } from "redux";
import { rangeFacetsReducer } from "./continuousAggregationSlice";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { graphqlAPI, GraphQLApiResponse } from "../gdcapi/gdcgraphql";
import { CoreDispatch } from "../../store";
import { CoreState } from "../../reducers";
import {
  buildCohortGqlOperator,
  joinFilters,
  selectCurrentCohortFilters,
  FilterSet,
} from "../cohort";
import {
  buildGraphGLBucketsQuery,
  processBuckets,
  AliasedFieldQuery,
} from "./facetApiGQL";
import { FacetBuckets, GQLIndexType, GQLDocType } from "./types";
import { FacetsState } from "./facetSlice";
import { facetDictionaryReducer } from "./facetDictionarySlice";
import { usefulFacetsReducer } from "./usefulFacetsSlice";

export interface FetchFacetByNameGQLProps {
  readonly field: string | ReadonlyArray<string>;
  readonly docType?: GQLDocType;
  readonly index?: GQLIndexType;
  readonly caseFilterSelector?: (state: CoreState) => FilterSet;
  readonly localFilters?: FilterSet;
  readonly splitIntoCasePlusLocalFilters?: boolean;
}

export const fetchFacetByNameGQL = createAsyncThunk<
  GraphQLApiResponse<Record<string, unknown>>,
  FetchFacetByNameGQLProps,
  { dispatch: CoreDispatch; state: CoreState }
>(
  "facet/fetchCasesFacetByNameGQL",
  async (
    {
      field,
      docType = "cases",
      index = "explore" as GQLIndexType,
      caseFilterSelector = selectCurrentCohortFilters,
      localFilters = undefined,
      splitIntoCasePlusLocalFilters = false,
    },
    thunkAPI,
  ) => {
    const caseFilters = caseFilterSelector(thunkAPI.getState());
    // the GDC GraphQL schema does accept the docType prepended if the
    // docType is the same. Remove it but use the original field string
    // as the alias which reduces the complexity when processing facet buckets
    const filtersToUpdate = typeof field === "string" ? [field] : field;

    const filtersToQuery = filtersToUpdate.map((f) => ({
      facetName: f.includes(`${docType}.`) ? f.replace(`${docType}.`, "") : f,
      alias: f,
    })) as ReadonlyArray<AliasedFieldQuery>;

    const queryGQL = buildGraphGLBucketsQuery(
      filtersToQuery,
      docType,
      index,
      splitIntoCasePlusLocalFilters,
    );
    let filtersGQL: Record<string, unknown> = {};

    if (splitIntoCasePlusLocalFilters) {
      filtersGQL = {
        case_filters: buildCohortGqlOperator(caseFilters),
        filters: buildCohortGqlOperator(
          localFilters ?? { mode: "and", root: {} },
        ),
      };
    } else {
      filtersGQL = {
        filters: buildCohortGqlOperator(
          joinFilters(caseFilters, localFilters ?? { mode: "and", root: {} }),
        ),
      };
    }
    return graphqlAPI(queryGQL, filtersGQL);
  },
);

export interface FacetStateGQL extends FacetsState {
  readonly genes: Record<string, FacetBuckets>;
  readonly ssms: Record<string, FacetBuckets>;
  readonly projects: Record<string, FacetBuckets>;
}

const initialState: FacetStateGQL = {
  cases: {},
  files: {},
  genes: {},
  ssms: {},
  projects: {},
};

export const facetsGQLSlice = createSlice({
  name: "facet/facetsGQL",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFacetByNameGQL.fulfilled, (state, action) => {
        const response = action.payload;
        const index = action.meta.arg.index ?? "explore";
        const docType = action.meta.arg.docType ?? "cases";
        const fields =
          typeof action.meta.arg.field === "string"
            ? [action.meta.arg.field]
            : action.meta.arg.field;
        if (response.errors && Object.keys(response.errors).length > 0) {
          fields.forEach(
            (f) =>
              (state[docType][f] = {
                status: "rejected",
                error: response.errors.facets,
              }),
          );
        } else {
          const aggregations =
            docType === "projects"
              ? Object(response).data.viewer[docType].aggregations
              : Object(response).data.viewer[index][docType].aggregations;
          aggregations &&
            processBuckets(action.meta.requestId, aggregations, state[docType]);
        }
      })
      .addCase(fetchFacetByNameGQL.pending, (state, action) => {
        const fields =
          typeof action.meta.arg.field === "string"
            ? [action.meta.arg.field]
            : action.meta.arg.field;
        const itemType = action.meta.arg.docType ?? "cases";
        fields.forEach(
          (f) =>
            (state[itemType][f] = state[itemType][f] =
              {
                status: "pending",
                requestId: action.meta.requestId, // add request id to track pending requests
                // used to determine if the request is still valid
              }),
        );
      })
      .addCase(fetchFacetByNameGQL.rejected, (state, action) => {
        const fields =
          typeof action.meta.arg.field === "string"
            ? [action.meta.arg.field]
            : action.meta.arg.field;
        const itemType = action.meta.arg.docType ?? "cases";
        fields.forEach(
          (f) =>
            (state[itemType][f] = {
              status: "rejected",
            }),
        );
      });
  },
});

export const facetsGQLReducer = facetsGQLSlice.reducer;

export const selectCaseFacets = (
  state: CoreState,
): Record<string, FacetBuckets> => state.facetsGQL.facetsGQL.cases;

export const selectFacetByDocTypeAndField = (
  state: CoreState,
  docType: GQLDocType,
  field: string,
): FacetBuckets => state.facetsGQL.facetsGQL[docType][field];

// TODO: Memoize this selector
export const selectMultipleFacetsByDocTypeAndField = (
  state: CoreState,
  docType: GQLDocType,
  fields: ReadonlyArray<string>,
): ReadonlyArray<FacetBuckets> =>
  fields.map((field) => state.facetsGQL.facetsGQL[docType][field]);

export const selectCaseFacetByField = (
  state: CoreState,
  field: string,
): FacetBuckets => state.facetsGQL.facetsGQL.cases[field];

export const selectFileFacets = (
  state: CoreState,
): Record<string, FacetBuckets> => state.facetsGQL.facetsGQL.files;

export const selectFileFacetByField = (
  state: CoreState,
  field: string,
): FacetBuckets => state.facetsGQL.facetsGQL.files[field];

export const selectGenesFacets = (
  state: CoreState,
): Record<string, FacetBuckets> => state.facetsGQL.facetsGQL.genes;

export const selectGenesFacetByField = (
  state: CoreState,
  field: string,
): FacetBuckets => state.facetsGQL.facetsGQL.genes[field];

export const selectSSMSFacets = (
  state: CoreState,
): Record<string, FacetBuckets> => state.facetsGQL.facetsGQL.ssms;

export const selectSSMSFacetByField = (
  state: CoreState,
  field: string,
): FacetBuckets => state.facetsGQL.facetsGQL.ssms[field];

export const selectProjectsFacetByField = (
  state: CoreState,
  field: string,
): FacetBuckets => state.facetsGQL.facetsGQL.projects[field];

export const fileCaseGenesMutationsFacetReducers = combineReducers({
  facetsGQL: facetsGQLReducer,
  ranges: rangeFacetsReducer,
  dictionary: facetDictionaryReducer,
  usefulFacets: usefulFacetsReducer,
});
