import {
  createBuckets,
  filterUsefulFacets,
  parseFieldName,
  qnorm,
  toDisplayName,
  parseNestedQQResponseData,
  createFiltersFromSelectedValues,
  roundContinuousValue,
} from "./utils";

describe("filterUsefulFacets", () => {
  it("remove empty bucket fields", () => {
    expect(
      filterUsefulFacets({
        "demographic.gender": {
          buckets: [
            { doc_count: 10, key: "female" },
            { doc_count: 25, key: "male" },
          ],
        },
        "demographic.race": { buckets: [{ key: "_missing", doc_count: 35 }] },
      }),
    ).toEqual({
      "demographic.gender": {
        buckets: [
          { doc_count: 10, key: "female" },
          { doc_count: 25, key: "male" },
        ],
      },
    });
  });

  it("remove empty stats fields", () => {
    expect(
      filterUsefulFacets({
        "exposures.height": {
          stats: { count: 0, min: null, max: null, sum: 0 },
        },
        "exposures.years_smoked": {
          stats: { count: 947, min: 0, max: 68, sum: 32170 },
        },
      }),
    ).toEqual({
      "exposures.years_smoked": {
        stats: { count: 947, min: 0, max: 68, sum: 32170 },
      },
    });
  });
});

describe("createBuckets", () => {
  it("standard bucket", () => {
    expect(createBuckets(7201, 32475)).toEqual([
      { from: 7201, to: 12255.8 },
      { from: 12255.8, to: 17310.6 },
      { from: 17310.6, to: 22365.4 },
      { from: 22365.4, to: 27420.2 },
      { from: 27420.2, to: 32476 },
    ]);
  });

  it("min/max the same bucket", () => {
    expect(createBuckets(850, 850)).toEqual([{ from: 850, to: 851 }]);
  });

  it("custom interval", () => {
    expect(createBuckets(0, 2.25, 0.5)).toEqual([
      { from: 0, to: 0.5 },
      { from: 0.5, to: 1 },
      { from: 1, to: 1.5 },
      { from: 1.5, to: 2.25 },
    ]);
  });
});

describe("toDisplayName", () => {
  it("regular field", () => {
    expect(toDisplayName("diagnoses.treatments.number_of_cycles")).toEqual(
      "Number Of Cycles",
    );
  });

  it("field with capitilized term", () => {
    expect(toDisplayName("diagnoses.ajcc_clinical_stage")).toEqual(
      "AJCC Clinical Stage",
    );
  });
});

describe("parseFieldName", () => {
  it("demographic field", () => {
    expect(parseFieldName("demographic__gender")).toEqual({
      field_name: "gender",
      field_type: "demographic",
      full: "demographic.gender",
    });
  });

  it("treatment field", () => {
    expect(parseFieldName("diagnoses__treatments__treatment_type")).toEqual({
      field_name: "treatment_type",
      field_type: "treatments",
      full: "diagnoses.treatments.treatment_type",
    });
  });
});

describe("qnorm", () => {
  it("calculates correctly", () => {
    expect(qnorm(0)).toEqual(0);
    expect(qnorm(0.05)).toEqual(-1.6448536279366273);
    expect(qnorm(0.5)).toEqual(0);
    expect(qnorm(0.75)).toEqual(0.6744897496907685);
  });
});

describe("parseNestedResponseData", () => {
  it("handles data nested one level deep", () => {
    const responseData = [
      {
        id: "3e1df30f-744a-41e9-a169-7dbbff66622e",
        diagnoses: [
          {
            age_at_diagnosis: 20021,
          },
        ],
      },
      {
        id: "adbaba9c-5efc-4130-82f6-8055eab13795",
        diagnoses: [
          {
            age_at_diagnosis: 22540,
          },
        ],
      },
      {
        id: "f43b511b-93d1-4a6e-ab17-e84448a084b2",
        diagnoses: [
          {
            age_at_diagnosis: 20995,
          },
        ],
      },
      {
        id: "8cff0812-d607-4380-9ef7-e5baa6612cc0",
        diagnoses: [
          {
            age_at_diagnosis: 19332,
          },
        ],
      },
    ];

    expect(
      parseNestedQQResponseData(responseData, "diagnoses.age_at_diagnosis"),
    ).toEqual([
      {
        id: "8cff0812-d607-4380-9ef7-e5baa6612cc0",
        value: 19332,
      },
      {
        id: "3e1df30f-744a-41e9-a169-7dbbff66622e",
        value: 20021,
      },
      {
        id: "f43b511b-93d1-4a6e-ab17-e84448a084b2",
        value: 20995,
      },
      {
        id: "adbaba9c-5efc-4130-82f6-8055eab13795",
        value: 22540,
      },
    ]);
  });

  it("handles data nested two levels deep", () => {
    const responseData = [
      {
        id: "56c07b06-c6d3-4c03-9e57-7be636e7cc5c",
        diagnoses: [
          {
            treatments: [
              {
                days_to_treatment_end: 252,
              },
              {
                days_to_treatment_end: 1065,
              },
            ],
          },
        ],
      },
      {
        id: "dca5fd31-71bc-4817-b87e-0acd55761e17",
        diagnoses: [
          {
            treatments: [
              {
                days_to_treatment_end: 142,
              },
              {
                days_to_treatment_end: 140,
              },
            ],
          },
        ],
      },
    ];

    expect(
      parseNestedQQResponseData(
        responseData,
        "diagnoses.treatments.days_to_treatment_end",
      ),
    ).toEqual([
      {
        id: "dca5fd31-71bc-4817-b87e-0acd55761e17",
        value: 140,
      },
      {
        id: "dca5fd31-71bc-4817-b87e-0acd55761e17",
        value: 142,
      },
      {
        id: "56c07b06-c6d3-4c03-9e57-7be636e7cc5c",
        value: 252,
      },
      {
        id: "56c07b06-c6d3-4c03-9e57-7be636e7cc5c",
        value: 1065,
      },
    ]);
  });

  it("handles object data structure", () => {
    const responseData = [
      {
        id: "3e1df30f-744a-41e9-a169-7dbbff66622e",
        demographic: {
          age_at_index: 54,
        },
      },
      {
        id: "01d604ce-3573-410b-bee6-49cef205658d",
        demographic: {
          age_at_index: 22280,
        },
      },
      {
        id: "9ddb1d66-2052-4abc-a764-90f7c72aa738",
        demographic: {
          age_at_index: 22645,
        },
      },
    ];

    expect(
      parseNestedQQResponseData(responseData, "demographic.age_at_index"),
    ).toEqual([
      {
        id: "3e1df30f-744a-41e9-a169-7dbbff66622e",
        value: 54,
      },
      {
        id: "01d604ce-3573-410b-bee6-49cef205658d",
        value: 22280,
      },
      {
        id: "9ddb1d66-2052-4abc-a764-90f7c72aa738",
        value: 22645,
      },
    ]);
  });
});

describe("createFiltersFromSelectedValues", () => {
  it("with negative continuous values", () => {
    const filters = createFiltersFromSelectedValues(
      true,
      "demographic.days_to_birth",
      [
        {
          value: "-32612.0--31470.4",
          numCases: 6,
        },
        {
          value: "-31470.4--30328.8",
          numCases: 8,
        },
      ],
      undefined,
    );

    expect(filters).toEqual({
      mode: "and",
      root: {
        "demographic.days_to_birth": {
          operator: "or",
          operands: [
            {
              operator: "and",
              operands: [
                {
                  field: "demographic.days_to_birth",
                  operator: ">=",
                  operand: "-32612.0",
                },
                {
                  field: "demographic.days_to_birth",
                  operator: "<",
                  operand: "-31470.4",
                },
              ],
              field: "demographic.days_to_birth",
            },
            {
              operator: "and",
              operands: [
                {
                  field: "demographic.days_to_birth",
                  operator: ">=",
                  operand: "-31470.4",
                },
                {
                  field: "demographic.days_to_birth",
                  operator: "<",
                  operand: "-30328.8",
                },
              ],
              field: "demographic.days_to_birth",
            },
          ],
        },
      },
    });
  });

  it("with continuous custom intervals", () => {
    const filters = createFiltersFromSelectedValues(
      true,
      "diagnoses.age_at_diagnosis",
      [
        {
          value: "5000.0-10000.0",
          numCases: 17,
        },
      ],
      {
        interval: 5000,
        min: 0,
        max: 30000,
      },
    );

    expect(filters).toEqual({
      mode: "and",
      root: {
        "diagnoses.age_at_diagnosis": {
          operator: "or",
          operands: [
            {
              operator: "and",
              operands: [
                {
                  field: "diagnoses.age_at_diagnosis",
                  operator: ">=",
                  operand: "5000.0",
                },
                {
                  field: "diagnoses.age_at_diagnosis",
                  operator: "<",
                  operand: "10000.0",
                },
              ],
              field: "diagnoses.age_at_diagnosis",
            },
          ],
        },
      },
    });
  });

  it("with named bins", () => {
    const filters = createFiltersFromSelectedValues(
      true,
      "diagnoses.age_at_diagnosis",
      [
        {
          value: "bin a",
          numCases: 17,
        },
      ],
      [
        {
          from: 5000,
          to: 10000,
          name: "bin a",
        },
      ],
    );

    expect(filters).toEqual({
      mode: "and",
      root: {
        "diagnoses.age_at_diagnosis": {
          operator: "or",
          operands: [
            {
              operator: "and",
              operands: [
                {
                  field: "diagnoses.age_at_diagnosis",
                  operator: ">=",
                  operand: 5000,
                },
                {
                  field: "diagnoses.age_at_diagnosis",
                  operator: "<",
                  operand: 10000,
                },
              ],
              field: "diagnoses.age_at_diagnosis",
            },
          ],
        },
      },
    });
  });

  it("with categorical values", () => {
    const filters = createFiltersFromSelectedValues(
      false,
      "demographic.ethnicity",
      [
        {
          value: "not hispanic or latino",
          numCases: 6179,
        },
      ],
      undefined,
    );

    expect(filters).toEqual({
      mode: "and",
      root: {
        "demographic.ethnicity": {
          operator: "includes",
          operands: ["not hispanic or latino"],
          field: "demographic.ethnicity",
        },
      },
    });
  });

  it("with missing values", () => {
    const filters = createFiltersFromSelectedValues(
      false,
      "diagnoses.treatments.therapeutic_agents",
      [
        {
          value: "_missing",
          numCases: 100,
        },
        {
          value: "etoposide",
          numCases: 20,
        },
      ],
      undefined,
    );

    expect(filters).toEqual({
      mode: "and",
      root: {
        "diagnoses.treatments.therapeutic_agents": {
          operator: "or",
          operands: [
            {
              operator: "includes",
              operands: ["etoposide"],
              field: "diagnoses.treatments.therapeutic_agents",
            },
            {
              operator: "missing",
              field: "diagnoses.treatments.therapeutic_agents",
            },
          ],
        },
      },
    });
  });

  it("with custom bins", () => {
    const filters = createFiltersFromSelectedValues(
      false,
      "demographic.ethnicity",
      [
        {
          value: "selected value 1",
          numCases: 5788,
        },
        {
          value: "not hispanic or latino",
          numCases: 6179,
        },
      ],
      {
        "not hispanic or latino": 6179,
        "hispanic or latino": 172,
        "selected value 1": {
          "not allowed to collect": 287,
          unknown: 1106,
          "not reported": 4395,
        },
      },
    );

    expect(filters).toEqual({
      mode: "and",
      root: {
        "demographic.ethnicity": {
          operator: "includes",
          operands: [
            "not allowed to collect",
            "unknown",
            "not reported",
            "not hispanic or latino",
          ],
          field: "demographic.ethnicity",
        },
      },
    });
  });
});

describe("roundContinuousValue", () => {
  it("format years or days as whole integer", () => {
    const expectedValue = roundContinuousValue(
      2.25,
      "diagnoses.age_at_diagnosis",
      false,
    );
    expect(expectedValue).toEqual(2);
  });

  it("format years or days as whole integer less than ABS 1", () => {
    const expectedValue = roundContinuousValue(
      0.25,
      "diagnoses.age_at_diagnosis",
      false,
    );
    expect(expectedValue).toEqual(0);
  });

  it("format non-year/day values as integer", () => {
    const expectedValue = roundContinuousValue(
      2.25,
      "treatments.treatment_dose",
      false,
    );
    expect(expectedValue).toEqual(2);
  });

  it("format non-year/day values less than ABS 1 to 2 decimal place", () => {
    const expectedValue = roundContinuousValue(
      0.25,
      "treatments.treatment_dose",
      false,
    );
    expect(expectedValue).toEqual(0.25);

    const expectedValue2 = roundContinuousValue(
      -0.25,
      "treatments.treatment_dose",
      false,
    );
    expect(expectedValue2).toEqual(-0.25);
  });

  it("format values in a custom bin to 2 decimal place", () => {
    const expectedValue = roundContinuousValue(
      2.25,
      "diagnoses.age_at_diagnosis",
      true,
    );
    expect(expectedValue).toEqual(2.25);
  });
});
