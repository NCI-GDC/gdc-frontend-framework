import type { Middleware, Reducer } from "@reduxjs/toolkit";
import { DAYS_IN_YEAR } from "../../constants";
import { coreCreateApi } from "../../coreCreateApi";

export interface SurvivalDonor {
  readonly time: number;
  readonly censored: boolean;
  readonly survivalEstimate: number;
  readonly id: string;
  readonly submitter_id: string;
  readonly project_id: string;
}

export interface SurvivalElement {
  readonly meta: string;
  readonly donors: ReadonlyArray<SurvivalDonor>;
}

export interface SurvivalApiResponse {
  readonly results: ReadonlyArray<SurvivalElement>;
  readonly overallStats: Record<string, number>;
  readonly warnings: Record<string, string>;
}

export const survivalApiSlice = coreCreateApi({
  reducerPath: "survivalApi",
  baseQuery: async ({ request }) => {
    const res = await fetch(`https://api.gdc.cancer.gov/analysis/survival`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filters: JSON.stringify(request.filters),
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
      transformResponse: (response: SurvivalApiResponse) => {
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
