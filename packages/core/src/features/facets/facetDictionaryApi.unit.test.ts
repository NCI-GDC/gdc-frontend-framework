import {
  trimFirstFieldNameToTitle,
  processDictionaryEntries,
  fieldNameToTitle,
} from "./facetDictionaryApi";

import { FacetDefinition } from "./types";

const TestFacetDictionary = {
  "cases.case_id": {
    description: "",
    doc_type: "cases",
    field: "case_id",
    full: "cases.case_id",
    type: "keyword",
  },
  "cases.created_datetime": {
    description: "",
    doc_type: "cases",
    field: "created_datetime",
    full: "cases.created_datetime",
    type: "keyword",
  },
  "cases.demographic.age_at_index": {
    description:
      "The patient's age (in years) on the reference or anchor date date used during date obfuscation.",
    doc_type: "cases",
    field: "demographic.age_at_index",
    full: "cases.demographic.age_at_index",
    type: "long",
  },
  "cases.demographic.age_is_obfuscated": {
    description:
      "The age or other properties related to the patient's age have been modified for compliance reasons. The actual age may differ from what was reported in order to comply with the Health Insurance Portability and Accountability Act (HIPAA).",
    doc_type: "cases",
    field: "demographic.age_is_obfuscated",
    full: "cases.demographic.age_is_obfuscated",
    type: "keyword",
  },
  "cases.demographic.cause_of_death": {
    description: "Text term to identify the cause of death for a patient.",
    doc_type: "cases",
    field: "demographic.cause_of_death",
    full: "cases.demographic.cause_of_death",
    type: "keyword",
  },
  "cases.demographic.cause_of_death_source": {
    description:
      "The text term used to describe the source used to determine the patient's cause of death.",
    doc_type: "cases",
    field: "demographic.cause_of_death_source",
    full: "cases.demographic.cause_of_death_source",
    type: "keyword",
  },
};

describe("test facet dictionary api functions", () => {
  test("process and augment facet dictionary entries", () => {
    const expected = {
      "cases.case_id": {
        description: "",
        doc_type: "cases",
        field: "case_id",
        full: "cases.case_id",
        type: "keyword",
        facet_type: "exact",
      },
      "cases.created_datetime": {
        description: "",
        doc_type: "cases",
        field: "created_datetime",
        full: "cases.created_datetime",
        type: "keyword",
        facet_type: "datetime",
      },
      "cases.demographic.age_at_index": {
        description:
          "The patient's age (in years) on the reference or anchor date date used during date obfuscation.",
        doc_type: "cases",
        field: "demographic.age_at_index",
        full: "cases.demographic.age_at_index",
        type: "long",
        facet_type: "age",
        range: {
          minimum: 0,
          maximum: 32507,
        },
      },
      "cases.demographic.age_is_obfuscated": {
        description:
          "The age or other properties related to the patient's age have been modified for compliance reasons. The actual age may differ from what was reported in order to comply with the Health Insurance Portability and Accountability Act (HIPAA).",
        doc_type: "cases",
        field: "demographic.age_is_obfuscated",
        full: "cases.demographic.age_is_obfuscated",
        type: "keyword",
        facet_type: "enum",
        range: {},
      },
      "cases.demographic.cause_of_death": {
        description: "Text term to identify the cause of death for a patient.",
        doc_type: "cases",
        field: "demographic.cause_of_death",
        full: "cases.demographic.cause_of_death",
        type: "keyword",
        facet_type: "enum",
      },
      "cases.demographic.cause_of_death_source": {
        description:
          "The text term used to describe the source used to determine the patient's cause of death.",
        doc_type: "cases",
        field: "demographic.cause_of_death_source",
        full: "cases.demographic.cause_of_death_source",
        type: "keyword",
        facet_type: "enum",
      },
    };

    const results = processDictionaryEntries(
      TestFacetDictionary as Record<string, FacetDefinition>,
    );
    expect(results).toEqual(expected);
  });
});

describe("facet label utils", () => {
  test("should return the name of the field", () => {
    const name = fieldNameToTitle("analysis.input_files.experimental_strategy");
    expect(name).toEqual("Experimental Strategy");
  });

  test("should return two parts of the field", () => {
    const name = fieldNameToTitle(
      "analysis.input_files.experimental_strategy",
      2,
    );
    expect(name).toEqual("Input Files Experimental Strategy");
  });

  test("should return a Project special case", () => {
    const name = fieldNameToTitle("cases.project.project_id");
    expect(name).toEqual("Project");
  });

  test("should return Analysis", () => {
    const name = fieldNameToTitle("analysis", 2);
    expect(name).toEqual("Analysis");
  });

  test("should create a shortened facet title", () => {
    const results = trimFirstFieldNameToTitle(
      "demographic.age_is_obfuscated",
      true,
    );
    expect(results).toEqual("Age is Obfuscated");
  });

  test("should create a longer facet title", () => {
    const results = trimFirstFieldNameToTitle(
      "cases.demographic.cause_of_death",
      true,
    );
    expect(results).toEqual("Demographic Cause of Death");
  });

  test("should create a title minus cases", () => {
    const results = trimFirstFieldNameToTitle(
      "cases.demographic.cause_of_death",
      true,
    );
    expect(results).toEqual("Demographic Cause of Death");
  });
});
