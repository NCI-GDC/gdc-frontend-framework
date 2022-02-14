import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CoreDataSelectorResponse, createUseCoreDataHook,
  DataStatus,
} from "../../dataAcess";

import { CoreDispatch, CoreState } from "../../store";
import {
  GraphQLApiResponse,
  graphqlAPI,
} from "../gdcapi/gdcgraphql";
import { selectCurrentCohortGqlFilters } from "./cohortFilterSlice";


export interface CasesFilesCounts {
  readonly caseCounts: number;
  readonly fileCounts: number;
  readonly genesCounts: number;
  readonly mutationCounts: number;
}

export interface CountsState  {
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
  },
  status: "uninitialized",
};

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

export const fetchCohortCounts = createAsyncThunk<
  GraphQLApiResponse,
  unknown,
  { dispatch: CoreDispatch; state: CoreState }
  >(
  "cohort/counts",
  async ( _, thunkAPI): Promise<GraphQLApiResponse> => {
    const cohortFilters = selectCurrentCohortGqlFilters(thunkAPI.getState());

    const graphQlFilters = cohortFilters? {filters: cohortFilters}: {}
    const results: GraphQLApiResponse<any> = await graphqlAPI(
      CountsGraphQLQuery,
      graphQlFilters,
    );
    return results;
  },
);

const slice = createSlice({
  name: "cohort/counts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCohortCounts.fulfilled, (state, action) => {
        const response = action.payload;

        if (response.warnings && Object.keys(response.warnings).length > 0) {
            state.status = "rejected";
            state.error = response.warnings.counts;
        } else {
          // copy the counts for explore and repository
          state.counts = {
            caseCounts : response.data.viewer.explore.cases.hits.total,
            genesCounts : response.data.viewer.explore.genes.hits.total,
            mutationCounts : response.data.viewer.explore.ssms.hits.total,
            fileCounts : response.data.viewer.repository.files.hits.total,
          };
          state.status = "fulfilled";
          state.error = undefined;
        }
        return state;
      })
      .addCase(fetchCohortCounts.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchCohortCounts.rejected, (state) => {
        state.status = "rejected";
      });
  },
})

export const cohortCountsReducer = slice.reducer;

export const selectCohortCountsData = (
  state: CoreState,
): CoreDataSelectorResponse<Record<string, number>> => {
  return {
    data: state.cohort.counts.counts,
    status: state.cohort.counts.status,
    error: state.cohort.counts.error,
  };
};

export const selectCohortCounts = (state: CoreState) => state.cohort.counts.counts;

export const selectCohortCountsByName = (state: CoreState, name : string) => {
  const counts = state.cohort.counts.counts;
  return counts[name];
}

export const useCohortCounts = createUseCoreDataHook(fetchCohortCounts, selectCohortCountsData);



