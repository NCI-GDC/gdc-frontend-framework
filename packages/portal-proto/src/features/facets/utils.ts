import {
  DAYS_IN_YEAR,
  GreaterThan,
  GreaterThanOrEquals,
  LessThan,
  LessThanOrEquals,
  Operation,
} from "@gff/core";
import _ from "lodash";
import { FromToRange } from "@/features/facets/types";
// TODO write unit test for these
export const DEFAULT_VISIBLE_ITEMS = 6;

const capitalize = (s) => (s.length > 0 ? s[0].toUpperCase() + s.slice(1) : "");

const FieldNameOverrides = {
  "cases.project.program.name": "Program Name",
  "cases.project.project_id": "Project",
};

/**
 * Converts a GDC filter name to a title,
 * For example files.input.experimental_strategy will get converted to Experimental Strategy
 * if sections == 2 then the output would be Input Experimental Strategy
 * @param field input filter expected to be: string.firstpart_secondpart
 * @param sections number of "sections" string.string.string to got back from the end of the field
 */
export const convertFieldToName = (field: string, sections = 1): string => {
  if (field in FieldNameOverrides) return FieldNameOverrides[field];

  const tokens = field
    .split(".")
    .slice(-sections)
    .map((s) => s.split("_"))
    .flat();
  const capitalizedTokens = tokens.map((s) => capitalize(s));
  return capitalizedTokens.join(" ");
};

export const getLowerAgeYears = (days?: number): number | undefined =>
  days !== undefined ? Math.ceil(days / DAYS_IN_YEAR) : undefined;
export const getUpperAgeYears = (days?: number): number | undefined =>
  days !== undefined
    ? Math.ceil((days + 1 - DAYS_IN_YEAR) / DAYS_IN_YEAR)
    : undefined;
export const getLowerAgeFromYears = (years?: number): number | undefined =>
  years !== undefined ? Math.floor(years * DAYS_IN_YEAR) : undefined;
export const getUpperAgeFromYears = (years?: number): number | undefined =>
  years !== undefined
    ? Math.floor(years * DAYS_IN_YEAR + DAYS_IN_YEAR - 1)
    : undefined;

export const AgeDisplay = (
  ageInDays: number,
  yearsOnly = false,
  defaultValue = "--",
): string => {
  const leapThenPair = (years: number, days: number): number[] =>
    days === 365 ? [years + 1, 0] : [years, days];
  const timeString = (
    num: number,
    singular: string,
    plural: string,
  ): string => {
    const pluralChecked = plural || `${singular}s`;
    return `${num} ${num === 1 ? singular : pluralChecked}`;
  };
  const _timeString = _.spread(timeString);

  if (!ageInDays) {
    return defaultValue;
  }
  return _.zip(
    leapThenPair(
      Math.floor(ageInDays / DAYS_IN_YEAR),
      Math.ceil(ageInDays % DAYS_IN_YEAR),
    ),
    ["year", "day"],
  )
    .filter((p) => (yearsOnly ? p[1] === "year" : p[0] > 0))
    .map((p) => (!yearsOnly ? _timeString(p) : p[0]))
    .join(" ")
    .trim();
};

export const buildRangeOperator = <T extends string | number>(
  field: string,
  rangeData: FromToRange<T>,
): Operation | undefined => {
  // couple of different cases
  // * no from/to return undefined
  if (rangeData.from === undefined && rangeData.to === undefined)
    return undefined;

  const fromOperation: GreaterThan | GreaterThanOrEquals =
    rangeData.from !== undefined
      ? {
          field: field,
          operator: rangeData.fromOp,
          operand: rangeData.from,
        }
      : undefined;
  const toOperation: LessThan | LessThanOrEquals =
    rangeData.to !== undefined
      ? {
          field: field,
          operator: rangeData.toOp,
          operand: rangeData.to,
        }
      : undefined;

  if (fromOperation && toOperation)
    return { operator: "and", operands: [fromOperation, toOperation] };
  if (fromOperation) return fromOperation;
  return toOperation;
};

/**
 * Given an operation, determine if range is open or closed and extract
 * the range values and operands as a NumericRange
 * @param filter - operation to test
 */
export const extractRangeValues = <T extends string | number>(
  filter?: Operation,
): FromToRange<T> | undefined => {
  if (filter !== undefined) {
    switch (filter.operator) {
      case ">":
        return {
          from:
            typeof filter.operand === "number" ||
            typeof filter.operand === "string"
              ? (filter.operand as T)
              : undefined,
          fromOp: filter.operator,
        };
      case ">=":
        return {
          from:
            typeof filter.operand === "number" ||
            typeof filter.operand === "string"
              ? (filter.operand as T)
              : undefined,
          fromOp: filter.operator,
        };
      case "<":
        return {
          to:
            typeof filter.operand === "number" ||
            typeof filter.operand === "string"
              ? (filter.operand as T)
              : undefined,
          toOp: filter.operator,
        };
      case "<=":
        return {
          to:
            typeof filter.operand === "number" ||
            typeof filter.operand === "string"
              ? (filter.operand as T)
              : undefined,
          toOp: filter.operator,
        };
      case "and": {
        const a = extractRangeValues<T>(filter.operands[0]);
        const b = extractRangeValues<T>(filter.operands[1]);
        return { ...a, ...b };
      }
      default:
        return undefined;
    }
  } else {
    return undefined;
  }
};
