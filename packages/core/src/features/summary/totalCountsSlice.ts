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
      projects {
      aggregations {
        primary_site {
          buckets {
            key
          }
        }
      }
      hits(first: 0) {
        total
      }
    }
    repository {
      cases {
        hits(case_filters: $filters, first: 0) {
          total
        }
      },
      files {
        hits(case_filters: $filters, first: 0) {
          total
        }
      }
    },
    explore {
      cases {
        hits(case_filters: $filters, first: 0) {
          total
        }
      },
      genes {
        hits(case_filters: $filters, first: 0) {
          total
        }
      },
      ssms {
        hits(case_filters: $filters, first: 0) {
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
  readonly requestId?: string;
}

const initialState: TotalCountsState = {
  counts: {
    caseCounts: -1,
    fileCounts: -1,
    genesCounts: -1,
    mutationCounts: -1,
    repositoryCaseCounts: -1,
    projectsCounts: -1,
    primarySiteCounts: -1,
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
          if (state.requestId != action.meta.requestId) return state;

          // copy the counts for explore and repository
          state.counts = {
            caseCounts: response.data.viewer.explore.cases.hits.total,
            genesCounts: response.data.viewer.explore.genes.hits.total,
            mutationCounts: response.data.viewer.explore.ssms.hits.total,
            fileCounts: response.data.viewer.repository.files.hits.total,
            projectsCounts: response.data.viewer.projects.hits.total,
            primarySiteCounts:
              response.data.viewer.projects.aggregations.primary_site.buckets
                .length,
            repositoryCaseCounts:
              response.data.viewer.repository.cases.hits.total,
          };
          state.status = "fulfilled";
          state.error = undefined;
        }
        return state;
      })
      .addCase(fetchTotalCounts.pending, (state, action) => {
        state.status = "pending";
        state.requestId = action.meta.requestId;
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
