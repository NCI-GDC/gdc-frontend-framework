import { FacetDefinition } from "./types";
import SupplementalFacetDefinitions from "./data/facet_additional_data.json";

const COMMON_PREPOSITIONS = [
  "a",
  "an",
  "and",
  "at",
  "but",
  "by",
  "for",
  "in",
  "is",
  "nor",
  "of",
  "on",
  "or",
  "out",
  "so",
  "the",
  "to",
  "up",
  "yet",
];

const capitalize = (s: string): string =>
  s.length > 0 ? s[0].toUpperCase() + s.slice(1) : "";

export const shortendFieldNameToTitle = (
  fieldName: string,
  trim = false,
): string => {
  if (trim) {
    const source = fieldName.split(".").pop();
    return fieldNameToTitle(source ? source : fieldName);
  }
  return fieldNameToTitle(fieldName);
};

export const fieldNameToTitle = (fieldName: string): string =>
  fieldName
    .replace(/[_.]/g, " ")
    .split(" ")
    .map((word) =>
      COMMON_PREPOSITIONS.includes(word) ? word : capitalize(word),
    )
    .join(" ");

export const classifyFacetDatatype = (f: FacetDefinition): string => {
  const fieldName = f.field;
  if (fieldName.includes("age_is_")) return "enum";
  if (fieldName.includes("datetime")) return "datetime";
  if (fieldName.includes("percent")) return "percent";
  if (fieldName.includes("age_")) return "age";
  if (fieldName.includes("_age_")) return "age";
  if (fieldName.includes("_age")) return "age";
  if (fieldName.includes("days")) return "days";
  if (fieldName.includes("years")) return "years";
  if (fieldName.includes("year")) return "year";

  return "enum";
};

interface IStringIndex {
  [key: string]: any;
}

const getRangeData = (f: FacetDefinition) => {
  if (f.field in SupplementalFacetDefinitions) {
    return {
      minimum: (SupplementalFacetDefinitions as IStringIndex)[f.field].minimum,
      maximum: (SupplementalFacetDefinitions as IStringIndex)[f.field].maximum,
    };
  } else {
    return undefined;
  }
};

export const processDictionaryEntries = (
  entries: Record<string, FacetDefinition>,
): Record<string, FacetDefinition> => {
  return Object.keys(entries).reduce(
    (dict: Record<string, FacetDefinition>, key: string) => {
      dict[key] = {
        ...entries[key],
        facet_type: classifyFacetDatatype(entries[key]),
        range: getRangeData(entries[key]),
      };
      return dict;
    },
    {} as Record<string, FacetDefinition>,
  );
};
