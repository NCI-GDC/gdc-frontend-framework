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

const graphQLQuery = `query Queries($caseFilters: FiltersArgument, $filters: FiltersArgument, $allFilters: FiltersArgument ) {
  viewer {
    cart_summary {
      aggregations(filters: $allFilters) {
        fs {
          value
        }
      }
    }
    repository {
      cases {
          hits(case_filters: $caseFilters, filters: $filters, first: 0) {
            total
          }
        }
    }
  }
}`;

interface fetchTotalFileSizeProps {
  cohortFilters?: GqlOperation; // filters for the cohort
  localFilters?: GqlOperation; // filters for the repository
  allFilters?: GqlOperation; // combined filters for the cohort and repository
}

export const fetchTotalFileSize = createAsyncThunk<
  GraphQLApiResponse,
  fetchTotalFileSizeProps,
  { dispatch: CoreDispatch; state: CoreState }
>(
  "files/fetchFilesSize",
  async ({ cohortFilters, localFilters, allFilters }) => {
    const graphQlFilters = {
      filters: localFilters ?? {},
      caseFilters: cohortFilters ?? {},
      allFilters: allFilters,
    };
    return await graphqlAPI(graphQLQuery, graphQlFilters);
  },
);

export interface FilesSizeData {
  total_file_size: number;
  total_case_count: number;
}

export interface CartSummary {
  data: FilesSizeData;
  status: DataStatus;
  error?: string;
  readonly requestId?: string;
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
        if (state.requestId != action.meta.requestId) return state;
        const response = action.payload;
        if (response.errors) {
          state.status = "rejected";
          return state;
        } else {
          state.data = {
            total_file_size:
              response?.data?.viewer?.cart_summary?.aggregations.fs?.value,
            total_case_count:
              response?.data?.viewer?.repository?.cases?.hits?.total,
          };
          state.status = "fulfilled";
          return state;
        }
      })
      .addCase(fetchTotalFileSize.pending, (state, action) => {
        state.status = "pending";
        state.requestId = action.meta.requestId;
      })
      .addCase(fetchTotalFileSize.rejected, (state, action) => {
        if (state.requestId != action.meta.requestId) return state;
        state.status = "rejected";
        return state;
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
