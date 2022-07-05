import { get_facets_from_list } from "@/features/cohortBuilder/dictionary";

describe("cohort config tests", () => {
  test("get tabs facets", () => {
    const expected = [
      {
        name: "demographic.gender",
        facet_filter: "demographic.gender",
        facet_type: "enum",
        label: "Gender",
        enum: ["female", "male", "unknown", "unspecified", "not reported"],
      },
      {
        name: "demographic.race",
        facet_filter: "demographic.race",
        facet_type: "enum",
        label: "Race",
        enum: [
          "white",
          "american indian or alaska native",
          "black or african american",
          "asian",
          "native hawaiian or other pacific islander",
          "other",
          "Unknown",
          "not reported",
          "not allowed to collect",
          "unknown",
        ],
      },
      {
        name: "demographic.ethnicity",
        facet_filter: "demographic.ethnicity",
        facet_type: "enum",
        label: "Ethnicity",
        enum: [
          "hispanic or latino",
          "not hispanic or latino",
          "Unknown",
          "not reported",
          "not allowed to collect",
          "unknown",
        ],
      },
      {
        name: "diagnoses.age_at_diagnosis",
        facet_filter: "diagnoses.age_at_diagnosis",
        facet_type: "age",
        label: "Age at Diagnosis",
        oneOf: {
          type: "integer",
          maximum: 32872,
          minimum: 0,
        },
        minimum: 0,
        maximum: 32872,
        property_type: "integer",
      },
      {
        name: "diagnoses.vital_status",
      },
    ];

    expect(
      get_facets_from_list([
        "demographic.gender",
        "demographic.race",
        "demographic.ethnicity",
        "diagnoses.age_at_diagnosis",
        "diagnoses.vital_status",
      ]),
    ).toEqual(expected);
  });
});
