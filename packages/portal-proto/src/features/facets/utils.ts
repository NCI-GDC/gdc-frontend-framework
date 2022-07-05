import { DAYS_IN_YEAR } from "@gff/core";
import _ from "lodash";

export const DEFAULT_VISIBLE_ITEMS = 6;

const capitalize = (s) => (s.length > 0 ? s[0].toUpperCase() + s.slice(1) : "");

const FieldNameOverrides = {
  "cases.project.program.name": "Program Name",
  "cases.project.project_id": "Project",
};

export const convertFieldToName = (field: string): string => {
  if (field in FieldNameOverrides) return FieldNameOverrides[field];

  const property = field.split(".").pop();
  const tokens = property.split("_");
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
