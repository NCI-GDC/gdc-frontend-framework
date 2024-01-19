import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CoreDataSelectorResponse,
  createUseCoreDataHook,
  DataStatus,
} from "../../dataAccess";
import { CoreDispatch } from "../../store";
import { CoreState } from "../../reducers";
import { GraphQLApiResponse, graphqlAPI } from "../gdcapi/gdcgraphql";

const graphQLQuery = `
  query CartSummary(
    $fileFilters: FiltersArgument
  ) {
    viewer {
      cart_summary {
        aggregations(filters: $fileFilters) {
          project__project_id {
            buckets {
              case_count
              doc_count
              file_size
              key
            }
          }
        }
      }
    }
  }
`;

export const fetchCartSummary = createAsyncThunk<
  GraphQLApiResponse,
  string[],
  { dispatch: CoreDispatch; state: CoreState }
>("cart/cartSummary", async (cart) => {
  const graphQLFilters = {
    fileFilters: {
      op: "and",
      content: [
        {
          op: "in",
          content: {
            field: "files.file_id",
            value: cart,
          },
        },
      ],
    },
  };
  return await graphqlAPI(graphQLQuery, graphQLFilters);
});

export interface CartAggregation {
  case_count: number;
  doc_count: number;
  file_size: number;
  key: string;
}

export interface CartSummaryData {
  total_case_count: number;
  total_doc_count: number;
  total_file_size: number;
  byProject: CartAggregation[];
}

export interface CartSummary {
  data: CartSummaryData;
  status: DataStatus;
  error?: string;
  readonly requestId?: string;
}

const initialState: CartSummary = {
  data: {
    total_case_count: 0,
    total_doc_count: 0,
    total_file_size: 0,
    byProject: [],
  },
  status: "uninitialized",
};

const slice = createSlice({
  name: "cartSummary",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartSummary.fulfilled, (state, action) => {
        if (state.requestId != action.meta.requestId) return state;
        const response = action.payload;
        if (response.errors) {
          state.status = "rejected";
          return state;
        } else {
          const byProject: CartAggregation[] =
            response.data.viewer.cart_summary?.aggregations.project__project_id
              .buckets || [];

          state.data = {
            total_case_count: byProject
              .map((project) => project.case_count)
              .reduce((previous, current) => previous + current, 0),
            total_doc_count: byProject
              .map((project) => project.doc_count)
              .reduce((previous, current) => previous + current, 0),
            total_file_size: byProject
              .map((project) => project.file_size)
              .reduce((previous, current) => previous + current, 0),
            byProject,
          };
          state.status = "fulfilled";
          return state;
        }
      })
      .addCase(fetchCartSummary.pending, (state, action) => {
        state.status = "pending";
        state.requestId = action.meta.requestId;
      })
      .addCase(fetchCartSummary.rejected, (state, action) => {
        if (state.requestId != action.meta.requestId) return state;
        state.status = "rejected";
        return state;
      });
  },
});

export const cartSummaryReducer = slice.reducer;

export const selectCartSummaryData = (
  state: CoreState,
): CoreDataSelectorResponse<CartSummaryData> => {
  return {
    data: state.cart.cartSummary.data,
    status: state.cart.cartSummary.status,
  };
};

export const useCartSummary = createUseCoreDataHook(
  fetchCartSummary,
  selectCartSummaryData,
);
