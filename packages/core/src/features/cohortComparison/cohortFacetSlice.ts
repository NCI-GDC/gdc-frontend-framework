import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createUseCoreDataHook, DataStatus } from "../../dataAcess";
import { CoreState, CoreDispatch } from "../../store";
import { GraphQLApiResponse, graphqlAPI } from "../gdcapi/gdcgraphql";
import {
  buildCohortGqlOperator,
  selectCurrentCohortCaseGqlFilters,
} from "../cohort/cohortFilterSlice";
import { selectAvailableCohortByName } from "../cohort/availableCohortsSlice";
import { COHORTS } from "../cohort/cohortFixture";

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

export interface CohortComparisonState {
  aggregations: any;
  caseCounts: any;
  status: DataStatus;
}

const initialState: CohortComparisonState = {
  aggregations: [],
  caseCounts: [],
  status: "uninitialized",
};

export const fetchCohortCases = createAsyncThunk<
  GraphQLApiResponse,
  string[],
  { dispatch: CoreDispatch; state: CoreState }
>("cohortComparison/cohortCases", async (facetFields, thunkAPI) => {
  const cohortFilters = selectCurrentCohortCaseGqlFilters(thunkAPI.getState());
  

  const cohort2Filters = buildCohortGqlOperator(selectAvailableCohortByName(thunkAPI.getState(), COHORTS[1].name).filters);
  console.log("cohort filter", selectAvailableCohortByName(thunkAPI.getState(), COHORTS[1].name));
  const graphQLFilters = {
    cohort1: cohortFilters,
    cohort2: cohort2Filters,
    facets: facetFields,
    interval: 10 * 365.25,
  };
  return await graphqlAPI(graphQLQuery, graphQLFilters);
});

const slice = createSlice({
  name: "cases",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCohortCases.fulfilled, (state, action) => {
        console.log(action.payload);
        const facet1 = JSON.parse(
          action.payload.data.viewer.repository.cohort1.facets,
        );
        const facet2 = JSON.parse(
            action.payload.data.viewer.repository.cohort2.facets,
        );

        facet1['diagnoses.age_at_diagnosis'] = action.payload.data.viewer.repository.cohort1.aggregations.diagnoses__age_at_diagnosis.histogram;
        facet2['diagnoses.age_at_diagnosis'] = action.payload.data.viewer.repository.cohort2.aggregations.diagnoses__age_at_diagnosis.histogram;

        state.aggregations = [facet1, facet2];
        state.caseCounts = [
          action.payload.data.viewer.repository.cohort1.hits.total,
          action.payload.data.viewer.repository.cohort2.hits.total,
        ];
        state.status = "fulfilled";
        return state;
      })
      .addCase(fetchCohortCases.pending, (state) => {
        state.status = "pending";
        return state;
      })
      .addCase(fetchCohortCases.rejected, (state) => {
        state.status = "rejected";
        return state;
      });
  },
});

export const cohortCasesReducer = slice.reducer;

export const selectCohortCasesData = (state: CoreState) => {
  return {
    data: state.cohortComparison,
    status: state.cohortComparison.status,
  };
};

export const useCohortCases = createUseCoreDataHook(
  fetchCohortCases,
  selectCohortCasesData,
);
