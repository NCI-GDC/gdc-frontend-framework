import { createAsyncThunk, Reducer } from "@reduxjs/toolkit";
import {
  // createUseCoreDataHook,
  DataStatus,
  // CoreDataSelectorResponse,
} from "../../dataAccess";
import { CoreDispatch } from "../../store";
import { CoreState } from "../../reducers";
import { GqlOperation } from "../gdcapi/filters";
import { GraphQLApiResponse, graphqlAPI } from "../gdcapi/gdcgraphql";
import {
  Buckets,
  endpointSlice,
  GdcApiRequest,
  GdcApiResponse,
  ProjectDefaults,
  Stats,
} from "../gdcapi/gdcapi";

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

// export const fetchClinicalAnalysisResultUsingCasesAPI = createAsyncThunk<
//   GraphQLApiResponse,
//   {
//     filters: GqlOperation;
//     facets: string[];
//   },
//   { dispatch: CoreDispatch; state: CoreState }
// >("clinicalAnalysisResult", async ({ filters, facets }) => {
//   const graphQLFilters = {
//     filters,
//     facets,
//   };
//   return await graphqlAPI(graphQLQuery, graphQLFilters);
// });

export interface ClinicalAnalysisResult {
  data: Record<string, Buckets | Stats>;
  status: DataStatus;
}

// const initialState: ClinicalAnalysisResult = {
//   data: {},
//   status: "uninitialized",
// };

// const slice = createSlice({
//   name: "clinicalAnalysisResult",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchClinicalAnalysisResult.fulfilled, (state, action) => {
//         const response = action.payload;
//
//         if (response.errors) {
//           state.status = "rejected";
//         } else {
//           state.data =
//             JSON.parse(action.payload.data.viewer?.repository?.cases?.facets) ||
//             {};
//           state.status = "fulfilled";
//         }
//         return state;
//       })
//       .addCase(fetchClinicalAnalysisResult.pending, (state) => {
//         state.status = "pending";
//         return state;
//       })
//       .addCase(fetchClinicalAnalysisResult.rejected, (state) => {
//         state.status = "rejected";
//         return state;
//       });
//   },
// });

//export const clinicalAnalysisReducer = slice.reducer;

// export const selectClinicalAnalysisData = (
//   state: CoreState,
// ): CoreDataSelectorResponse<Record<string, Buckets | Stats>> => {
//   return {
//     data: state.clinicalDataAnalysis.result.data,
//     status: state.clinicalDataAnalysis.result.status,
//   };
// };

// export const useClinicalAnalysis = createUseCoreDataHook(
//   fetchClinicalAnalysisResult,
//   selectClinicalAnalysisData,
// );

/**
 * replacing the above with RTK Query equivalent
 */

export const clinicalAnalysisApiSlice = endpointSlice.injectEndpoints({
  endpoints: (builder) => ({
    getClinicalAnalysis: builder.query({
      query: (request: GdcApiRequest) => ({
        request,
        endpoint: "cases",
        fetchAll: false,
      }),
      transformResponse: (response: GdcApiResponse<ProjectDefaults>) => {
        if (response.data.aggregations)
          return {
            data: response.data.aggregations,
          };
        return {
          data: {},
        };
      },
    }),
  }),
});

export const { useGetClinicalAnalysisQuery } = clinicalAnalysisApiSlice;

export const clinicalAnalysisApiReducer: Reducer =
  clinicalAnalysisApiSlice.reducer as Reducer;
