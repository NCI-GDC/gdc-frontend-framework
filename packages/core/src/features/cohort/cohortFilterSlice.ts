import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CoreState } from "../../store";
import {
  Operation,
  GqlOperation,
  convertFilterToGqlFilter,
  OperationHandler,
  Equals,
  GreaterThanOrEquals,
  GreaterThan,
  LessThan,
  LessThanOrEquals,
  Excludes,
  Includes,
  Exists,
  Missing,
  NotEquals,
  Intersection,
  Union

} from "../gdcapi/filters";

export interface FilterSet {
  readonly root: Record<string, Operation>;
  readonly mode: string;
}

export interface CohortFilterState {
  readonly currentFilters: FilterSet;  // TODO: should be array of FilterSets
}

const initialState: CohortFilterState = { currentFilters: { mode: "and", root: {} } };

const slice = createSlice({
  name: "cohort/filters",
  initialState,
  reducers: {
    updateCohortFilter: (state, action: PayloadAction<{  field:string, operation:Operation }>) => {
       return {
         ...state,
         currentFilters: {
        mode: "and",
        root: { ...state.currentFilters.root, [action.payload.field]: action.payload.operation },
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

export type OperandValue = ReadonlyArray<string> | ReadonlyArray<number> | string | number | string[] | number [] | undefined;

export class ValueExtractorHandler implements OperationHandler<OperandValue> {
  handleEquals = (op: Equals) => op.operand;
  handleNotEquals = (op: NotEquals) => op.operand;
  handleExcludes = (op: Excludes) => op.operands;
  handleIncludes = (op: Includes) => op.operands;
  handleGreaterThanOrEquals = (op: GreaterThanOrEquals) => op.operand;
  handleGreaterThan = (op: GreaterThan) => op.operand;
  handleLessThan = (op: LessThan) => op.operand;
  handleLessThanOrEquals = (op: LessThanOrEquals) => op.operand;
  handleMissing = (_: Missing) => undefined;
  handleExists= (_: Exists) => undefined;
  handleIntersection= (_: Intersection) => undefined;
  handleUnion= (_: Union) => undefined;
}


export const buildCohortGqlOperator = (fs: FilterSet | undefined): GqlOperation | undefined => {

  if (!fs)
    return undefined;
  switch (fs.mode) {
    case "and":
      return (
        (Object.keys(fs.root).length == 0) ? undefined :
        { // TODO: this need a redesign root is not always a top level "op"
          //  but can also be an array of Operators
          op: "and", content: Object.keys(fs.root).map((k): GqlOperation => {
           // const filter = {  ...fs.root[k], field: fs.root[k].field};
            return convertFilterToGqlFilter( fs.root[k]);
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

export const selectCurrentCohortFiltersByName = (state: CoreState, name: string): Operation | undefined =>
  state.cohort.currentFilters.currentFilters?.root[name];




