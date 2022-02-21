import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CoreState } from "../../store";
import {
  GqlGreaterThan,  GqlIncludes,
  GqlOperation,
} from "../gdcapi/filters";

export interface EnumFilter {
  type: "enum";
  readonly field: string;
  readonly op: string;
  readonly values: string[];
}

export interface RangeFilter {
  type: "range";
  readonly field: string;
  readonly op: string;
  readonly from: number;
  readonly to: number;
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
  handleEnum: (op: EnumFilter) => T;
  handleRange: (op: RangeFilter) => T;
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
  handleEnum = (op: EnumFilter): GqlIncludes => ({
    op: "in",
    content: {
      field: op.field,
      value: op.values,
    },
  });
  handleRange = (op: RangeFilter): GqlGreaterThan => ({
    op: ">",
    content: {
      field: op.field,
      value: op.from,
    },
  });
}

export const convertFacetFilterToGqlFilter = (filter: CohortFilter): GqlOperation => {
  const handler: CohortFilterHandler<GqlOperation> = new CohortFilterToGqlOperationHandler();
  return handleGqlOperation(handler, filter);
};

const buildCohortGqlOperator = (fs: FilterSet | undefined): GqlOperation | undefined => {

  if (!fs)
    return undefined;
  switch (fs.mode) {
    case "and":
      return (
        (Object.keys(fs.root).length == 0) ? undefined :
        {
          op: "and", content: Object.keys(fs.root).map((k): GqlOperation => {
            const filter = {  ...fs.root[k], field: fs.root[k].field};
            return convertFacetFilterToGqlFilter(filter);
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
 * current cohort. Note that the GraphQL filtere require "cases." or "repository." prepended
 * to the filters. This will likely be deprecated once the REST API's are available.
 * @param state
 * @param prepend
 */
export const selectCurrentCohortGqlFilters = (state: CoreState): GqlOperation | undefined => {
  return buildCohortGqlOperator(state.cohort.currentFilters.currentFilters);
};

export const selectCurrentCohortCaseGqlFilters = (state: CoreState): GqlOperation | undefined => {
  return buildCohortGqlOperator(state.cohort.currentFilters.currentFilters);
};

export const selectCurrentCohortFiltersByName = (state: CoreState, name: string): CohortFilter | undefined =>
  state.cohort.currentFilters.currentFilters?.root[name];




