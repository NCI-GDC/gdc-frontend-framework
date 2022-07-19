import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GraphQLFetchError } from "../gdcapi/gdcgraphql";
import { FacetDefinition } from "./types";
import { CoreDispatch } from "../../store";
import { CoreState } from "../../reducers";
import {
  CoreDataSelectorResponse,
  createUseCoreDataHook,
  DataStatus,
} from "../../dataAccess";
import { processDictionaryEntries } from "./facetDictionaryApi";
import { isBucketsAggregation, isStatsAggregation } from "../gdcapi/gdcapi";
export type FacetDefinitionType = "cases" | "files";

const buildFacetListByType = (
  facetType: FacetDefinitionType,
  facets: Record<string, FacetDefinition>,
) => {
  return facets
    ? Object.keys(facets)
        .filter((x) => x.startsWith(facetType))
        .map((fn) => facets[fn].field)
    : [];
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

export const fetchFacetDictionary = createAsyncThunk<
  Record<string, FacetDefinition>,
  void,
  { dispatch: CoreDispatch; state: CoreState }
>("facet/fetchFacetDictionary", async () => {
  const res = await fetch("https://api.gdc.cancer.gov/v0/gql/_mapping", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "GET",
  });

  if (res.ok) return res.json();

  throw await buildGraphMappingFetchError(res);
});

interface FetchUsefulFacetsParams {
  readonly filterType: FacetDefinitionType;
  readonly facets: Record<string, FacetDefinition>;
}

export const fetchFacetsWithValues = createAsyncThunk<
  Record<string, unknown>,
  FetchUsefulFacetsParams,
  { dispatch: CoreDispatch; state: CoreState }
>("facet/fetchFacetsWithValues", async ({ filterType, facets }) => {
  const body = {
    size: "0",
    pretty: "false",
    facets: buildFacetListByType(filterType, facets),
  };
  const res = await fetch(`https://api.gdc.cancer.gov/${filterType}`, {
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

export interface FacetDefinitionState {
  readonly status: DataStatus;
  readonly usefulStatus: Record<FacetDefinitionType, DataStatus>;
  readonly error?: string;
  readonly entries: Record<string, FacetDefinition>;
}

const initialState: FacetDefinitionState = {
  status: "uninitialized",
  usefulStatus: {
    cases: "uninitialized",
    files: "uninitialized",
  },
  entries: {},
};

const facetDictionary = createSlice({
  name: "facet/fetchFacetDictionary",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFacetDictionary.fulfilled, (state, action) => {
        const response = action.payload;
        if (response.errors && Object.keys(response.errors).length > 0)
          return {
            entries: {},
            status: "rejected",
            usefulStatus: state.usefulStatus,
          };

        return {
          status: "fulfilled",
          entries: processDictionaryEntries(response),
          usefulStatus: state.usefulStatus,
        };
      })
      .addCase(fetchFacetDictionary.pending, (state) => {
        return {
          entries: {},
          status: "pending",
          usefulStatus: state.usefulStatus,
        };
      })
      .addCase(fetchFacetDictionary.rejected, (state) => {
        return {
          entries: {},
          status: "rejected",
          usefulStatus: state.usefulStatus,
        };
      })
      .addCase(fetchFacetsWithValues.fulfilled, (state, action) => {
        // process results and update entries if one has appropriate values
        const aggregations = action.payload.data.aggregations;

        const withValues = Object.entries(aggregations).filter(
          ([field, aggregation]) => {
            if (isBucketsAggregation(aggregation)) {
              if (
                aggregation.buckets.filter(
                  (bucket: { key: string; doc_count: number }) =>
                    bucket.key !== "_missing",
                ).length > 0
              )
                return field;
            }
            if (isStatsAggregation(aggregation)) {
              if (aggregation.stats.count > 0) return field;
            }
            return null;
          },
        );

        console.log("withValues:", withValues);

        return {
          ...state,
          [action.meta.arg.filterType]: "fulfilled",
        };
      })
      .addCase(fetchFacetsWithValues.pending, (state, action) => {
        return {
          ...state,
          [action.meta.arg.filterType]: "pending",
        };
      })
      .addCase(fetchFacetsWithValues.rejected, (state, action) => {
        return {
          ...state,
          [action.meta.arg.filterType]: "rejected",
        };
      });
  },
});

export const facetDictionaryReducer = facetDictionary.reducer;

export const selectFacetDefinition = (
  state: CoreState,
): CoreDataSelectorResponse<Record<string, FacetDefinition>> => {
  return {
    data: state.facetsGQL.dictionary.entries,
    status: state.facetsGQL.dictionary.status,
    error: state.facetsGQL.dictionary.error,
  };
};

export const selectUsefulFacets = (
  state: CoreState,
  filterType: FacetDefinitionType,
): CoreDataSelectorResponse<Record<string, FacetDefinition>> => {
  return {
    data: state.facetsGQL.dictionary.entries,
    status: state.facetsGQL.dictionary.usefulStatus[filterType],
    error: state.facetsGQL.dictionary.error,
  };
};

export const selectUsefulCaseFacets = (
  state: CoreState,
): CoreDataSelectorResponse<Record<string, FacetDefinition>> => {
  return {
    data: state.facetsGQL.dictionary.entries,
    status: state.facetsGQL.dictionary.usefulStatus["cases"],
    error: state.facetsGQL.dictionary.error,
  };
};

export const selectUsefulFileFacets = (
  state: CoreState,
): CoreDataSelectorResponse<Record<string, FacetDefinition>> => {
  return {
    data: state.facetsGQL.dictionary.entries,
    status: state.facetsGQL.dictionary.usefulStatus["files"],
    error: state.facetsGQL.dictionary.error,
  };
};

export const selectFacetDefinitionByName = (
  state: CoreState,
  field: string,
): FacetDefinition => {
  return state.facetsGQL.dictionary.entries?.[field];
};

export const useFacetDictionary = createUseCoreDataHook(
  fetchFacetDictionary,
  selectFacetDefinition,
);

export const useUsefulCaseFacets = createUseCoreDataHook(
  fetchFacetsWithValues,
  selectUsefulCaseFacets,
);

export const useUsefulFilesFacets = createUseCoreDataHook(
  fetchFacetsWithValues,
  selectUsefulFileFacets,
);
