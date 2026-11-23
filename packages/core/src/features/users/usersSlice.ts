import { createAction, createSelector } from "@reduxjs/toolkit";
import { isEqual } from "lodash";
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

const userAuthApi = coreCreateApiWithoutUserAuthTag({
  reducerPath: "userAuthApi",
  refetchOnFocus: true,
  refetchOnMountOrArgChange: 1800,
  baseQuery: async ({ endpoint, isJSON }) => {
    try {
      const result = await fetchAuth({ endpoint, isJSON });
      // a 401 just means not logged in and any other error status is a real failure
      if (result.status >= 400 && result.status !== 401)
        return { error: { status: result.status } };
      return { data: result };
    } catch (error) {
      return { error: { status: "FETCH_ERROR", error: String(error) } };
    }
  },
  endpoints: (builder) => ({
    fetchToken: builder.query<UserAuthResponse<string>, void>({
      query: () => ({ endpoint: "token/refresh" }),
    }),
    fetchUserDetails: builder.query<UserAuthResponse<UserInfo>, void>({
      query: () => ({ endpoint: "user", isJSON: true }),
    }),
  }),
});

export const userAuthChanged = createAction("userAuth/changed");

export interface UserAuth {
  readonly username: string | null;
  readonly projects: UserInfo["projects"] | null;
}

const selectUserDetails = userAuthApi.endpoints.fetchUserDetails.select();

// null until /auth/user has answered
export const selectUserAuth = createSelector(
  (state: CoreState) => selectUserDetails(state).data,
  (response): UserAuth | null => {
    if (response === undefined) return null;
    if (response.status === 401) return { username: null, projects: null };
    return {
      username: response.data.username,
      projects: response.data.projects,
    };
  },
);

// before is null until /auth/user first answers, and that answer isn't a login or logout
export const isUserAuthChange = (
  before: UserAuth | null,
  after: UserAuth | null,
): boolean => before !== null && !isEqual(before, after);

export const {
  useFetchUserDetailsQuery,
  useLazyFetchTokenQuery,
  useLazyFetchUserDetailsQuery,
} = userAuthApi;
export const userAuthApiMiddleware = userAuthApi.middleware;
export const userAuthApiReducerPath = userAuthApi.reducerPath;
export const userAuthApiReducer = userAuthApi.reducer;
