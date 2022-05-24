import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CoreDispatch, CoreState } from "../../store";
import { graphqlAPI, GraphQLApiResponse } from "../gdcapi/gdcgraphql";
import { selectCurrentCohortGqlFilters } from "../cohort/cohortFilterSlice";
import { convertFacetNameToGQL, FacetBuckets } from "./facetApiGQL";

import { RangeBuckets, processRangeResults } from "./continuousAggregationApi";

export interface NumericFromTo {
  readonly from: number;
  readonly to: number;
}

export interface RangeOperation {
  readonly op: "range";
  readonly ranges: ReadonlyArray<NumericFromTo>;
}

const buildContinuousAggregationRangeOnlyQuery = (
  field: string,
  itemType: string,
  index: string,
): string => {
  return `
  query ContinuousAggregationQuery($filters: FiltersArgument, $filters2: FiltersArgument) {
  viewer {
    ${index} {
      ${itemType} {
        aggregations(filters: $filters) {
          ${convertFacetNameToGQL(field)} {
           stats {
                Min : min
                Max: max
                Mean: avg
                SD: std_deviation
                count
            }
            range(ranges: $filters2) {
              buckets {
                doc_count
                key
              }
            }
          }
        }
      }
    }
  }
}
`;
};

export interface FetchContinuousAggregationProps {
  readonly field: string;
  readonly ranges: ReadonlyArray<NumericFromTo>;
  readonly itemType?: string;
  readonly index?: string;
}

export const fetchFacetContinuousAggregation = createAsyncThunk<
  GraphQLApiResponse<RangeBuckets>,
  FetchContinuousAggregationProps,
  { dispatch: CoreDispatch; state: CoreState }
>(
  "facet/fetchFacetContinuousAggregation",
  async (
    { field, ranges, itemType = "cases", index = "explore" },
    thunkAPI,
  ) => {
    const filters = selectCurrentCohortGqlFilters(thunkAPI.getState());
    const queryGQL = buildContinuousAggregationRangeOnlyQuery(
      field,
      itemType,
      index,
    );
    const filtersGQL = {
      filters: filters ? filters : {},
      filters2: { op: "range", content: [{ ranges: ranges }] },
    };

    return await graphqlAPI(queryGQL, filtersGQL);
  },
);

const initialState: Record<string, FacetBuckets> = {};

const rangeFacetAggregation = createSlice({
  name: "facet/rangeFacetAggregation",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFacetContinuousAggregation.fulfilled, (state, action) => {
        const response = action.payload;
        const index = action.meta.arg.index ?? "explore";
        const itemType = action.meta.arg.itemType ?? "cases";
        if (response.errors && Object.keys(response.errors).length > 0) {
          state[action.meta.arg.field].status = "rejected";
          state[action.meta.arg.field].error = response.errors.facets;
        } else {
          const aggregations =
            Object(response).data.viewer[index][itemType].aggregations;
          aggregations && processRangeResults(aggregations, state);
        }
      })
      .addCase(fetchFacetContinuousAggregation.pending, (state, action) => {
        const field = action.meta.arg.field;
        state[field] = {
          status: "pending",
        };
      })
      .addCase(fetchFacetContinuousAggregation.rejected, (state, action) => {
        const field = action.meta.arg.field;
        state[field] = {
          status: "rejected",
        };
      });
  },
});

export const rangeFacetsReducer = rangeFacetAggregation.reducer;

export const selectRangeFacets = (
  state: CoreState,
): Record<string, FacetBuckets> => state.facetsGQL.ranges;

export const selectRangeFacetByField = (
  state: CoreState,
  field: string,
): FacetBuckets => {
  const ranges = state.facetsGQL.ranges;
  return ranges[field];
};
