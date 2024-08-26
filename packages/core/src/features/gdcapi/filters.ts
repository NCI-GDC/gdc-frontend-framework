/*
 * @packageDocumentation
 * This file contains the types and functions for working with filters.
 */

/**
 * GDC API Filter as a union of all possible filters
 * @category Filters
 */

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
): T => {
  switch (op.operator) {
    case "=":
      return handler.handleEquals(op);
    case "!=":
      return handler.handleNotEquals(op);
    case "<":
      return handler.handleLessThan(op);
    case "<=":
      return handler.handleLessThanOrEquals(op);
    case ">":
      return handler.handleGreaterThan(op);
    case ">=":
      return handler.handleGreaterThanOrEquals(op);
    case "missing":
      return handler.handleMissing(op);
    case "exists":
      return handler.handleExists(op);
    case "includes":
      return handler.handleIncludes(op);
    case "excludes":
      return handler.handleExcludes(op);
    case "excludeifany":
      return handler.handleExcludeIfAny(op);
    case "and":
      return handler.handleIntersection(op);
    case "or":
      return handler.handleUnion(op);
    default:
      return assertNever(op);
  }
};

const assertNever = (x: never): never => {
  throw Error(`Exhaustive comparison did not handle: ${x}`);
};

export type GqlOperation =
  | GqlEquals
  | GqlNotEquals
  | GqlLessThan
  | GqlLessThanOrEquals
  | GqlGreaterThan
  | GqlGreaterThanOrEquals
  | GqlMissing
  | GqlExists
  | GqlIncludes
  | GqlExcludes
  | GqlExcludeIfAny
  | GqlIntersection
  | GqlUnion;

export interface GqlEquals {
  readonly op: "=";
  readonly content: {
    readonly field: string;
    readonly value: string | number;
  };
}

export interface GqlNotEquals {
  readonly op: "!=";
  readonly content: {
    readonly field: string;
    readonly value: string | number;
  };
}

export interface GqlLessThan {
  readonly op: "<";
  readonly content: {
    readonly field: string;
    readonly value: string | number;
  };
}

export interface GqlLessThanOrEquals {
  readonly op: "<=";
  readonly content: {
    readonly field: string;
    readonly value: string | number;
  };
}

export interface GqlGreaterThan {
  readonly op: ">";
  readonly content: {
    readonly field: string;
    readonly value: string | number;
  };
}

export interface GqlGreaterThanOrEquals {
  readonly op: ">=";
  readonly content: {
    readonly field: string;
    readonly value: string | number;
  };
}

export interface GqlMissing {
  readonly op: "is";
  readonly content: {
    readonly field: string;
    readonly value: "MISSING";
  };
}

export interface GqlExists {
  readonly op: "not";
  readonly content: {
    readonly field: string;
    readonly value?: string;
  };
}

export interface GqlIncludes {
  readonly op: "in";
  readonly content: {
    readonly field: string;
    readonly value: ReadonlyArray<string | number>;
  };
}

export interface GqlExcludes {
  readonly op: "exclude";
  readonly content: {
    readonly field: string;
    readonly value: ReadonlyArray<string | number>;
  };
}

export interface GqlExcludeIfAny {
  readonly op: "excludeifany";
  readonly content: {
    readonly field: string;
    readonly value: string | ReadonlyArray<string | number>;
  };
}

export interface GqlIntersection {
  readonly op: "and";
  readonly content: ReadonlyArray<GqlOperation>;
  readonly isLoggedIn?: boolean;
}

export interface GqlUnion {
  readonly op: "or";
  readonly content: ReadonlyArray<GqlOperation>;
  readonly isLoggedIn?: boolean;
}

export interface NumericFromTo {
  readonly from: number;
  readonly to: number;
}

export interface GqlRange {
  readonly op: "range";
  readonly content: ReadonlyArray<{ ranges: NumericFromTo[] }>;
}

export interface GqlOperationHandler<T> {
  handleEquals: (op: GqlEquals) => T;
  handleNotEquals: (op: GqlNotEquals) => T;
  handleLessThan: (op: GqlLessThan) => T;
  handleLessThanOrEquals: (op: GqlLessThanOrEquals) => T;
  handleGreaterThan: (op: GqlGreaterThan) => T;
  handleGreaterThanOrEquals: (op: GqlGreaterThanOrEquals) => T;
  handleMissing: (op: GqlMissing) => T;
  handleExists: (op: GqlExists) => T;
  handleIncludes: (op: GqlIncludes) => T;
  handleExcludes: (op: GqlExcludes) => T;
  handleExcludeIfAny: (op: GqlExcludeIfAny) => T;
  handleIntersection: (op: GqlIntersection) => T;
  handleUnion: (op: GqlUnion) => T;
}

export const handleGqlOperation = <T>(
  handler: GqlOperationHandler<T>,
  op: GqlOperation,
): T => {
  switch (op.op) {
    case "=":
      return handler.handleEquals(op);
    case "!=":
      return handler.handleNotEquals(op);
    case "<":
      return handler.handleLessThan(op);
    case "<=":
      return handler.handleLessThanOrEquals(op);
    case ">":
      return handler.handleGreaterThan(op);
    case ">=":
      return handler.handleGreaterThanOrEquals(op);
    case "is":
      return handler.handleMissing(op);
    case "not":
      return handler.handleExists(op);
    case "in":
      return handler.handleIncludes(op);
    case "exclude":
      return handler.handleExcludes(op);
    case "excludeifany":
      return handler.handleExcludeIfAny(op);
    case "and":
      return handler.handleIntersection(op);
    case "or":
      return handler.handleUnion(op);
    default:
      return assertNever(op);
  }
};

export class ToGqlOperationHandler implements OperationHandler<GqlOperation> {
  handleEquals = (op: Equals): GqlEquals => ({
    op: "=",
    content: {
      field: op.field,
      value: op.operand,
    },
  });
  handleNotEquals = (op: NotEquals): GqlNotEquals => ({
    op: "!=",
    content: {
      field: op.field,
      value: op.operand,
    },
  });
  handleLessThan = (op: LessThan): GqlLessThan => ({
    op: "<",
    content: {
      field: op.field,
      value: op.operand,
    },
  });
  handleLessThanOrEquals = (op: LessThanOrEquals): GqlLessThanOrEquals => ({
    op: "<=",
    content: {
      field: op.field,
      value: op.operand,
    },
  });
  handleGreaterThan = (op: GreaterThan): GqlGreaterThan => ({
    op: ">",
    content: {
      field: op.field,
      value: op.operand,
    },
  });
  handleGreaterThanOrEquals = (
    op: GreaterThanOrEquals,
  ): GqlGreaterThanOrEquals => ({
    op: ">=",
    content: {
      field: op.field,
      value: op.operand,
    },
  });
  handleMissing = (op: Missing): GqlMissing => ({
    op: "is",
    content: {
      field: op.field,
      value: "MISSING",
    },
  });
  handleExists = (op: Exists): GqlExists => ({
    op: "not",
    content: {
      field: op.field,
    },
  });
  handleIncludes = (op: Includes): GqlIncludes => ({
    op: "in",
    content: {
      field: op.field,
      value: op.operands,
    },
  });
  handleExcludes = (op: Excludes): GqlExcludes => ({
    op: "exclude",
    content: {
      field: op.field,
      value: op.operands,
    },
  });
  handleExcludeIfAny = (op: ExcludeIfAny): GqlExcludeIfAny => ({
    op: "excludeifany",
    content: {
      field: op.field,
      value: op.operands,
    },
  });
  handleIntersection = (op: Intersection): GqlIntersection => ({
    op: "and",
    content: op.operands.map(convertFilterToGqlFilter),
  });
  handleUnion = (op: Union): GqlUnion => ({
    op: "or",
    content: op.operands.map(convertFilterToGqlFilter),
  });
}

export const convertFilterToGqlFilter = (filter: Operation): GqlOperation => {
  const handler: OperationHandler<GqlOperation> = new ToGqlOperationHandler();
  return handleOperation(handler, filter);
};

class ToOperationHandler implements GqlOperationHandler<Operation> {
  handleEquals = (op: GqlEquals): Equals => ({
    operator: "=",
    field: op.content.field,
    operand: op.content.value,
  });
  handleNotEquals = (op: GqlNotEquals): NotEquals => ({
    operator: "!=",
    field: op.content.field,
    operand: op.content.value,
  });
  handleLessThan = (op: GqlLessThan): LessThan => ({
    operator: "<",
    field: op.content.field,
    operand: op.content.value,
  });
  handleLessThanOrEquals = (op: GqlLessThanOrEquals): LessThanOrEquals => ({
    operator: "<=",
    field: op.content.field,
    operand: op.content.value,
  });
  handleGreaterThan = (op: GqlGreaterThan): GreaterThan => ({
    operator: ">",
    field: op.content.field,
    operand: op.content.value,
  });
  handleGreaterThanOrEquals = (
    op: GqlGreaterThanOrEquals,
  ): GreaterThanOrEquals => ({
    operator: ">=",
    field: op.content.field,
    operand: op.content.value,
  });
  handleMissing = (op: GqlMissing): Missing => ({
    operator: "missing",
    field: op.content.field,
  });
  handleExists = (op: GqlExists): Exists => ({
    operator: "exists",
    field: op.content.field,
  });
  handleIncludes = (op: GqlIncludes): Includes => ({
    operator: "includes",
    field: op.content.field,
    operands: op.content.value,
  });
  handleExcludes = (op: GqlExcludes): Excludes => ({
    operator: "excludes",
    field: op.content.field,
    operands: op.content.value,
  });
  handleExcludeIfAny = (op: GqlExcludeIfAny): ExcludeIfAny => ({
    operator: "excludeifany",
    field: op.content.field,
    operands: op.content.value,
  });
  handleIntersection = (op: GqlIntersection): Intersection => ({
    operator: "and",
    operands: op.content.map(convertGqlFilterToFilter),
  });
  handleUnion = (op: GqlUnion): Union => ({
    operator: "or",
    operands: op.content.map(convertGqlFilterToFilter),
  });
}

export const convertGqlFilterToFilter = (
  gqlFilter: GqlOperation,
): Operation => {
  const handler: GqlOperationHandler<Operation> = new ToOperationHandler();
  return handleGqlOperation(handler, gqlFilter);
};

/**
 * Type guard for Union or Intersection
 * @param o - operator to check
 * @category Filters
 */
export const isIntersectionOrUnion = (
  o: Operation,
): o is Intersection | Union =>
  (o as Intersection).operator === "and" || (o as Union).operator === "or";

/**
 * Type guard for Includes
 * @param o - operator to check
 * @category Filters
 */
export const isIncludes = (o: Operation): o is Includes =>
  (o as Includes).operator === "includes";

/**
 * Type guard for Union
 * @param o - operator to check
 * @category Filters
 */
export const isUnion = (o: Operation): o is Union =>
  (o as Union).operator === "or";

/**
 * Type guard for Intersection
 * @param o - operator to check
 * @category Filters
 */
export const isIntersection = (o: Operation): o is Intersection =>
  (o as Intersection).operator === "and";

/**
 * Type guard for ExcludeIfAny
 * @param o - operator to check
 * @category Filters
 */
export const isExcludeIfAny = (o: Operation): o is Includes =>
  (o as ExcludeIfAny).operator === "excludeifany";

/**
 * Given a string of JSON, parse it into an object.
 * @param str - the string to parse
 * @param defaults - the default value to return if the string is not valid JSON
 * @category Utility
 */
export const parseJSONParam: any = (str?: string, defaults = {}) => {
  if (str) {
    try {
      return JSON.parse(str) || defaults;
    } catch (err) {
      return defaults;
    }
  } else {
    return defaults;
  }
};

/**
 * Given a object of JSON, stringify it into a string.
 * @param obj - the object to stringify
 * @param defaults - the default value to return if the object is undefined
 * @category Utility
 */

export const stringifyJSONParam = (
  obj?: Record<string, any>,
  defaults = "{}",
): string => (obj ? JSON.stringify(obj) : defaults);
