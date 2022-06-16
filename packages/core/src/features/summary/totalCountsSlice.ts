import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { graphqlAPI, GraphQLApiResponse } from "../gdcapi/gdcgraphql";
import { CoreDispatch } from "../../store";
import { CoreState } from "../../reducers";
import {
  CoreDataSelectorResponse,
  createUseCoreDataHook,
  DataStatus,
} from "../../dataAccess";

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

export interface TotalCountsState {
  readonly counts: Record<string, number>;
  readonly status: DataStatus;
  readonly error?: string;
}

const initialState: TotalCountsState = {
  counts: {
    caseCounts: -1,
    fileCounts: -1,
    genesCounts: -1,
    mutationCounts: -1,
    repositoryCaseCounts: -1,
  },
  status: "uninitialized",
};

export const fetchTotalCounts = createAsyncThunk<
  GraphQLApiResponse,
  void,
  { dispatch: CoreDispatch; state: CoreState }
>("gdc/totalCounts", async (): Promise<GraphQLApiResponse> => {
  return await graphqlAPI(CountsGraphQLQuery, {});
});

const slice = createSlice({
  name: "gdc/totalCounts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTotalCounts.fulfilled, (state, action) => {
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
          };
          state.status = "fulfilled";
          state.error = undefined;
        }
        return state;
      })
      .addCase(fetchTotalCounts.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchTotalCounts.rejected, (state) => {
        state.status = "rejected";
      });
  },
});

export const totalCountsReducer = slice.reducer;

export const selectTotalCountsData = (
  state: CoreState,
): CoreDataSelectorResponse<Record<string, number>> => {
  return {
    data: state.summary.counts,
    status: state.summary.status,
    error: state.summary.error,
  };
};

export const selectTotalCounts = (state: CoreState): Record<string, number> =>
  state.summary.counts;

export const selectTotalCountsByName = (
  state: CoreState,
  name: string,
): number => {
  const counts = state.summary.counts;
  return counts[name];
};

export const useTotalCounts = createUseCoreDataHook(
  fetchTotalCounts,
  selectTotalCountsData,
);
