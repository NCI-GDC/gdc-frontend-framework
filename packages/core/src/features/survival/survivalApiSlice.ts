import type { Middleware, Reducer } from "@reduxjs/toolkit";
import { DAYS_IN_YEAR, GDC_APP_API_AUTH } from "../../constants";
import { coreCreateApi } from "../../coreCreateApi";

interface SurvivalDonor {
  readonly time: number;
  readonly censored: boolean;
  readonly survivalEstimate: number;
  readonly id: string;
  readonly submitter_id: string;
  readonly project_id: string;
}

export interface SurvivalElement {
  readonly meta: Record<string, number>;
  readonly donors: ReadonlyArray<SurvivalDonor>;
}

interface SurvivalApiResponse {
  readonly results: ReadonlyArray<SurvivalElement>;
  readonly overallStats: Record<string, number>;
  readonly warnings: Record<string, string>;
}

export interface Survival {
  readonly survivalData: ReadonlyArray<SurvivalElement>;
  readonly overallStats: Record<string, number>;
}

export const survivalApiSlice = coreCreateApi({
  reducerPath: "survivalApi",
  baseQuery: async ({ request }) => {
    const res = await fetch(`${GDC_APP_API_AUTH}/analysis/survival`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        case_filter: request.case_filter,
        filters: request.filters,
      }),
    });
    if (res.ok) {
      return { data: await res.json() };
    }

    return { error: { status: res.status, data: await res.text() } };
  },
  endpoints: (builder) => ({
    getSurvivalPlot: builder.query({
      query: (request) => ({
        request,
      }),
      transformResponse: (response: SurvivalApiResponse): Survival => {
        return {
          survivalData: (response?.results || []).map((r) => ({
            ...r,
            donors: r.donors.map((d) => ({
              ...d,
              time: d.time / DAYS_IN_YEAR, // convert days to years
            })),
          })),
          overallStats: response?.overallStats || {},
        };
      },
    }),
  }),
});

export const { useGetSurvivalPlotQuery } = survivalApiSlice;

export const survivalApiSliceMiddleware =
  survivalApiSlice.middleware as Middleware;
export const survivalApiSliceReducerPath: string = survivalApiSlice.reducerPath;
export const survivalApiReducer: Reducer = survivalApiSlice.reducer as Reducer;
