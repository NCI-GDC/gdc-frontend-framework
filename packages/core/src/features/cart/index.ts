import { combineReducers } from "@reduxjs/toolkit";
import {
  selectCart,
  addFilesToCart,
  removeFilesFromCart,
  updateCartReducer,
  type CartFile,
} from "./updateCartSlice";
import {
  useCartSummaryQuery,
  type CartSummaryData,
  type CartAggregation,
} from "./cartSummarySlice";
export {
  selectCart,
  addFilesToCart,
  removeFilesFromCart,
  useCartSummaryQuery,
  CartSummaryData,
  CartAggregation,
  CartFile,
};

export const cartReducer = combineReducers({
  files: updateCartReducer,
});
