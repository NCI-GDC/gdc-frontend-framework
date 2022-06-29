import { combineReducers } from "@reduxjs/toolkit";
import {
  selectCart,
  addFilesToCart,
  removeFilesFromCart,
  updateCartReducer,
} from "./updateCartSlice";
import { cartSummaryReducer, useCartSummary } from "./cartSummarySlice";
import { filesTableReducer, useCartFilesTable } from "./filesTableSlice";
export {
  selectCart,
  addFilesToCart,
  removeFilesFromCart,
  useCartSummary,
  useCartFilesTable,
};

export const cartReducer = combineReducers({
  files: updateCartReducer,
  cartSummary: cartSummaryReducer,
  filesTable: filesTableReducer,
});
