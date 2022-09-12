import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GDC_AUTH } from "../../constants";
import {
  CoreDataSelectorResponse,
  createUseCoreDataHook,
  DataStatus,
} from "../../dataAccess";
import { CoreState } from "../../reducers";

export interface UserResponse {
  projects: {
    phs_ids: Record<string, Array<string>>;
    gdc_ids: Record<string, Array<string>>;
  };
  username: string;
}

export async function fetchAuth({
  endpoint,
}: {
  endpoint: string;
}): Promise<Response> {
  return await fetch(`${GDC_AUTH}/${endpoint}`, {
    credentials: "same-origin",
    method: "GET",
    headers: {
      "Access-Control-Allow-Origin": "true",
      "Content-Type": "application/json",
    },
  });
}

export const fetchUserDetails = createAsyncThunk<UserResponse>(
  "userInfo/fetchUserDetails",
  async () => {
    const response = await fetchAuth({ endpoint: "user" });

    if (response.ok) {
      return response.json();
    }

    throw Error(await response.text());
  },
);

export const fetchToken = async (): Promise<{
  text: string | null;
  status: number;
}> => {
  const response = await fetchAuth({ endpoint: "token/refresh" });

  if (response.ok) {
    return {
      text: await response.text(),
      status: response.status,
    };
  }

  if (response.status === 401) {
    return {
      status: response.status,
      text: null,
    };
  }

  throw Error(await response.text());
};

export interface userSliceInitialStateInterface {
  projects: {
    phs_ids: Record<string, Array<string>>;
    gdc_ids: Record<string, Array<string>>;
  };
  username: string | null;
  status: DataStatus;
}
const userSliceInitialState: userSliceInitialStateInterface = {
  projects: {
    phs_ids: {},
    gdc_ids: {},
  },
  username: null,
  status: "uninitialized",
};

export type UserInfo = Omit<userSliceInitialStateInterface, "status">;

const slice = createSlice({
  name: "userInfo",
  initialState: userSliceInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        const response = action.payload;

        state.projects = { ...response.projects };
        state.username = response.username;
        state.status = "fulfilled";
        return state;
      })
      .addCase(fetchUserDetails.pending, (state) => {
        state.projects = {
          phs_ids: {},
          gdc_ids: {},
        };
        state.username = null;
        state.status = "pending";
        return state;
      })
      .addCase(fetchUserDetails.rejected, (state) => {
        state.projects = {
          phs_ids: {},
          gdc_ids: {},
        };
        state.username = null;
        state.status = "rejected";
        return state;
      });
  },
});

export const userDetailsReducer = slice.reducer;

export const selectUserDetailsInfo = (
  state: CoreState,
): CoreDataSelectorResponse<UserInfo> => ({
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
