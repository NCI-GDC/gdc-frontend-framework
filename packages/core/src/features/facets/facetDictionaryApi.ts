import { FacetDefinition } from "./types";
import SupplementalFacetDefinitions from "./data/facet_additional_data.json";
import { some, includes } from "lodash";

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

export const trimFirstFieldNameToTitle = (
  fieldName: string,
  trim = false,
): string => {
  if (trim) {
    const source = fieldName.slice(fieldName.indexOf(".") + 1);
    return fieldNameToTitle(source ? source : fieldName, 0);
  }
  return fieldNameToTitle(fieldName);
};

export const fieldNameToTitle = (fieldName: string, sections = 1): string =>
  fieldName
    .split(".")
    .slice(-sections)
    .map((s) => s.split("_"))
    .flat()
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

  if (f.type === "long" || f.type === "float" || f.type === "double")
    return "range";

  if (
    some(["_id", "_uuid", "md5sum", "file_name"], (idSuffix) =>
      includes(f.field, idSuffix),
    )
  )
    return "exact";

  if (f.type === "terms") {
    // on Annotations & Repo pages project_id is a terms facet
    // need a way to force an *_id field to return terms
    return "terms";
  }

  if (f.type === "exact") return "exact";

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
