import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createUseCoreDataHook,
  DataStatus,
  CoreDataSelectorResponse,
} from "../../dataAccess";
import { CoreDispatch } from "../../store";
import { CoreState } from "../../reducers";
import { GqlOperation } from "../gdcapi/filters";
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

interface CountData {
  readonly hits?: {
    readonly total: number;
  };
}

interface CohortVennDiagramData {
  readonly set1: CountData;
  readonly set2: CountData;
  readonly intersection: CountData;
}

export interface CohortVennDiagramState {
  readonly data: CohortVennDiagramData;
  readonly status: DataStatus;
  readonly error?: string;
  readonly requestId?: string;
}

const initialState: CohortVennDiagramState = {
  data: {
    set1: {},
    set2: {},
    intersection: {},
  },
  status: "uninitialized",
};

export const fetchVennCounts = createAsyncThunk<
  GraphQLApiResponse,
  {
    set1Filters: GqlOperation;
    set2Filters: GqlOperation;
    intersectionFilters: GqlOperation;
  },
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
        if (state.requestId != action.meta.requestId) return state;

        const response = action.payload;

        if (response.errors) {
          state.status = "rejected";
        } else {
          state.data = action.payload.data.viewer.explore;
          state.status = "fulfilled";
        }
        return state;
      })
      .addCase(fetchVennCounts.pending, (state, action) => {
        state.status = "pending";
        state.requestId = action.meta.requestId;
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
): CoreDataSelectorResponse<CohortVennDiagramData> => {
  return {
    data: state.cohortComparison.venn.data,
    status: state.cohortComparison.venn.status,
  };
};

export const useVennIntersectionData = createUseCoreDataHook(
  fetchVennCounts,
  selectCohortVennDiagramData,
);
