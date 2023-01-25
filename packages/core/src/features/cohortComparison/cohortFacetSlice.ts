import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createUseCoreDataHook,
  DataStatus,
  CoreDataSelectorResponse,
} from "../../dataAccess";
import { CoreDispatch } from "../../store";
import { CoreState } from "../../reducers";
import { GraphQLApiResponse, graphqlAPI } from "../gdcapi/gdcgraphql";
import { buildCohortGqlOperator, FilterSet } from "../cohort";
import { DAYS_IN_YEAR } from "../../constants";

const graphQLQuery = `
  query CohortComparison(
    $cohort1: FiltersArgument
    $cohort2: FiltersArgument
    $facets: [String]!
    $interval: Float
  ) {
    viewer {
      explore {
        cohort1: cases {
          hits(filters: $cohort1, first: 50000) {
            total
            edges {
              node {
                case_id
              }
            }
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
          hits(filters: $cohort2,  first: 50000) {
            total
            edges {
              node {
                case_id
              }
            }
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

interface CaseNode {
  readonly node: {
    case_id: string;
  };
}

export interface CohortFacet {
  [facet_name: string]: {
    buckets: Array<CohortFacetDoc>;
  };
}

interface CohortComparisonData {
  aggregations: CohortFacet[];
  caseCounts: number[];
  caseIds: string[][];
}

export interface CohortComparisonState {
  readonly data: CohortComparisonData;
  readonly status: DataStatus;
  readonly error?: string;
}

const initialState: CohortComparisonState = {
  data: {
    aggregations: [],
    caseCounts: [],
    caseIds: [],
  },
  status: "uninitialized",
};

export const fetchCohortFacets = createAsyncThunk<
  GraphQLApiResponse,
  {
    facetFields: string[];
    cohorts: Array<{
      filter: FilterSet;
      name: string;
    }>;
  },
  { dispatch: CoreDispatch; state: CoreState }
>("cohortComparison/cohortFacets", async ({ facetFields, cohorts }) => {
  const graphQLFilters = {
    cohort1: buildCohortGqlOperator(cohorts[0].filter),
    cohort2: buildCohortGqlOperator(cohorts[1].filter),
    facets: facetFields,
    interval: 10 * DAYS_IN_YEAR,
  };
  return await graphqlAPI(graphQLQuery, graphQLFilters);
});

const slice = createSlice({
  name: "cases",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCohortFacets.fulfilled, (state, action) => {
        const response = action.payload;

        if (response.errors) {
          state.status = "rejected";
        } else {
          const facets1 = JSON.parse(
            response.data.viewer.explore.cohort1.facets,
          );
          const facets2 = JSON.parse(
            response.data.viewer.explore.cohort2.facets,
          );

          facets1["diagnoses.age_at_diagnosis"] =
            response.data.viewer.explore.cohort1.aggregations.diagnoses__age_at_diagnosis.histogram;
          facets2["diagnoses.age_at_diagnosis"] =
            response.data.viewer.explore.cohort2.aggregations.diagnoses__age_at_diagnosis.histogram;

          state.data.aggregations = [facets1, facets2];
          state.data.caseCounts = [
            response.data.viewer.explore.cohort1.hits.total,
            response.data.viewer.explore.cohort2.hits.total,
          ];
          state.data.caseIds = [
            response.data.viewer.explore.cohort1.hits.edges.map(
              (node: CaseNode) => node.node.case_id,
            ),
            response.data.viewer.explore.cohort2.hits.edges.map(
              (node: CaseNode) => node.node.case_id,
            ),
          ];
          state.status = "fulfilled";
        }
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

export const selectCohortFacetsData = (
  state: CoreState,
): CoreDataSelectorResponse<CohortComparisonData> => {
  return {
    data: state.cohortComparison.facets.data,
    status: state.cohortComparison.facets.status,
  };
};

export const useCohortFacets = createUseCoreDataHook(
  fetchCohortFacets,
  selectCohortFacetsData,
);
