import { createSlice } from "@reduxjs/toolkit";
import { CoreState } from "../../reducers";
import { VERSIONINFO } from "./versionInfoFixture";

const initialState: any = VERSIONINFO;

// TODO: fecth actual data from API, discard fixture data

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
