import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CoreState } from "../../store";

const initialState: string[] = [];

const slice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addFilesToCart: (state, action: PayloadAction<string[]>) => {
      state = [...state, ...action.payload];
      return state;
    },
    removeFilesFromCart: (state, action: PayloadAction<string[]>) => {
      state = state.filter((f) => !action.payload.includes(f));
      return state;
    },
  },
  extraReducers: {},
});

export const cartReducer = slice.reducer;
export const { addFilesToCart, removeFilesFromCart } = slice.actions;

export const selectCart = (state: CoreState): string[] => state.cart;
