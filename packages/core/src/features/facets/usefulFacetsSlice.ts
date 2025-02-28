import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GraphQLFetchError } from "../gdcapi/gdcgraphql";
import { FacetDefinition, FacetBuckets } from "./types";
import { CoreDispatch } from "../../store";
import { CoreState } from "../../reducers";
import {
  CoreDataSelectorResponse,
  createUseCoreDataHook,
  DataStatus,
} from "../../dataAccess";
import { isBucketsAggregation, isStatsAggregation } from "../gdcapi/utils";
import { GdcApiResponse } from "../gdcapi/types";
import { selectFacetDefinition } from "./facetDictionarySlice";
import { GDC_APP_API_AUTH } from "../../constants";
export type FacetDefinitionType = "cases" | "files";

const buildFacetListByType = (
  facetType: FacetDefinitionType,
  facets?: Record<string, FacetDefinition>,
) => {
  return facets
    ? Object.keys(facets)
        .filter((x) => x.startsWith(facetType))
        .map((fn) => facets[fn].field)
        .join()
    : "";
};

const buildGraphMappingFetchError = async (
  res: Response,
): Promise<GraphQLFetchError> => {
  return {
    url: res.url,
    status: res.status,
    statusText: res.statusText,
    text: await res.text(),
  };
};

export const fetchFacetsWithValues = createAsyncThunk<
  GdcApiResponse<FacetBuckets>,
  FacetDefinitionType,
  { dispatch: CoreDispatch; state: CoreState }
>("facet/fetchFacetsWithValues", async (filterType, thunkAPI) => {
  const body = {
    size: "0",
    pretty: "false",
    facets: buildFacetListByType(
      filterType,
      selectFacetDefinition(thunkAPI.getState()).data,
    ),
  };

  const res = await fetch(`${GDC_APP_API_AUTH}/${filterType}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(body),
  });

  if (res.ok) return res.json();

  throw await buildGraphMappingFetchError(res);
});

export interface UsefulFacetsState {
  readonly status: Record<FacetDefinitionType, DataStatus>;
  readonly error?: string;
  readonly entries: Record<FacetDefinitionType, ReadonlyArray<string>>;
}

const initialState: UsefulFacetsState = {
  status: {
    cases: "uninitialized",
    files: "uninitialized",
  },
  entries: {
    cases: [],
    files: [],
  },
};

const usefulFacets = createSlice({
  name: "facet/fetchUsefulFacets",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFacetsWithValues.fulfilled, (state, action) => {
        // process results and update entries if one has appropriate values
        const aggregations = action.payload.data.aggregations;

        const withValues = aggregations
          ? Object.entries(aggregations)
              .filter(([, aggregation]) => {
                if (isBucketsAggregation(aggregation)) {
                  return (
                    aggregation.buckets.filter(
                      (bucket: { key: string; doc_count: number }) =>
                        bucket.key !== "_missing",
                    ).length > 0
                  );
                }
                if (isStatsAggregation(aggregation)) {
                  return aggregation.stats.count > 0;
                }
                return false;
              })
              .map(([field]) => field)
          : [];

        state.entries[action.meta.arg] = withValues;
        state.status[action.meta.arg] = "fulfilled";
      })
      .addCase(fetchFacetsWithValues.pending, (state, action) => {
        state.status[action.meta.arg] = "pending";
      })
      .addCase(fetchFacetsWithValues.rejected, (state, action) => {
        state.status[action.meta.arg] = "rejected";
        state.entries[action.meta.arg] = [];
        state.error = "Fetching facets with values failed. Results are 0";
      });
  },
});

export const usefulFacetsReducer = usefulFacets.reducer;

export const selectUsefulFacets = (
  state: CoreState,
  filterType: FacetDefinitionType,
): CoreDataSelectorResponse<ReadonlyArray<string>> => {
  return {
    data: state.facetsGQL.usefulFacets.entries[filterType],
    status: state.facetsGQL.usefulFacets.status[filterType],
    error: state.facetsGQL.usefulFacets.error,
  };
};

export const selectUsefulCaseFacets = (
  state: CoreState,
): CoreDataSelectorResponse<ReadonlyArray<string>> => {
  return {
    data: state.facetsGQL.usefulFacets.entries["cases"],
    status: state.facetsGQL.usefulFacets.status["cases"],
    error: state.facetsGQL.usefulFacets.error,
  };
};

export const selectUsefulFileFacets = (
  state: CoreState,
): CoreDataSelectorResponse<ReadonlyArray<string>> => {
  return {
    data: state.facetsGQL.usefulFacets.entries["files"],
    status: state.facetsGQL.usefulFacets.status["files"],
    error: state.facetsGQL.usefulFacets.error,
  };
};

export const useUsefulCaseFacets = createUseCoreDataHook(
  fetchFacetsWithValues,
  selectUsefulCaseFacets,
);

export const useUsefulFilesFacets = createUseCoreDataHook(
  fetchFacetsWithValues,
  selectUsefulFileFacets,
);
