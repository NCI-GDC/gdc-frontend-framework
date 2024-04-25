import type { Middleware, Reducer } from "@reduxjs/toolkit";
import { getGdcHistory } from "../gdcapi/gdcapi";
import { HistoryDefaults } from "../gdcapi/types";
import { coreCreateApi } from "src/coreCreateApi";

export const fetchHistory = async ({ uuid }: { uuid: string }) => {
  let results;

  try {
    results = await getGdcHistory(uuid);
  } catch (e) {
    return { error: e };
  }

  return { data: results };
};

const historyApiSlice = coreCreateApi({
  reducerPath: "history",
  baseQuery: fetchHistory,
  endpoints: (builder) => ({
    getHistory: builder.query<HistoryDefaults[], string>({
      query: (uuid) => ({
        uuid,
      }),
    }),
  }),
});

export const { useGetHistoryQuery } = historyApiSlice;
export const historyApiSliceMiddleware =
  historyApiSlice.middleware as Middleware;
export const historyApiSliceReducerPath: string = historyApiSlice.reducerPath;
export const historyApiReducer: Reducer = historyApiSlice.reducer as Reducer;
