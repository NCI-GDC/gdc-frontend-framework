import { Cohort } from "../types";

export interface QueryExpressionHooks {
  useSelectCurrentCohort: () => Cohort;
  useClearCohortFilters: () => () => void;
  useRemoveCohortFilter: () => (field: string) => void;
  useUpdateCohortFilter: () => (field: string, operation: Operation) => void;
  useFieldNameToTitle: () => (field: string) => string;
  useFormatValue: () => (value: string, field: string) => Promise<string>;
}

export type Operation =
  | Equals
  | NotEquals
  | LessThan
  | LessThanOrEquals
  | GreaterThan
  | GreaterThanOrEquals
  | Exists
  | Missing
  | Includes
  | Excludes
  | ExcludeIfAny
  | Intersection
  | Union;

export interface Equals {
  readonly operator: "=";
  readonly field: string;
  readonly operand: string | number;
}

export interface NotEquals {
  readonly operator: "!=";
  readonly field: string;
  readonly operand: string | number;
}

export interface LessThan {
  readonly operator: "<";
  readonly field: string;
  readonly operand: string | number;
}

export interface LessThanOrEquals {
  readonly operator: "<=";
  readonly field: string;
  readonly operand: string | number;
}

export interface GreaterThan {
  readonly operator: ">";
  readonly field: string;
  readonly operand: string | number;
}

export interface GreaterThanOrEquals {
  readonly operator: ">=";
  readonly field: string;
  readonly operand: string | number;
}

export interface Missing {
  readonly operator: "missing";
  readonly field: string;
}

export interface Exists {
  readonly operator: "exists";
  readonly field: string;
}

export interface Includes {
  readonly operator: "includes";
  readonly field: string;
  readonly operands: ReadonlyArray<string | number>;
}

export interface Excludes {
  readonly operator: "excludes";
  readonly field: string;
  readonly operands: ReadonlyArray<string | number>;
}

export interface ExcludeIfAny {
  readonly operator: "excludeifany";
  readonly field: string;
  readonly operands: string | ReadonlyArray<string | number>;
}

export interface Intersection {
  readonly operator: "and";
  readonly operands: ReadonlyArray<Operation>;
}

export interface Union {
  readonly operator: "or";
  readonly operands: ReadonlyArray<Operation>;
}

export type UnionOrIntersection = Union | Intersection;

type OperandsType = Includes | Excludes | ExcludeIfAny | Intersection | Union;

export const isOperandsType = (
  operation: Operation,
): operation is OperandsType => {
  return (operation as OperandsType)?.operands !== undefined;
};

export interface OperationHandler<T> {
  handleEquals: (op: Equals, hooks: QueryExpressionHooks) => T;
  handleNotEquals: (op: NotEquals, hooks: QueryExpressionHooks) => T;
  handleLessThan: (op: LessThan, hooks: QueryExpressionHooks) => T;
  handleLessThanOrEquals: (
    op: LessThanOrEquals,
    hooks: QueryExpressionHooks,
  ) => T;
  handleGreaterThan: (op: GreaterThan, hooks: QueryExpressionHooks) => T;
  handleGreaterThanOrEquals: (
    op: GreaterThanOrEquals,
    hooks: QueryExpressionHooks,
  ) => T;
  handleMissing: (op: Missing, hooks: QueryExpressionHooks) => T;
  handleExists: (op: Exists, hooks: QueryExpressionHooks) => T;
  handleIncludes: (op: Includes, hooks: QueryExpressionHooks) => T;
  handleExcludes: (op: Excludes, hooks: QueryExpressionHooks) => T;
  handleExcludeIfAny: (op: ExcludeIfAny, hooks: QueryExpressionHooks) => T;
  handleIntersection: (op: Intersection, hooks: QueryExpressionHooks) => T;
  handleUnion: (op: Union, hooks: QueryExpressionHooks) => T;
}

export const handleOperation = <T>(
  handler: OperationHandler<T>,
  op: Operation,
  hooks: QueryExpressionHooks,
): T => {
  switch (op.operator) {
    case "=":
      return handler.handleEquals(op, hooks);
    case "!=":
      return handler.handleNotEquals(op, hooks);
    case "<":
      return handler.handleLessThan(op, hooks);
    case "<=":
      return handler.handleLessThanOrEquals(op, hooks);
    case ">":
      return handler.handleGreaterThan(op, hooks);
    case ">=":
      return handler.handleGreaterThanOrEquals(op, hooks);
    case "missing":
      return handler.handleMissing(op, hooks);
    case "exists":
      return handler.handleExists(op, hooks);
    case "includes":
      return handler.handleIncludes(op, hooks);
    case "excludes":
      return handler.handleExcludes(op, hooks);
    case "excludeifany":
      return handler.handleExcludeIfAny(op, hooks);
    case "and":
      return handler.handleIntersection(op, hooks);
    case "or":
      return handler.handleUnion(op, hooks);
    default:
      return assertNever(op);
  }
};

const assertNever = (x: never): never => {
  throw Error(`Exhaustive comparison did not handle: ${x}`);
};

export interface NumericFromTo {
  readonly from: number;
  readonly to: number;
}

export type EnumOperandValue = ReadonlyArray<string | number>;
export type RangeOperandValue = string | number;
export type SetOperandValue = ReadonlyArray<Operation>;
export type OperandValue =
  | EnumOperandValue
  | RangeOperandValue
  | SetOperandValue
  | undefined;
