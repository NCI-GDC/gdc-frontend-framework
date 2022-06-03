import { combineReducers } from "redux";
import { rangeFacetsReducer } from "./continuousAggregationSlice";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { graphqlAPI, GraphQLApiResponse } from "../gdcapi/gdcgraphql";
import { CoreDispatch, CoreState } from "../../store";
import { selectCurrentCohortGqlFilters } from "../cohort/cohortFilterSlice";
import { buildGraphGLBucketQuery, processBuckets } from "./facetApiGQL";
import { FacetBuckets, GQLIndexType, GQLDocType } from "./types";
import { FacetsState } from "./facetSlice";
import { facetDictionaryReducer } from "./facetDictionarySlice";

export interface FetchFacetByNameGQLProps {
  readonly field: string;
  readonly docType?: GQLDocType;
  readonly index?: GQLIndexType;
}

export const fetchFacetByNameGQL = createAsyncThunk<
  GraphQLApiResponse<Record<string, unknown>>,
  FetchFacetByNameGQLProps,
  { dispatch: CoreDispatch; state: CoreState }
>(
  "facet/fetchCasesFacetByName",
  async (
    { field, docType = "cases", index = "explore" as GQLIndexType },
    thunkAPI,
  ) => {
    const filters = selectCurrentCohortGqlFilters(thunkAPI.getState());
    const adjField = field.includes(`${docType}.`)
      ? field.replace(`${docType}.`, "")
      : field;
    const queryGQL = buildGraphGLBucketQuery(adjField, docType, index, field);

    const filtersGQL = {
      filters_0: filters ? filters : {},
    };

    return graphqlAPI(queryGQL, filtersGQL);
  },
);

export interface FacetStateGQL extends FacetsState {
  readonly genes: Record<string, FacetBuckets>;
  readonly ssms: Record<string, FacetBuckets>;
}

const initialState: FacetStateGQL = {
  cases: {},
  files: {},
  genes: {},
  ssms: {},
};

const facetsGQLSlice = createSlice({
  name: "facet/facetsGQL",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFacetByNameGQL.fulfilled, (state, action) => {
        const response = action.payload;
        const index = action.meta.arg.index ?? "explore";
        const docType = action.meta.arg.docType ?? "cases";
        const field = action.meta.arg.field;
        if (response.errors && Object.keys(response.errors).length > 0) {
          state[docType][field] = {
            status: "rejected",
            error: response.errors.facets,
          };
        } else {
          const aggregations =
            Object(response).data.viewer[index][docType].aggregations;
          aggregations && processBuckets(aggregations, state[docType]);
        }
      })
      .addCase(fetchFacetByNameGQL.pending, (state, action) => {
        const field = action.meta.arg.field;
        const itemType = action.meta.arg.docType ?? "cases";
        state[itemType][field] = {
          status: "pending",
        };
      })
      .addCase(fetchFacetByNameGQL.rejected, (state, action) => {
        const field = action.meta.arg.field;
        const itemType = action.meta.arg.docType ?? "cases";
        state[itemType][field] = {
          status: "rejected",
        };
      });
  },
});

export const facetsGQLReducer = facetsGQLSlice.reducer;

export const selectCaseFacets = (
  state: CoreState,
): Record<string, FacetBuckets> => state.facetsGQL.facetsGQL.cases;

export const selectCaseFacetByField = (
  state: CoreState,
  field: string,
): FacetBuckets => {
  const root = state.facetsGQL.facetsGQL.cases;
  return root[field];
};

export const selectFileFacets = (
  state: CoreState,
): Record<string, FacetBuckets> => state.facetsGQL.facetsGQL.files;

export const selectFileFacetByField = (
  state: CoreState,
  field: string,
): FacetBuckets => {
  const root = state.facetsGQL.facetsGQL.files;
  return root[field];
};

export const selectGenesFacets = (
  state: CoreState,
): Record<string, FacetBuckets> => state.facetsGQL.facetsGQL.genes;

export const selectGenesFacetByField = (
  state: CoreState,
  field: string,
): FacetBuckets => {
  const root = state.facetsGQL.facetsGQL.genes;
  return root[field];
};

export const selectSSMSFacets = (
  state: CoreState,
): Record<string, FacetBuckets> => state.facetsGQL.facetsGQL.ssms;

export const selectSSMSFacetByField = (
  state: CoreState,
  field: string,
): FacetBuckets => {
  const root = state.facetsGQL.facetsGQL.ssms;
  return root[field];
};

export const fileCaseGenesMutationsFacetReducers = combineReducers({
  facetsGQL: facetsGQLReducer,
  ranges: rangeFacetsReducer,
  dictionary: facetDictionaryReducer,
});
