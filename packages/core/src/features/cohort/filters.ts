/* eslint-disable @typescript-eslint/no-unused-vars */
import { isArray, isEmpty } from "lodash";
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
  convertGqlFilterToFilter,
  GqlIntersection,
  GqlUnion,
} from "../gdcapi/filters";
import { isEqual } from "lodash";

/**
 * Root filter set. Similar to how case filters are
 * manages: as an Object where the key is the field name
 * and the value is the Filter Operation
 *
 * @param root - root Objects of all of the filters
 * @param mode - Root level set operation for the filters
 */
export interface FilterSet {
  readonly root: Record<string, Operation>;
  readonly mode: string;
}

/**
 * Return true if a FilterSet's root value is an empty object
 * @param fs - FilterSet to test
 */
export const isFilterSetRootEmpty = (fs: FilterSet): boolean =>
  isEqual({}, fs.root);

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
/**
 * Build Cohort Gql Operator from Filter Set
 *
 * @param fs - FilterSet it has special code for ids with joinOrToAll that will join each or filter with all other filters as a separate and linked by an or statement
 *
 * @example
 * Here's an example with joinOrToAll
 * ```json
 * //IN:
 * {
 *   "mode": "and",
 *   "root": {
 *     "joinOrToAllfilesSearch": {
 *       "operator": "or",
 *       "operands": [
 *         {
 *           "operator": "=",
 *           "field": "files.file_name",
 *           "operand": "*test*"
 *         },
 *         {
 *           "operator": "=",
 *           "field": "files.file_id",
 *           "operand": "*test*"
 *         }
 *       ]
 *     },
 *     "files.data_category": {
 *       "operator": "includes",
 *       "field": "files.data_category",
 *       "operands": [
 *         "clinical"
 *       ]
 *     }
 *   }
 * }
 *
 * // Out:
 * {
 *   "op": "or",
 *   "content": [
 *     {
 *       "op": "and",
 *       "content": [
 *         {
 *           "op": "=",
 *           "content": {
 *             "field": "files.file_name",
 *             "value": "*test*"
 *           }
 *         },
 *         {
 *           "op": "in",
 *           "content": {
 *             "field": "files.data_category",
 *             "value": [
 *               "clinical"
 *             ]
 *           }
 *         }
 *       ]
 *     },
 *     {
 *       "op": "and",
 *       "content": [
 *         {
 *           "op": "=",
 *           "content": {
 *             "field": "files.file_id",
 *             "value": "*test*"
 *           }
 *         },
 *         {
 *           "op": "in",
 *           "content": {
 *             "field": "files.data_category",
 *             "value": [
 *               "clinical"
 *             ]
 *           }
 *         }
 *       ]
 *     }
 *   ]
 * }
 * ```
 */
export const buildCohortGqlOperator = (
  fs: FilterSet | undefined,
): GqlOperation | undefined => {
  if (!fs || !fs.root) return undefined;

  const fsKeys = Object.keys(fs.root);
  // if no keys return undefined
  if (fsKeys.length === 0) return undefined;

  // TODO consider changing FilterSet: mode to support joinOrToAll as FilterSet mode
  // find key using keyword "joinOrToAll"
  const joinOrToAllKey = fsKeys.filter((x) => x.includes("joinOrToAll"));

  switch (fs.mode) {
    case "and":
      if (joinOrToAllKey.length === 1) {
        const firstJoinOrToAllKey = joinOrToAllKey[0];

        // Remove firstJoinOrToAllKey from Array
        fsKeys.splice(fsKeys.indexOf(firstJoinOrToAllKey), 1);

        const firstJoinOrToAllObj = fs.root[firstJoinOrToAllKey];
        // make sure type is or/ Union
        if (firstJoinOrToAllObj.operator === "or") {
          return {
            op: "or",
            content: firstJoinOrToAllObj?.operands.map((orObj) => {
              // go through each or stament and add all other filters to it
              return {
                op: "and",
                content: [
                  convertFilterToGqlFilter(orObj),
                  ...fsKeys.map((k): GqlOperation => {
                    return convertFilterToGqlFilter(fs.root[k]);
                  }),
                ],
              };
            }),
          };
        } else {
          console.error(
            `function buildCohortGqlOperator expecting "or" received "${firstJoinOrToAllObj.operator}" on key "${firstJoinOrToAllKey}"`,
          );
        }
      } else if (joinOrToAllKey.length > 1) {
        console.error(
          `function buildCohortGqlOperator expecting only one joinOrToAll received: ${joinOrToAllKey.length}`,
          fsKeys,
        );
      }
      return {
        // TODO: Replace fixed AND with cohort top level operation like Union or Intersection
        op: fs.mode,
        content: fsKeys.map((k): GqlOperation => {
          return convertFilterToGqlFilter(fs.root[k]);
        }),
      };
  }
  return undefined;
};

export const filterSetToOperation = (
  fs: FilterSet | undefined,
): Operation | undefined => {
  if (!fs) return undefined;
  switch (fs.mode) {
    case "and":
      return Object.keys(fs.root).length == 0
        ? undefined
        : {
            operator: fs.mode,
            operands: Object.keys(fs.root).map((k): Operation => {
              return fs.root[k];
            }),
          };
  }
  return undefined;
};

export const buildGqlOperationToFilterSet = (
  fs: GqlIntersection | GqlUnion | Record<string, never>,
): FilterSet => {
  if (isEmpty(fs)) return { mode: "and", root: {} };

  const obj = (fs as GqlIntersection | GqlUnion).content.reduce((acc, item) => {
    const key = isArray(item.content)
      ? item.content?.at(0).field
      : (item.content as any).field;

    return {
      ...acc,
      [key]: convertGqlFilterToFilter(item),
    };
  }, {});

  return {
    mode: (fs as GqlIntersection | GqlUnion).op,
    root: obj,
  };
};

/**
 * Merged two FilterSets returning the merged pair.
 * @param a - first FilterSet
 * @param b - other FilterSet
 */
export const joinFilters = (a: FilterSet, b: FilterSet): FilterSet => {
  return { mode: a.mode, root: { ...a.root, ...b.root } };
};

/*
export const mergeFilters = (a: FilterSet, b: FilterSet): FilterSet => {
  Object.keys(b.root).forEach((key) => {
    if (a.root[key]) {
      a.root[key] = {
        operator: "and",
        operands: [a.root[key], b.root[key]],
      };
    } else {
      a.root[key] = b.root[key];
    }
   });
  return a;
}*/
