import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CoreDataSelectorResponse,
  createUseCoreDataHook,
  DataStatus,
} from "../../dataAccess";
import { CoreDispatch } from "../../store";
import { CoreState } from "../../reducers";
import { GraphQLApiResponse, graphqlAPI } from "../gdcapi/gdcgraphql";
import { GqlOperation } from "../gdcapi/filters";

const graphQLQuery = `query Queries($filters: FiltersArgument) {
  viewer {
    cart_summary {
      aggregations(filters: $filters) {
        fs {
          value
        }
      }
    }
    repository {
      cases {
          hits(case_filters: $filters, first: 0) {
            total
          }
        }
    }
  }
}`;
export const fetchTotalFileSize = createAsyncThunk<
  GraphQLApiResponse,
  GqlOperation,
  { dispatch: CoreDispatch; state: CoreState }
>("files/fetchFilesSize", async (filters?: GqlOperation) => {
  const graphQlFilters = filters ? { filters: filters } : {};
  return await graphqlAPI(graphQLQuery, graphQlFilters);
});

export interface FilesSizeData {
  total_file_size: number;
  total_case_count: number;
}

export interface CartSummary {
  data: FilesSizeData;
  status: DataStatus;
  error?: string;
}

const initialState: CartSummary = {
  data: {
    total_file_size: 0,
    total_case_count: 0,
  },
  status: "uninitialized",
};

const slice = createSlice({
  name: "fetchFilesSize",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTotalFileSize.fulfilled, (state, action) => {
        const response = action.payload;
        if (response.errors) {
          state.status = "rejected";
        } else {
          state.data = {
            total_file_size:
              response?.data?.viewer?.cart_summary?.aggregations.fs?.value,
            total_case_count:
              response?.data?.viewer?.repository?.cases?.hits?.total,
          };
          state.status = "fulfilled";
        }
      })
      .addCase(fetchTotalFileSize.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchTotalFileSize.rejected, (state) => {
        state.status = "rejected";
      });
  },
});

export const filesSizeReducer = slice.reducer;

export const selectTotalFileSize = (
  state: CoreState,
): CoreDataSelectorResponse<FilesSizeData> => {
  return {
    data: state.filesSize.data,
    status: state.filesSize.status,
  };
};

export const useFilesSize = createUseCoreDataHook(
  fetchTotalFileSize,
  selectTotalFileSize,
);
