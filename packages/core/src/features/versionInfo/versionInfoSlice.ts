import { createSlice } from "@reduxjs/toolkit";
import { CoreState } from "../../reducers";
import { VERSIONINFO } from "./versionInfoFixture";

const initialState: any = VERSIONINFO;

const slice = createSlice({
  name: "versionInfo",
  initialState,
  reducers: {},
  extraReducers: {},
});

export const versionInfoReducer = slice.reducer;

export const selectVersionInfo: (state: CoreState) => any = (
  state: CoreState,
) => state.versionInfo;
