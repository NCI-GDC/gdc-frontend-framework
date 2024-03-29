import { coreCreateApi } from "src/coreCreateApi";
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
      "Access-Control-Allow-Origin": "true",
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

const userAuthApi = coreCreateApi({
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
    fetchToken: builder.query<UserAuthResponse<string>, void>({
      query: () => ({ endpoint: "token/refresh" }),
    }),
    fetchUserDetails: builder.query<UserAuthResponse<UserInfo>, void>({
      query: () => ({ endpoint: "user", isJSON: true }),
    }),
  }),
});

export const {
  useFetchUserDetailsQuery,
  useLazyFetchTokenQuery,
  useLazyFetchUserDetailsQuery,
} = userAuthApi;
export const userAuthApiMiddleware = userAuthApi.middleware;
export const userAuthApiReducerPath = userAuthApi.reducerPath;
export const userAuthApiReducer = userAuthApi.reducer;
