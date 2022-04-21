import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createUseCoreDataHook, DataStatus } from "../../dataAcess";
import { CoreState, CoreDispatch } from "../../store";
import { GraphQLApiResponse, graphqlAPI } from "../gdcapi/gdcgraphql";
import { buildCohortGqlOperator } from "../cohort/cohortFilterSlice";
import { selectAvailableCohortByName } from "../cohort/availableCohortsSlice";
import { DAYS_IN_YEAR } from "../../constants";

const graphQLQuery = `
  query CohortComparison(
    $cohort1: FiltersArgument
    $cohort2: FiltersArgument
    $facets: [String]!
    $interval: Float
  ) {
    viewer {
      repository {
        cohort1: cases {
          hits(filters: $cohort1) {
            total
          }
          facets(filters: $cohort1, facets: $facets)
          aggregations(filters: $cohort1) {
            diagnoses__age_at_diagnosis {
              stats {
                min
                max
              }
              histogram(interval: $interval) {
                buckets {
                  doc_count
                  key
                }
              }
            }
          }
        }
        cohort2: cases {
          hits(filters: $cohort2) {
            total
          }
          facets(filters: $cohort2, facets: $facets)
          aggregations(filters: $cohort2) {
            diagnoses__age_at_diagnosis {
              stats {
                min
                max
              }
              histogram(interval: $interval) {
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
  }
`;

export interface CohortFacetDoc {
  readonly key: string;
  readonly doc_count: number;
}

export interface CohortFacet {
  [facet_name: string]: {
    buckets: Array<CohortFacetDoc>;
  };
}

export interface CohortComparisonState {
  readonly data: {
    aggregations: CohortFacet[];
    caseCounts: number[];
  };
  readonly status: DataStatus;
}

const initialState: CohortComparisonState = {
  data: {
    aggregations: [],
    caseCounts: [],
  },
  status: "uninitialized",
};

export const fetchCohortFacets = createAsyncThunk<
  GraphQLApiResponse,
  { facetFields: string[]; primaryCohort: string; comparisonCohort: string },
  { dispatch: CoreDispatch; state: CoreState }
>(
  "cohortComparison/cohortFacets",
  async ({ facetFields, primaryCohort, comparisonCohort }, thunkAPI) => {
    const cohortFilters = buildCohortGqlOperator(
      selectAvailableCohortByName(thunkAPI.getState(), primaryCohort).filters,
    );
    const cohort2Filters = buildCohortGqlOperator(
      selectAvailableCohortByName(thunkAPI.getState(), comparisonCohort)
        .filters,
    );

    const graphQLFilters = {
      cohort1: cohortFilters,
      cohort2: cohort2Filters,
      facets: facetFields,
      interval: 10 * DAYS_IN_YEAR,
    };
    return await graphqlAPI(graphQLQuery, graphQLFilters);
  },
);

const slice = createSlice({
  name: "cases",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCohortFacets.fulfilled, (state, action) => {
        const facets1 = JSON.parse(
          action.payload.data.viewer.repository.cohort1.facets,
        );
        const facets2 = JSON.parse(
          action.payload.data.viewer.repository.cohort2.facets,
        );

        facets1["diagnoses.age_at_diagnosis"] =
          action.payload.data.viewer.repository.cohort1.aggregations.diagnoses__age_at_diagnosis.histogram;
        facets2["diagnoses.age_at_diagnosis"] =
          action.payload.data.viewer.repository.cohort2.aggregations.diagnoses__age_at_diagnosis.histogram;

        state.data.aggregations = [facets1, facets2];
        state.data.caseCounts = [
          action.payload.data.viewer.repository.cohort1.hits.total,
          action.payload.data.viewer.repository.cohort2.hits.total,
        ];
        state.status = "fulfilled";
        return state;
      })
      .addCase(fetchCohortFacets.pending, (state) => {
        state.status = "pending";
        return state;
      })
      .addCase(fetchCohortFacets.rejected, (state) => {
        state.status = "rejected";
        return state;
      });
  },
});

export const cohortFacetsReducer = slice.reducer;

export const selectCohortFacetsData = (state: CoreState) => {
  return {
    data: state.cohortComparison?.data,
    status: state.cohortComparison?.status,
  };
};

export const useCohortFacets = createUseCoreDataHook(
  fetchCohortFacets,
  selectCohortFacetsData,
);
