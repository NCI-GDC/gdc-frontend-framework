import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CoreDataSelectorResponse, createUseCoreDataHook, DataStatus } from "../../dataAcess";
import { CoreDispatch, CoreState } from "../../store";
import { castDraft } from "immer";
import { buildFetchError, GdcApiRequest } from "../gdcapi/gdcapi";

export interface SurvivalDonor {
  readonly time: number;
  readonly censored: boolean;
  readonly survivalEstimate: number;
  readonly id: string;
  readonly submitter_id: string;
  readonly project_id: string;
}

export interface SurvivalApiResponse {
  readonly results: ReadonlyArray<Survival>;
  readonly overallStats?: Record<string, never>;
  readonly warnings: Record<string, string>;
}



export interface Survival {
    readonly meta: string;
    readonly donors: ReadonlyArray<SurvivalDonor>;
}

export interface SurvivalState {
  readonly survival: ReadonlyArray<Survival>;
  readonly status: DataStatus;
  readonly error?: string;
}

const initialState: SurvivalState = {
  survival: [],
  status: "uninitialized",
};

export const fetchSurvivalAnalysis = async (
  request?: GdcApiRequest,
): Promise<SurvivalApiResponse> => {
  const res = await fetch(`https://api.gdc.cancer.gov/analysis/survival`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...request,
      fields: request?.fields?.join(","),
    }),
  });
  if (res.ok) {
    return res.json();
  }

  throw await buildFetchError(res, request);
};

export const fetchSurvival = createAsyncThunk <
  SurvivalApiResponse,
  GdcApiRequest,
  { dispatch: CoreDispatch; state: CoreState }
  >
(
  "analysis/survival",
  async (request?: GdcApiRequest) => {
    return fetchSurvivalAnalysis(request);
  },
);


const slice = createSlice({
  name: "analysis/survival",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSurvival.fulfilled, (state, action) => {
        const response = action.payload;

        if (response.warnings && Object.keys(response.warnings).length > 0) {
          state.status = "rejected";
          state.error = response.warnings.facets;
        } else {
          if (response.results) {
            state.survival = castDraft(response.results);
          } else {
            state.survival = [];
          }
          state.status = "fulfilled";
        }
      })
      .addCase(fetchSurvival.pending, (state) => {
        state.status = "pending";
        state.error = undefined;
      })
      .addCase(fetchSurvival.rejected, (state) => {
        state.status = "rejected";
        // TODO get error from action
        state.error = undefined;
      });
  },
});

export const survivalReducer = slice.reducer;

export const selectSurvivalState = (state: CoreState): SurvivalState =>
  state.survival;

export const selectSurvival = (state: CoreState): ReadonlyArray<Survival> => {
  return state.survival.survival;
};

export const selectSurvivalData = (
  state: CoreState,
): CoreDataSelectorResponse<ReadonlyArray<Survival>> => {
  return {
    data: state.survival.survival,
    status: state.survival.status,
    error: state.survival.error,
  };
};

export const useSurvivalPlot = createUseCoreDataHook(fetchSurvival, selectSurvivalData);
