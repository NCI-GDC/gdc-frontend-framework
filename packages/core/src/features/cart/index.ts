import { combineReducers } from "@reduxjs/toolkit";
import {
  selectCart,
  addFilesToCart,
  removeFilesFromCart,
  updateCartReducer,
} from "./updateCartSlice";
import {
  cartSummaryReducer,
  useCartSummary,
  CartSummaryData,
} from "./cartSummarySlice";
export {
  selectCart,
  addFilesToCart,
  removeFilesFromCart,
  useCartSummary,
  CartSummaryData,
};

export const cartReducer = combineReducers({
  files: updateCartReducer,
  cartSummary: cartSummaryReducer,
});
