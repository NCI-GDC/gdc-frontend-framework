/* eslint-disable @typescript-eslint/no-unused-vars */
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
  ExcludeIfAny,
  Includes,
  Exists,
  Missing,
  NotEquals,
  Intersection,
  Union,
} from "../gdcapi/filters";

export interface FilterSet {
  readonly root: Record<string, Operation>; // TODO: Replace with Union or Intersection Operation
  readonly mode: string;
}

export interface CohortFilterState {
  readonly filters: FilterSet; // TODO: should be array of FilterSets?
}

const initialState: CohortFilterState = { filters: { mode: "and", root: {} } };

const slice = createSlice({
  name: "cohort/filters",
  initialState,
  reducers: {
    updateCohortFilter: (
      state,
      action: PayloadAction<{ field: string; operation: Operation }>,
    ) => {
      return {
        ...state,
        filters: {
          mode: "and",
          root: {
            ...state.filters.root,
            [action.payload.field]: action.payload.operation,
          },
        },
      };
    },
    removeCohortFilter: (state, action: PayloadAction<string>) => {
      const { [action.payload]: _, ...updated } = state.filters.root;
      return {
        ...state,
        filters: {
          mode: "and",
          root: updated,
        },
      };
    },
    clearCohortFilters: (state) => {
      state.filters = { mode: "and", root: {} };
    },
  },
  extraReducers: {},
});

/**
 *  Operand types for filter operations
 */
export type EnumOperandValue = ReadonlyArray<string> | ReadonlyArray<number>;
export type RangeOperandValue = string | number;
export type SetOperandValue = ReadonlyArray<Operation>;
export type OperandValue =
  | EnumOperandValue
  | RangeOperandValue
  | SetOperandValue
  | undefined;

/**
 * Extract the operand values, if operands themselves have values,  otherwise undefined.
 */
export class ValueExtractorHandler implements OperationHandler<OperandValue> {
  handleEquals = (op: Equals) => op.operand;
  handleNotEquals = (op: NotEquals) => op.operand;
  handleExcludes = (op: Excludes) => op.operands;
  handleExcludeIfAny = (op: ExcludeIfAny) => op.operands;
  handleIncludes = (op: Includes) => op.operands;
  handleGreaterThanOrEquals = (op: GreaterThanOrEquals) => op.operand;
  handleGreaterThan = (op: GreaterThan) => op.operand;
  handleLessThan = (op: LessThan) => op.operand;
  handleLessThanOrEquals = (op: LessThanOrEquals) => op.operand;
  handleMissing = (_: Missing) => undefined;
  handleExists = (_: Exists) => undefined;
  handleIntersection = (_: Intersection) => undefined;
  handleUnion = (_: Union) => undefined;
}

/**
 * Extract the operand values, if operands themselves have values,  otherwise undefined.
 */
export class EnumValueExtractorHandler
  implements OperationHandler<EnumOperandValue | undefined>
{
  handleEquals = (_: Equals) => undefined;
  handleNotEquals = (_: NotEquals) => undefined;
  handleExcludes = (op: Excludes) => op.operands;
  handleExcludeIfAny = (_: ExcludeIfAny) => undefined;
  handleIncludes = (op: Includes) => op.operands;
  handleGreaterThanOrEquals = (_: GreaterThanOrEquals) => undefined;
  handleGreaterThan = (_: GreaterThan) => undefined;
  handleLessThan = (_: LessThan) => undefined;
  handleLessThanOrEquals = (_: LessThanOrEquals) => undefined;
  handleMissing = (_: Missing) => undefined;
  handleExists = (_: Exists) => undefined;
  handleIntersection = (_: Intersection) => undefined;
  handleUnion = (_: Union) => undefined;
}

export const buildCohortGqlOperator = (
  fs: FilterSet | undefined,
): GqlOperation | undefined => {
  if (!fs) return undefined;
  switch (fs.mode) {
    case "and":
      return Object.keys(fs.root).length == 0
        ? undefined
        : {
            // TODO: Replace fixed AND with cohort top level operation like Union or Intersection
            op: fs.mode,
            content: Object.keys(fs.root).map((k): GqlOperation => {
              return convertFilterToGqlFilter(fs.root[k]);
            }),
          };
  }
  return undefined;
};

export const cohortFilterReducer = slice.reducer;
export const { updateCohortFilter, removeCohortFilter, clearCohortFilters } =
  slice.actions;

export const selectCurrentCohortFilters = (
  state: CoreState,
): FilterSet | undefined => state.cohort.currentFilters.filters;

/**
 * selectCurrentCohortGqlFilters: returns an object representing the filters in the
 * current cohort.
 * @param state
 */
export const selectCurrentCohortGqlFilters = (
  state: CoreState,
): GqlOperation | undefined => {
  return buildCohortGqlOperator(state.cohort.currentFilters.filters);
};

export const selectCurrentCohortFilterSet = (
  state: CoreState,
): FilterSet | undefined => {
  return state.cohort.currentFilters.filters;
};

export const selectCurrentCohortCaseGqlFilters = (
  state: CoreState,
): GqlOperation | undefined => {
  return buildCohortGqlOperator(state.cohort.currentFilters.filters);
};

export const selectCurrentCohortFiltersByName = (
  state: CoreState,
  name: string,
): Operation | undefined => state.cohort.currentFilters.filters?.root[name];

export const joinFilters = (a: FilterSet, b: FilterSet): FilterSet => {
  return { mode: a.mode, root: { ...a.root, ...b.root } };
};
