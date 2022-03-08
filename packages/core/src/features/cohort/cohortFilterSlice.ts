import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CoreState } from "../../store";
import {
  Operation,
  GqlOperation,
  convertFilterToGqlFilter,
} from "../gdcapi/filters";



export interface CohortFilterOperation  {
  readonly field: string;
  readonly operation: Operation;
}

export interface EnumFilter extends  CohortFilterOperation{
  type: "enum";
}

export interface RangeFilter extends  CohortFilterOperation  {
  type: "range";
}


export type CohortFilter = EnumFilter | RangeFilter;

export interface FilterSet {
  readonly root: Record<string, CohortFilter>;
  readonly mode: string;
}

export interface CohortFilterState {
  readonly currentFilters: FilterSet;
}

const initialState: CohortFilterState = { currentFilters: { mode: "and", root: {} } };

const slice = createSlice({
  name: "cohort/filters",
  initialState,
  reducers: {
    updateCohortFilter: (state, action: PayloadAction<CohortFilter>) => {
       return {
         ...state,
         currentFilters: {
        mode: "and",
        root: { ...state.currentFilters.root, [action.payload.field]: action.payload },
      }};
    },
    removeCohortFilter: (state, action: PayloadAction<string>)  => {
      const { [action.payload]: _, ...updated} = state.currentFilters.root;
      return {
        ...state,
        currentFilters: {
          mode: "and",
          root: updated,
        }};
    },
    clearCohortFilters: (state) => {
      state.currentFilters = { mode: "and", root: {} };
    },
  },
  extraReducers: {},
});


export interface CohortFilterHandler<T> {
  handleEnum: (filter: EnumFilter) => T;
  handleRange: (filter: RangeFilter) => T;
}

const assertNever = (x: never): never => {
  throw Error(`Exhaustive comparison did not handle: ${x}`);
};

export const handleGqlOperation = <T>(
  handler: CohortFilterHandler<T>,
  filter: CohortFilter,
): T => {
  switch (filter.type) {
    case "enum":
      return handler.handleEnum(filter);
    case "range":
      return handler.handleRange(filter);
    default:
      return assertNever(filter);
  }
};

class CohortFilterToGqlOperationHandler implements CohortFilterHandler<GqlOperation> {
  handleEnum = (filter: EnumFilter): GqlOperation  => convertFilterToGqlFilter(filter.operation);
  handleRange = (filter: RangeFilter): GqlOperation => convertFilterToGqlFilter(filter.operation);
}

export const convertFacetFilterToGqlFilter = (filter: CohortFilter): GqlOperation => {
  const handler: CohortFilterHandler<GqlOperation> = new CohortFilterToGqlOperationHandler();
  return handleGqlOperation(handler, filter);
};


export const buildCohortGqlOperator = (fs: FilterSet | undefined): GqlOperation | undefined => {

  if (!fs)
    return undefined;
  switch (fs.mode) {
    case "and":
      return (
        (Object.keys(fs.root).length == 0) ? undefined :
        {
          op: "and", content: Object.keys(fs.root).map((k): GqlOperation => {
            const filter = {  ...fs.root[k], field: fs.root[k].field};
            return convertFilterToGqlFilter(filter.operation);
          }),
        }
      );
  }
  return undefined;
};

export const cohortFilterReducer = slice.reducer;
export const { updateCohortFilter, removeCohortFilter, clearCohortFilters } = slice.actions;

export const selectCurrentCohortFilters = (state: CoreState): FilterSet | undefined =>
  state.cohort.currentFilters.currentFilters;


/**
 * selectCurrentCohortGqlFilters: returns an object representing the filters in the
 * current cohort. Note that the GraphQL filters require "cases." etc. prepended
 * to the filters.
 * @param state
 * @param prepend
 */
export const selectCurrentCohortGqlFilters = (state: CoreState): GqlOperation | undefined => {
  return buildCohortGqlOperator(state.cohort.currentFilters.currentFilters);
};

export const selectCurrentCohortFilterSet = (state: CoreState): FilterSet | undefined => {
  return state.cohort.currentFilters.currentFilters;
};

export const selectCurrentCohortCaseGqlFilters = (state: CoreState): GqlOperation | undefined => {
  return buildCohortGqlOperator(state.cohort.currentFilters.currentFilters);
};

export const selectCurrentCohortFiltersByName = (state: CoreState, name: string): CohortFilter | undefined =>
  state.cohort.currentFilters.currentFilters?.root[name];




