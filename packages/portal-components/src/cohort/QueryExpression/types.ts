import { Cohort } from "../types";

export interface QueryExpressionHooks {
  useSelectCurrentCohort: () => Cohort;
  useClearCohortFilters: () => () => void;
  useRemoveCohortFilter: () => (field: string) => void;
  useUpdateCohortFilter: () => ({
    field,
    operation,
  }: {
    field: string;
    operation: any;
  }) => void;
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
  readonly hooks: QueryExpressionHooks;
}

export interface NotEquals {
  readonly operator: "!=";
  readonly field: string;
  readonly operand: string | number;
  readonly hooks: QueryExpressionHooks;
}

export interface LessThan {
  readonly operator: "<";
  readonly field: string;
  readonly operand: string | number;
  readonly hooks: QueryExpressionHooks;
}

export interface LessThanOrEquals {
  readonly operator: "<=";
  readonly field: string;
  readonly operand: string | number;
  readonly hooks: QueryExpressionHooks;
}

export interface GreaterThan {
  readonly operator: ">";
  readonly field: string;
  readonly operand: string | number;
  readonly hooks: QueryExpressionHooks;
}

export interface GreaterThanOrEquals {
  readonly operator: ">=";
  readonly field: string;
  readonly operand: string | number;
  readonly hooks: QueryExpressionHooks;
}

export interface Missing {
  readonly operator: "missing";
  readonly field: string;
  readonly hooks: QueryExpressionHooks;
}

export interface Exists {
  readonly operator: "exists";
  readonly field: string;
  readonly hooks: QueryExpressionHooks;
}

export interface Includes {
  readonly operator: "includes";
  readonly field: string;
  readonly operands: ReadonlyArray<string | number>;
  readonly hooks: QueryExpressionHooks;
}

export interface Excludes {
  readonly operator: "excludes";
  readonly field: string;
  readonly operands: ReadonlyArray<string | number>;
  readonly hooks: QueryExpressionHooks;
}

export interface ExcludeIfAny {
  readonly operator: "excludeifany";
  readonly field: string;
  readonly operands: string | ReadonlyArray<string | number>;
  readonly hooks: QueryExpressionHooks;
}

export interface Intersection {
  readonly operator: "and";
  readonly operands: ReadonlyArray<Operation>;
  readonly hooks: QueryExpressionHooks;
}

export interface Union {
  readonly operator: "or";
  readonly operands: ReadonlyArray<Operation>;
  readonly hooks: QueryExpressionHooks;
}

export type UnionOrIntersection = Union | Intersection;

type OperandsType = Includes | Excludes | ExcludeIfAny | Intersection | Union;

export const isOperandsType = (
  operation: Operation,
): operation is OperandsType => {
  return (operation as OperandsType)?.operands !== undefined;
};

export interface OperationHandler<T> {
  handleEquals: (op: Equals) => T;
  handleNotEquals: (op: NotEquals) => T;
  handleLessThan: (op: LessThan) => T;
  handleLessThanOrEquals: (op: LessThanOrEquals) => T;
  handleGreaterThan: (op: GreaterThan) => T;
  handleGreaterThanOrEquals: (op: GreaterThanOrEquals) => T;
  handleMissing: (op: Missing) => T;
  handleExists: (op: Exists) => T;
  handleIncludes: (op: Includes) => T;
  handleExcludes: (op: Excludes) => T;
  handleExcludeIfAny: (op: ExcludeIfAny) => T;
  handleIntersection: (op: Intersection) => T;
  handleUnion: (op: Union) => T;
}

export const handleOperation = <T>(
  handler: OperationHandler<T>,
  op: Operation,
  hooks: QueryExpressionHooks,
): T => {
  switch (op.operator) {
    case "=":
      return handler.handleEquals({ ...op, hooks });
    case "!=":
      return handler.handleNotEquals({ ...op, hooks });
    case "<":
      return handler.handleLessThan({ ...op, hooks });
    case "<=":
      return handler.handleLessThanOrEquals({ ...op, hooks });
    case ">":
      return handler.handleGreaterThan({ ...op, hooks });
    case ">=":
      return handler.handleGreaterThanOrEquals({ ...op, hooks });
    case "missing":
      return handler.handleMissing({ ...op, hooks });
    case "exists":
      return handler.handleExists({ ...op, hooks });
    case "includes":
      return handler.handleIncludes({ ...op, hooks });
    case "excludes":
      return handler.handleExcludes({ ...op, hooks });
    case "excludeifany":
      return handler.handleExcludeIfAny({ ...op, hooks });
    case "and":
      return handler.handleIntersection({ ...op, hooks });
    case "or":
      return handler.handleUnion({ ...op, hooks });
    default:
      return assertNever(op);
  }
};

const assertNever = (x: never): never => {
  throw Error(`Exhaustive comparison did not handle: ${x}`);
};
