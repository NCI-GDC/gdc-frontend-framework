/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CoreState } from "../../reducers";
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

/**
 * Root filter set. Similar to how case filters are
 * manages: as an Object where the key is the field name
 * and the value is the Filter Operation
 *
 * @member root - root Objects of all of the filters
 * @member mode: Root level set operation for the filters
 */
export interface FilterSet {
  readonly root: Record<string, Operation>;
  readonly mode: string;
}

export interface CohortFilterState {
  readonly filters: FilterSet;
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
  handleEquals: (op: Equals) => string | number = (op: Equals) => op.operand;
  handleNotEquals: (op: NotEquals) => string | number = (op: NotEquals) =>
    op.operand;
  handleExcludes: (op: Excludes) => readonly string[] | readonly number[] = (
    op: Excludes,
  ) => op.operands;
  handleExcludeIfAny: (
    op: ExcludeIfAny,
  ) => string | readonly string[] | readonly number[] = (op: ExcludeIfAny) =>
    op.operands;
  handleIncludes: (op: Includes) => readonly string[] | readonly number[] = (
    op: Includes,
  ) => op.operands;
  handleGreaterThanOrEquals: (op: GreaterThanOrEquals) => string | number = (
    op: GreaterThanOrEquals,
  ) => op.operand;
  handleGreaterThan: (op: GreaterThan) => string | number = (op: GreaterThan) =>
    op.operand;
  handleLessThan: (op: LessThan) => string | number = (op: LessThan) =>
    op.operand;
  handleLessThanOrEquals: (op: LessThanOrEquals) => string | number = (
    op: LessThanOrEquals,
  ) => op.operand;
  handleMissing: (op: Missing) => undefined = (_: Missing) => undefined;
  handleExists: (op: Exists) => undefined = (_: Exists) => undefined;
  handleIntersection: (op: Intersection) => undefined = (_: Intersection) =>
    undefined;
  handleUnion: (op: Union) => undefined = (_: Union) => undefined;
}

/**
 * Extract the operand values, if operands themselves have values,  otherwise undefined.
 */
export class EnumValueExtractorHandler
  implements OperationHandler<EnumOperandValue | undefined>
{
  handleEquals: (_: Equals) => undefined = (_: Equals) => undefined;
  handleNotEquals: (_: NotEquals) => undefined = (_: NotEquals) => undefined;
  handleExcludes: (_: Excludes) => readonly string[] | readonly number[] = (
    op: Excludes,
  ) => op.operands;
  handleExcludeIfAny: (_: ExcludeIfAny) => undefined = (_: ExcludeIfAny) =>
    undefined;
  handleIncludes: (_: Includes) => readonly string[] | readonly number[] = (
    op: Includes,
  ) => op.operands;
  handleGreaterThanOrEquals: (_: GreaterThanOrEquals) => undefined = (
    _: GreaterThanOrEquals,
  ) => undefined;
  handleGreaterThan: (_: GreaterThan) => undefined = (_: GreaterThan) =>
    undefined;
  handleLessThan: (_: LessThan) => undefined = (_: LessThan) => undefined;
  handleLessThanOrEquals: (_: LessThanOrEquals) => undefined = (
    _: LessThanOrEquals,
  ) => undefined;
  handleMissing: (_: Missing) => undefined = (_: Missing) => undefined;
  handleExists: (_: Exists) => undefined = (_: Exists) => undefined;
  handleIntersection: (_: Intersection) => undefined = (_: Intersection) =>
    undefined;
  handleUnion: (_: Union) => undefined = (_: Union) => undefined;
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

export const selectCurrentCohortFilterOrCaseSet = (
  state: CoreState,
): FilterSet => {
  if (Object.keys(state.cohort.caseSet.caseSetId.root).length != 0) {
    return state.cohort.caseSet.caseSetId;
  } else return state.cohort.currentFilters.filters;
};

export const selectCurrentCohortFiltersByName = (
  state: CoreState,
  name: string,
): Operation | undefined => state.cohort.currentFilters.filters?.root[name];

export const joinFilters = (a: FilterSet, b: FilterSet): FilterSet => {
  return { mode: a.mode, root: { ...a.root, ...b.root } };
};
