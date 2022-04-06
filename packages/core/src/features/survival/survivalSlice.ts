import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CoreDataSelectorResponse,
  createUseFiltersCoreDataHook,
  DataStatus,
} from "../../dataAcess";
import { CoreDispatch, CoreState } from "../../store";
import {
  selectCurrentCohortFilters,
  selectCurrentCohortFilterSet,
  buildCohortGqlOperator,
} from "../cohort/cohortFilterSlice";
import { GqlOperation} from "../gdcapi/filters";

export const MINIMUM_CASES = 10;
export const MAXIMUM_CURVES = 5;
export const DAYS_IN_YEAR = 365.25;

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

export interface Survival {
  readonly survivalData: ReadonlyArray<SurvivalElement>;
  readonly overallStats: Record<string, number>;
}

export interface SurvivalApiResponse {
  readonly results: ReadonlyArray<SurvivalElement>;
  readonly overallStats: Record<string, number>;
  readonly warnings: Record<string, string>;
}

export interface SurvivalState {
  readonly data: Survival;
  readonly status: DataStatus;
  readonly error?: string;
}

const initialState: SurvivalState = {
  data: {
    survivalData: [],
    overallStats: {}
  },
  status: "uninitialized",
};

/**
 *  Survival API Specialization of API Request and Errors
 */
export interface GdcSurvivalApiRequest {
  filters?: ReadonlyArray<GqlOperation>;
}

export interface SurvivalFetchError {
  readonly url: string;
  readonly status: number;
  readonly statusText: string;
  readonly text: string;
  readonly gdcSurvivalApiReq?: GdcSurvivalApiRequest;
}

export const buildSurvivalFetchError = async (
  res: Response,
  gdcSurvivalApiReq?: GdcSurvivalApiRequest,
): Promise<SurvivalFetchError> => {
  return {
    url: res.url,
    status: res.status,
    statusText: res.statusText,
    text: await res.text(),
    gdcSurvivalApiReq,
  };
}

export const fetchSurvivalAnalysis = async (
  request: GdcSurvivalApiRequest,
): Promise<SurvivalApiResponse> => {
  const parameters = request.filters ? `?filters=${encodeURIComponent(JSON.stringify(request.filters))}` : "";
  const res = await fetch(`https://api.gdc.cancer.gov/analysis/survival${parameters}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (res.ok) {
    return res.json();
  }

  throw await buildSurvivalFetchError(res, request);
};

/**
 * fetch Survival Plot data from the GDC Analytics API
 * The API will use the passed filters if defined
 * otherwise it will use the current cohort filters.
 */
export const fetchSurvival = createAsyncThunk <
  SurvivalApiResponse,
  { filters?: ReadonlyArray<GqlOperation> },
  { dispatch: CoreDispatch; state: CoreState }
  >
(
  "analysis/survivalData",
  async (args, thunkAPI) => {
   if (args?.filters) { // passing filter overrides using the cohort filters.
     return fetchSurvivalAnalysis({ filters: args?.filters });

   }
    // use the current cohort filters
    const cohort_filters = buildCohortGqlOperator(selectCurrentCohortFilterSet(thunkAPI.getState()));
    return fetchSurvivalAnalysis({  filters: cohort_filters ? [cohort_filters] : undefined });
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
            state.data.survivalData = response.results.map(r => ({
              ...r,
              donors: r.donors.map(d => ({
                ...d,
                time: d.time / DAYS_IN_YEAR, // convert days to years
              })),
            }))
            state.data.overallStats = response.overallStats;
          } else {
            state.data = {
              survivalData: [],
              overallStats: {}
            };
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

export const selectSurvival = (state: CoreState):Survival => {
  return state.survival.data;
};

export const selectSurvivalData = (
  state: CoreState,
): CoreDataSelectorResponse<Survival> => {
  return {
    data: state.survival.data,
    status: state.survival.status,
    error: state.survival.error,
  };
};

/**
 * Trying out a possible way to create a hook that
 * handles when the filters are updated
 */
export const useSurvivalPlot = createUseFiltersCoreDataHook(fetchSurvival, selectSurvivalData, selectCurrentCohortFilters);
