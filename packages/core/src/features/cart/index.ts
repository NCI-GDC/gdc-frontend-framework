import { combineReducers } from "@reduxjs/toolkit";
import {
  selectCart,
  addFilesToCart,
  removeFilesFromCart,
  updateCartReducer,
} from "./updateCartSlice";
import { cartSummaryReducer, useCartSummary } from "./cartSummarySlice";
export { selectCart, addFilesToCart, removeFilesFromCart, useCartSummary };

export const cartReducer = combineReducers({
  files: updateCartReducer,
  cartSummary: cartSummaryReducer,
});
