import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createUseCoreDataHook,
  DataStatus,
  CoreDataSelectorResponse,
} from "../../dataAcess";
import { CoreState, CoreDispatch } from "../../store";
import { GraphQLApiResponse, graphqlAPI } from "../gdcapi/gdcgraphql";

const graphQLQuery = `
  query VennDiagram(
    $set1Filters: FiltersArgument
    $set2Filters: FiltersArgument
    $intersectionFilters: FiltersArgument
  ) {
    viewer {
      explore {
        set1: cases {
          hits(filters: $set1Filters, first: 0) {
            total
          }
        }
        set2: cases {
          hits(filters: $set2Filters,  first: 0) {
            total
          }
        }
        intersection: cases {
          hits(filters: $intersectionFilters,  first: 0) {
            total
          }
        }
      }
    }
  }
`;

export interface CohortVennDiagramState {
  readonly data: any;
  readonly status: DataStatus;
  readonly error?: string;
}

const initialState: CohortVennDiagramState = {
  data: [],
  status: "uninitialized",
};

export const fetchVennCounts = createAsyncThunk<
  GraphQLApiResponse,
  { set1Filters: any; set2Filters: any; intersectionFilters: any },
  { dispatch: CoreDispatch; state: CoreState }
>(
  "cohortComparison/cohortVenn",
  async ({ set1Filters, set2Filters, intersectionFilters }) => {
    const graphQLFilters = {
      set1Filters,
      set2Filters,
      intersectionFilters,
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
      .addCase(fetchVennCounts.fulfilled, (state, action) => {
        const response = action.payload;

        if (response.errors) {
          state.status = "rejected";
        } else {
          state.data = action.payload.data.viewer.explore;
          state.status = "fulfilled";
        }
        return state;
      })
      .addCase(fetchVennCounts.pending, (state) => {
        state.status = "pending";
        return state;
      })
      .addCase(fetchVennCounts.rejected, (state) => {
        state.status = "rejected";
        return state;
      });
  },
});

export const cohortVennDiagramReducer = slice.reducer;

export const selectCohortVennDiagramData = (
  state: CoreState,
): CoreDataSelectorResponse<any> => {
  return {
    data: state.cohortComparison.venn.data,
    status: state.cohortComparison.venn.status,
  };
};

export const useVennIntersectionData = createUseCoreDataHook(
  fetchVennCounts,
  selectCohortVennDiagramData,
);
