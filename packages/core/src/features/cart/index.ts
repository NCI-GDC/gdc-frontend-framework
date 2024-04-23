import { combineReducers } from "@reduxjs/toolkit";
import {
  selectCart,
  addFilesToCart,
  removeFilesFromCart,
  updateCartReducer,
  CartFile,
} from "./updateCartSlice";
import {
  useCartSummaryQuery,
  CartSummaryData,
  CartAggregation,
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
