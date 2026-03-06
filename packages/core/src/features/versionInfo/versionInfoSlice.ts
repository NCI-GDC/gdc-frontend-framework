import { GDC_API } from "../../constants";
import { coreCreateApi } from "src/coreCreateApi";

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

export const fetchVersionInfo = async () => {
  const response = await fetchStatus();
  if (response.ok) {
    return { data: response.json() };
  }
  const error = await response.text();
  return { error };
};

const versionInfoApi = coreCreateApi({
  reducerPath: "versionInfo",
  baseQuery: fetchVersionInfo,
  endpoints: (builder) => ({
    getVersionInfo: builder.query<VersionInfoResponse, void>({
      query: () => {},
    }),
  }),
});

export const { useGetVersionInfoQuery } = versionInfoApi;
export const versionInfoReducer = versionInfoApi.reducer;
export const versionInfoMiddleware = versionInfoApi.middleware;
