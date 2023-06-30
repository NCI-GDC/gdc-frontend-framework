import { combineReducers } from "@reduxjs/toolkit";
import {
  selectCart,
  addFilesToCart,
  removeFilesFromCart,
  updateCartReducer,
  CartFile,
} from "./updateCartSlice";
import {
  cartSummaryReducer,
  useCartSummary,
  CartSummaryData,
  CartAggregation,
} from "./cartSummarySlice";
export {
  selectCart,
  addFilesToCart,
  removeFilesFromCart,
  useCartSummary,
  CartSummaryData,
  CartAggregation,
  CartFile,
};

export const cartReducer = combineReducers({
  files: updateCartReducer,
  cartSummary: cartSummaryReducer,
});
