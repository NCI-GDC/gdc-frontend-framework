import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CoreDispatch } from "../../store";
import { CoreState } from "../../reducers";
import {
  fetchGdcCases,
  fetchGdcFiles,
  GdcApiResponse,
  isBucketsAggregation,
} from "../gdcapi/gdcapi";
import { FacetDefinitionType } from "./usefulFacetsSlice";
import { GqlOperation } from "../gdcapi/filters";
import {
  CoreDataSelectorResponse,
  createUseCoreDataHook,
  DataStatus,
} from "../../dataAccess";

/**
 *
 * @param facetName - Name of the facet
 * @param filterType - Either "files" or "cases"
 * @param filters - any filters associated with the call
 */
export const fetchFacetByNameTypeAndFilter = createAsyncThunk<
  GdcApiResponse<unknown>,
  {
    facetName: string;
    filterType: FacetDefinitionType;
    filters: GqlOperation | undefined;
  },
  { dispatch: CoreDispatch; state: CoreState }
>(
  "facet/fetchFacetByNameTypeFilter",
  async ({ facetName, filterType, filters }) => {
    if (filterType === "files") {
      return await fetchGdcFiles({
        size: 0,
        ...(filters ? { filters: filters } : {}),
        facets: [facetName],
      });
    }
    return await fetchGdcCases({
      size: 0,
      ...(filters ? { filters: filters } : {}),
      facets: [facetName],
    });
  },
);

export interface FacetsByNameTypeFilterState {
  readonly status: Record<FacetDefinitionType, DataStatus>;
  entries: {
    readonly cases: Record<string, Record<string, number>>;
    readonly files: Record<string, Record<string, number>>;
  };
}

const initialState: FacetsByNameTypeFilterState = {
  status: {
    cases: "uninitialized",
    files: "uninitialized",
  },
  entries: {
    cases: {},
    files: {},
  },
};

const slice = createSlice({
  name: "facets",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFacetByNameTypeAndFilter.fulfilled, (state, action) => {
        const response = action.payload;

        if (response.warnings && Object.keys(response.warnings).length > 0) {
          state.status[action.meta.arg.filterType] = "rejected";
        } else {
          state.status[action.meta.arg.filterType] = "fulfilled";
          response.data.aggregations &&
            Object.entries(response.data.aggregations).forEach(
              ([field, aggregation]) => {
                if (isBucketsAggregation(aggregation)) {
                  state.entries[action.meta.arg.filterType][field] =
                    aggregation.buckets.reduce((facetBuckets, apiBucket) => {
                      facetBuckets[apiBucket.key] = apiBucket.doc_count;
                      return facetBuckets;
                    }, {} as Record<string, number>);
                }
              },
            );
        }
      })
      .addCase(fetchFacetByNameTypeAndFilter.pending, (state, action) => {
        state.status[action.meta.arg.filterType] = "pending";
      })
      .addCase(fetchFacetByNameTypeAndFilter.rejected, (state, action) => {
        state.status[action.meta.arg.filterType] = "rejected";
      });
  },
});

export const facetsByNameTypeAndFilterReducer = slice.reducer;

export const selectCasesFacetsByNameFilter = (
  state: CoreState,
): CoreDataSelectorResponse<Record<string, Record<string, number>>> => {
  return {
    data: state.facetsByNameTypeFilter.entries["cases"],
    status: state.facetsByNameTypeFilter.status["cases"],
  };
};

export const selectFilesFacetsByNameFilter = (
  state: CoreState,
): CoreDataSelectorResponse<Record<string, Record<string, number>>> => {
  return {
    data: state.facetsByNameTypeFilter.entries["files"],
    status: state.facetsByNameTypeFilter.status["files"],
  };
};

export const useFilesFacetsByNameFilter = createUseCoreDataHook(
  fetchFacetByNameTypeAndFilter,
  selectFilesFacetsByNameFilter,
);

export const useCasesFacetsByNameFilter = createUseCoreDataHook(
  fetchFacetByNameTypeAndFilter,
  selectCasesFacetsByNameFilter,
);
