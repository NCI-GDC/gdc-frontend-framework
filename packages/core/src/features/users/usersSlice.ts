import { createAction, createSlice } from "@reduxjs/toolkit";
import { coreCreateApiWithoutUserAuthTag } from "src/coreCreateApi";
import { CoreState } from "src/store";
import { GDC_AUTH } from "../../constants";

export interface UserInfo {
  projects: {
    phs_ids: Record<string, Array<string>>;
    gdc_ids: Record<string, Array<string>>;
  };
  username: string;
}

export interface UserAuthResponse<D> {
  readonly data: D;
  readonly status: number;
}

export async function fetchAuth({
  endpoint,
  isJSON = false,
}: {
  endpoint: string;
  isJSON: boolean;
}) {
  const response = await fetch(`${GDC_AUTH}/${endpoint}`, {
    credentials: "same-origin",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    return {
      data: isJSON ? await response.json() : await response.text(),
      status: response.status,
    };
  }

  return {
    status: response.status,
    data: null,
  };
}

export const userAuthApi = coreCreateApiWithoutUserAuthTag({
  reducerPath: "userAuthApi",
  refetchOnFocus: true,
  refetchOnMountOrArgChange: 1800,
  baseQuery: async ({ endpoint, isJSON }) => {
    let results;

    try {
      results = await fetchAuth({ endpoint, isJSON });
    } catch (e) {
      /*
        Because an "error" response is valid for the auth requests we don't want to
        put the request in an error state or it will attempt the request over and over again
      */
      return { data: {} };
    }

    return { data: results };
  },
  endpoints: (builder) => ({
    fetchToken: builder.mutation<UserAuthResponse<string>, void>({
      query: () => ({ endpoint: "token/refresh" }),
    }),
    fetchUserDetails: builder.query<UserAuthResponse<UserInfo>, void>({
      query: () => ({ endpoint: "user", isJSON: true }),
    }),
  }),
});

export const userAuthChanged = createAction<{ username: string | null }>(
  "userAuth/changed",
);

export const getUsername = (
  response?: UserAuthResponse<UserInfo>,
): string | null | undefined =>
  response?.status === 401 ? null : response?.data?.username;

export interface UserAuthState {
  readonly lastKnownUsername?: string | null;
}

const initialState: UserAuthState = {};

const userAuthSlice = createSlice({
  name: "userAuth",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(userAuthApi.util.resetApiState, () => initialState)
      .addMatcher(
        userAuthApi.endpoints.fetchUserDetails.matchFulfilled,
        (state, action) => {
          const username = getUsername(action.payload);
          if (username !== undefined) state.lastKnownUsername = username;
        },
      ),
});

export const userAuthReducer = userAuthSlice.reducer;

export const selectLastKnownUsername = (
  state: CoreState,
): string | null | undefined => state.userAuth.lastKnownUsername;

export const {
  useFetchUserDetailsQuery,
  useFetchTokenMutation,
  useLazyFetchUserDetailsQuery,
} = userAuthApi;
export const userAuthApiMiddleware = userAuthApi.middleware;
export const userAuthApiReducerPath = userAuthApi.reducerPath;
export const userAuthApiReducer = userAuthApi.reducer;
