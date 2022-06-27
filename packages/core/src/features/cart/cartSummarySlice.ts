import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CoreDataSelectorResponse,
  createUseCoreDataHook,
  DataStatus,
} from "../../dataAccess";
import { CoreDispatch } from "../../store";
import { CoreState } from "../../reducers";
import { GraphQLApiResponse, graphqlAPI } from "../gdcapi/gdcgraphql";
import { selectCart } from "./updateCartSlice";

const graphQLQuery = ` 
  query CartSummary(
    $fileFilters: FiltersArgument
  ) {
    cart_summary {
      explore { 
        aggregations(filters: $fileFilters) {
          project__project_id {
            buckets {
              case_count
              doc_count
              file_size
              key
            }
          }
          fs {
            value
          }
        }
      }
    }
  }
`;

export const fetchCartSummary = createAsyncThunk<
  GraphQLApiResponse,
  {},
  { dispatch: CoreDispatch; state: CoreState }
>("cart/cartSummary", async ({}, thunkAPI) => {
  await console.log("HI3");
  const fileIds = selectCart(thunkAPI.getState());

  const graphQLFilters = {
    filterFilters: {
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

export interface CartSummary {
  data: any[];
  status: DataStatus;
}

const initialState: CartSummary = {
  data: ["HI"],
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
): CoreDataSelectorResponse<any[]> => {
  return {
    data: state.cart.cartSummary.data,
    status: state.cart.cartSummary.status,
  };
};

export const useCartSummary = createUseCoreDataHook(
  fetchCartSummary,
  selectCartSummaryData,
);
