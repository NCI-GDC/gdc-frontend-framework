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
  fetchCartSummary,
} from "./cartSummarySlice";
export {
  selectCart,
  addFilesToCart,
  removeFilesFromCart,
  useCartSummary,
  fetchCartSummary,
};

export const cartReducer = combineReducers({
  files: updateCartReducer,
  cartSummary: cartSummaryReducer,
});
