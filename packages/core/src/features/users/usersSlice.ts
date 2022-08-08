import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GDC_AUTH } from "../../Api";
import {
  CoreDataSelectorResponse,
  createUseCoreDataHook,
  DataStatus,
} from "../../dataAccess";
import { CoreState } from "../../reducers";

export interface UserResponse {
  projects: {};
  username: string;
}
export const fetchUserDetails = createAsyncThunk<UserResponse>(
  "userInfo/fetchUserDetails",
  async () => {
    console.log("document.cookie: ", document.cookie);
    const response = await fetch(`${GDC_AUTH}user`, {
      credentials: "same-origin",
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": "true",
        "Content-Type": "application/json",
        "X-Auth-Token": "secret admin token",
      },
    });

    if (response.ok) {
      return response.json();
    }

    throw Error(await response.text());
  },
);

export interface userSliceInitialStateInterface {
  projects: {};
  username: string;
  status: DataStatus;
}
const userSliceInitialState: userSliceInitialStateInterface = {
  projects: {},
  username: "",
  status: "uninitialized",
};

const slice = createSlice({
  name: "userInfo",
  initialState: userSliceInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        const response = action.payload;
        console.log(response);

        // state.projects = {};
        state.status = "fulfilled";
        return state;
      })
      .addCase(fetchUserDetails.pending, (state) => {
        state.status = "pending";
        return state;
      })
      .addCase(fetchUserDetails.rejected, (state) => {
        state.status = "rejected";
        return state;
      });
  },
});

export const userDetailsReducer = slice.reducer;

export const selectUserDetailsInfo = (
  state: CoreState,
): CoreDataSelectorResponse<UserResponse> => ({
  data: {
    projects: state.userInfo.projects,
    username: state.userInfo.username,
  },
  status: state.userInfo.status,
});

export const useUserDetails = createUseCoreDataHook(
  fetchUserDetails,
  selectUserDetailsInfo,
);
