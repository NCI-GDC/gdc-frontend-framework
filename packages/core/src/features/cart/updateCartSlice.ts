import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { castDraft } from "immer";
import { CoreState } from "../../reducers";
import { GdcFile } from "../files/filesSlice";

export type CartFile = Pick<
  GdcFile,
  | "access"
  | "acl"
  | "file_id"
  | "file_size"
  | "state"
  | "project_id"
  | "file_name"
>;

const initialState: CartFile[] = [];

const slice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addFilesToCart: (state, action: PayloadAction<CartFile[]>) => {
      state = castDraft([...new Set([...state, ...action.payload])]);
      return state;
    },
    removeFilesFromCart: (state, action: PayloadAction<string[]>) => {
      state = state.filter((f) => !action.payload.includes(f.file_id));
      return state;
    },
  },
});

export const updateCartReducer = slice.reducer;
export const { addFilesToCart, removeFilesFromCart } = slice.actions;

export const selectCart = (state: CoreState): CartFile[] => state.cart.files;
