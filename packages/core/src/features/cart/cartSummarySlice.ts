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
>("cart/cartSummary", async (fileIds) => {
  if (fileIds.length === 0) {
    Promise.resolve();
  }
  const graphQLFilters = {
    fileFilters: {
      op: "and",
      content: [
        {
          op: "in",
          content: {
            field: "files.file_id",
            value: fileIds,
          },
        },
      ],
    },
  };
  return await graphqlAPI(graphQLQuery, graphQLFilters);
});

interface CartSummaryData {
  case_count: number;
  doc_count: number;
  file_size: number;
}

export interface CartSummary {
  data: CartSummaryData;
  status: DataStatus;
}

const initialState: CartSummary = {
  data: {
    case_count: 0,
    doc_count: 0,
    file_size: 0,
  },
  status: "uninitialized",
};

const slice = createSlice({
  name: "cartSummary",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCartSummary.fulfilled, (state, action) => {
      const response = action.payload;
      console.log(response);
      const aggregations =
        response.data.viewer.cart_summary.aggregations.project__project_id
          .buckets[0];
      state.data = {
        case_count: aggregations?.case_count || 0,
        doc_count: aggregations?.doc_count || 0,
        file_size: aggregations?.file_size || 0,
      };
      state.status = "fulfilled";

      if (response.errors) {
        state.status = "rejected";
      }
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
