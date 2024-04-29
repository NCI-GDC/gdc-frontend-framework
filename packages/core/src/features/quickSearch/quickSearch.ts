import type { Middleware, Reducer } from "@reduxjs/toolkit";
import { coreCreateApi } from "src/coreCreateApi";
import { GDC_APP_API_AUTH } from "../../constants";
import serializeQueryArgsWithDataRelease from "src/serializeQueryArgs";

interface QuickSearchState {
  searchList: Array<Record<string, any>>;
  query: string;
}

export const fetchQuickSearch = async (searchString: string) => {
  const response = await fetch(
    `${GDC_APP_API_AUTH}/quick_search?query=${searchString}&size=5`,
  );
  if (response.ok) {
    return { data: await response.json() };
  }

  return { error: Error(await response.text()) };
};

const quickSearchApi = coreCreateApi({
  reducerPath: "quickSearch",
  serializeQueryArgs: serializeQueryArgsWithDataRelease,
  baseQuery: fetchQuickSearch,
  endpoints: (builder) => ({
    quickSearch: builder.query<QuickSearchState, string>({
      query: (searchString) => searchString,
      transformResponse: (response, _, arg) => ({
        searchList: response?.data?.query?.hits,
        query: arg,
      }),
    }),
  }),
});

export const { useQuickSearchQuery } = quickSearchApi;
export const quickSearchApiMiddleware = quickSearchApi.middleware as Middleware;
export const quickSearchApiReducerPath: string = quickSearchApi.reducerPath;
export const quickSearchApiReducer: Reducer = quickSearchApi.reducer as Reducer;
