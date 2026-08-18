import { FacetDefinition, FacetTypes } from "./types";
import SupplementalFacetDefinitions from "./data/facet_additional_range_data.json";
import { some, includes } from "lodash";

export const classifyFacetDatatype = (f: FacetDefinition): FacetTypes => {
  const fieldName = f.field;
  // NOTE: put exceptional cases first
  if (fieldName.includes("alcohol_days_per_week")) return "range";
  if (fieldName.includes("is_cancer_gene_census")) return "toggle";
  if (fieldName.includes("age_at_last_exposure")) return "age_in_years";
  if (fieldName.includes("age_at_onset")) return "age_in_years";
  if (fieldName.includes("figo")) return "enum";
  if (fieldName.includes("age_is_")) return "enum";
  if (fieldName.includes("age_range")) return "enum";
  if (fieldName.includes("birth_range")) return "enum";

  if (fieldName.includes("datetime")) return "datetime";
  if (fieldName.includes("percent_range")) return "enum";
  if (fieldName.includes("percent")) return "percent";
  if (
    fieldName.includes(".age_") ||
    fieldName.includes("_age_") ||
    fieldName.endsWith("_age")
  ) {
    if (f.description.includes("year")) {
      return "age_in_years";
    }

    return "age";
  }
  if (fieldName.includes("days")) return "days";
  if (fieldName.includes("years")) return "range";
  if (fieldName.includes("year")) return "year";
  if (fieldName.includes("project_id")) return "enum";

  if (f.type === "long" || f.type === "float" || f.type === "double")
    return "range";

  if (
    some(["_id", "_uuid", "md5sum", "file_name"], (idSuffix) =>
      includes(f.field, idSuffix),
    )
  )
    return "exact";

  // TODO: Determine if this needs to be handled
  // if (f.type === "terms") {
  //   // on Annotations & Repo pages project_id is a terms facet
  //   // need a way to force an *_id field to return terms
  //   return "terms";
  // }

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
