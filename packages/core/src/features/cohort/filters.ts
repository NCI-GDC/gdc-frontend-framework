/* eslint-disable @typescript-eslint/no-unused-vars */
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

/**
 *  Operand types for filter operations
 */
export type EnumOperandValue = ReadonlyArray<string | number>;
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
  handleExcludes: (op: Excludes) => ReadonlyArray<string | number> = (
    op: Excludes,
  ) => op.operands;
  handleExcludeIfAny: (
    op: ExcludeIfAny,
  ) => string | ReadonlyArray<string | number> = (op: ExcludeIfAny) =>
    op.operands;
  handleIncludes: (op: Includes) => ReadonlyArray<string | number> = (
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
  handleExcludes: (_: Excludes) => ReadonlyArray<string | number> = (
    op: Excludes,
  ) => op.operands;
  handleExcludeIfAny: (_: ExcludeIfAny) => undefined = (_: ExcludeIfAny) =>
    undefined;
  handleIncludes: (_: Includes) => ReadonlyArray<string | number> = (
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

/**
 * Merged two FilterSets returning the merged pair.
 * @param a - first FilterSet
 * @param b - other FilterSet
 */
export const joinFilters = (a: FilterSet, b: FilterSet): FilterSet => {
  return { mode: a.mode, root: { ...a.root, ...b.root } };
};
