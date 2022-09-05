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
import { Buckets, Stats } from "../gdcapi/gdcapi";

const graphQLQuery = `
  query ClinicalAnalysisResult(
    $filters: FiltersArgument
    $facets: [String]!
  ) {
    viewer {
      repository {
        cases {
          facets(facets: $facets, filters: $filters)
          hits(first: 0, filters: $filters) {
            total
          }
        }
      }
    }
  }
`;

export const fetchClinicalAnalysisResult = createAsyncThunk<
  GraphQLApiResponse,
  {
    filters: GqlOperation;
    facets: string[];
  },
  { dispatch: CoreDispatch; state: CoreState }
>("clinicalAnalysisResult", async ({ filters, facets }) => {
  const graphQLFilters = {
    filters,
    facets,
  };
  return await graphqlAPI(graphQLQuery, graphQLFilters);
});

export interface ClinicalAnalysisResult {
  data: Record<string, Buckets | Stats>;
  status: DataStatus;
}

const initialState: ClinicalAnalysisResult = {
  data: {},
  status: "uninitialized",
};

const slice = createSlice({
  name: "clinicalAnalysisResult",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClinicalAnalysisResult.fulfilled, (state, action) => {
        const response = action.payload;

        if (response.errors) {
          state.status = "rejected";
        } else {
          state.data =
            JSON.parse(action.payload.data.viewer?.repository?.cases?.facets) ||
            {};
          state.status = "fulfilled";
        }
        return state;
      })
      .addCase(fetchClinicalAnalysisResult.pending, (state) => {
        state.status = "pending";
        return state;
      })
      .addCase(fetchClinicalAnalysisResult.rejected, (state) => {
        state.status = "rejected";
        return state;
      });
  },
});

export const clinicalAnalysisReducer = slice.reducer;

export const selectClinicalAnalysisData = (
  state: CoreState,
): CoreDataSelectorResponse<Record<string, Buckets | Stats>> => {
  return {
    data: state.clinicalDataAnalysis.result.data,
    status: state.clinicalDataAnalysis.result.status,
  };
};

export const useClinicalAnalysis = createUseCoreDataHook(
  fetchClinicalAnalysisResult,
  selectClinicalAnalysisData,
);
