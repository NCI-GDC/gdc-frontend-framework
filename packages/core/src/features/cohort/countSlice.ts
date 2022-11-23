import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CoreDataSelectorResponse,
  createUseCoreDataHook,
  createUseFiltersCoreDataHook,
  DataStatus,
} from "../../dataAccess";
import { buildCohortGqlOperator } from "./filters";

import { CoreDispatch } from "../../store";
import { CoreState } from "../../reducers";
import { graphqlAPI, GraphQLApiResponse } from "../gdcapi/gdcgraphql";
import { selectCurrentCohortFilterSet } from "./availableCohortsSlice";

export interface CountsState {
  readonly counts: Record<string, number>;
  readonly status: DataStatus;
  readonly error?: string;
}

const initialState: CountsState = {
  counts: {
    caseCounts: -1,
    fileCounts: -1,
    genesCounts: -1,
    mutationCounts: -1,
    casesMax: -1,
  },
  status: "uninitialized",
};
export interface CountsState {
  readonly counts: Record<string, number>;
  readonly status: DataStatus;
  readonly error?: string;
}

const CountsGraphQLQuery = `
  query countsQuery($filters: FiltersArgument) {
  viewer {
    repository {
      cases {
        hits(filters: $filters, first: 0) {
          total
        }
      },
      files {
        hits(filters: $filters, first: 0) {
          total
        }
      }
    },
    explore {
      cases {
        hits(filters: $filters, first: 0) {
          total
        }
      },
      genes {
        hits(filters: $filters, first: 0) {
          total
        }
      },
      ssms {
        hits(filters: $filters, first: 0) {
          total
        }
      }
    }
  }
}`;

export const fetchCohortCaseCounts = createAsyncThunk<
  GraphQLApiResponse,
  void,
  { dispatch: CoreDispatch; state: CoreState }
>("cohort/CohortCounts", async (_, thunkAPI): Promise<GraphQLApiResponse> => {
  const cohortFilters = buildCohortGqlOperator(
    selectCurrentCohortFilterSet(thunkAPI.getState()),
  );
  const graphQlFilters = cohortFilters ? { filters: cohortFilters } : {};
  return await graphqlAPI(CountsGraphQLQuery, graphQlFilters);
});

const slice = createSlice({
  name: "cohort/counts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCohortCaseCounts.fulfilled, (state, action) => {
        const response = action.payload;
        if (response.errors && Object.keys(response.errors).length > 0) {
          state.status = "rejected";
          state.error = response.errors.counts;
        } else {
          // copy the counts for explore and repository
          state.counts = {
            caseCounts: response.data.viewer.explore.cases.hits.total,
            genesCounts: response.data.viewer.explore.genes.hits.total,
            mutationCounts: response.data.viewer.explore.ssms.hits.total,
            fileCounts: response.data.viewer.repository.files.hits.total,
            repositoryCaseCounts:
              response.data.viewer.repository.cases.hits.total,
            casesMax: Math.max(
              response.data.viewer.explore.cases.hits.total,
              response.data.viewer.repository.cases.hits.total,
            ),
          };
          state.status = "fulfilled";
          state.error = undefined;
        }
        return state;
      })
      .addCase(fetchCohortCaseCounts.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchCohortCaseCounts.rejected, (state) => {
        state.status = "rejected";
      });
  },
});

export const cohortCountsReducer = slice.reducer;

export const selectCohortCountsData = (
  state: CoreState,
): CoreDataSelectorResponse<Record<string, number>> => {
  return {
    data: state.cohort.cohortCounts.counts,
    status: state.cohort.cohortCounts.status,
    error: state.cohort.cohortCounts.error,
  };
};

export const selectCohortCounts = (state: CoreState): Record<string, number> =>
  state.cohort.cohortCounts.counts;

export const selectCohortCountsByName = (
  state: CoreState,
  name: string,
): number => {
  const counts = state.cohort.cohortCounts.counts;
  return counts[name];
};

export const useCohortCounts = createUseCoreDataHook(
  fetchCohortCaseCounts,
  selectCohortCountsData,
);

export const useFilteredCohortCounts = createUseFiltersCoreDataHook(
  fetchCohortCaseCounts,
  selectCohortCountsData,
  selectCurrentCohortFilterSet,
);
