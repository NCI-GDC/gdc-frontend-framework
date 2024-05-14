import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { GDC_API } from "../../constants";
import {
  CoreDataSelectorResponse,
  createUseCoreDataHook,
  DataStatus,
} from "../../dataAccess";
import { CoreState } from "../../reducers";

export interface VersionInfoResponse {
  commit: string;
  data_release: string;
  tag: string;
  version: string;
}

export async function fetchStatus(): Promise<Response> {
  return await fetch(`${GDC_API}/status`, {
    credentials: "omit",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export const fetchVersionInfo = createAsyncThunk<VersionInfoResponse>(
  "versionInfo/fetchVersionInfo",
  async () => {
    const response = await fetchStatus();
    if (response.ok) {
      return response.json();
    }
    throw Error(await response.text());
  },
);

export interface versionInfoSliceInitialStateInterface {
  data?: VersionInfoResponse;
  status: DataStatus;
}

const versionInfoInitialState: versionInfoSliceInitialStateInterface = {
  status: "uninitialized",
};

export type VersionInfo = Omit<versionInfoSliceInitialStateInterface, "status">;

const slice = createSlice({
  name: "versionInfo",
  initialState: versionInfoInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVersionInfo.fulfilled, (state, action) => {
        const response = action.payload;
        state.data = { ...response };
        Cookies.set("gdc_api_version", response.data_release);
        state.status = "fulfilled";
        return state;
      })
      .addCase(fetchVersionInfo.pending, (state) => {
        state.status = "pending";
        return state;
      })
      .addCase(fetchVersionInfo.rejected, (state) => {
        state.status = "rejected";
        return state;
      });
  },
});

export const versionInfoReducer = slice.reducer;

export const selectVersionInfo = (
  state: CoreState,
): CoreDataSelectorResponse<VersionInfoResponse> => {
  return {
    data: state.versionInfo.data,
    status: state.versionInfo.status,
  };
};

export const useVersionInfoDetails = createUseCoreDataHook(
  fetchVersionInfo,
  selectVersionInfo,
);
