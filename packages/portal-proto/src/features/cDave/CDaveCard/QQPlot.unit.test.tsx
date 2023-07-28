import { parseNestedResponseData, getQ1Q3Line } from "./QQPlot";

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
      parseNestedResponseData(responseData, "diagnoses.age_at_diagnosis"),
    ).toEqual([
      {
        id: "3e1df30f-744a-41e9-a169-7dbbff66622e",
        value: 20021,
      },
      {
        id: "adbaba9c-5efc-4130-82f6-8055eab13795",
        value: 22540,
      },
      {
        id: "f43b511b-93d1-4a6e-ab17-e84448a084b2",
        value: 20995,
      },
      {
        id: "8cff0812-d607-4380-9ef7-e5baa6612cc0",
        value: 19332,
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
      parseNestedResponseData(
        responseData,
        "diagnoses.treatments.days_to_treatment_end",
      ),
    ).toEqual([
      {
        id: "56c07b06-c6d3-4c03-9e57-7be636e7cc5c",
        value: 252,
      },
      {
        id: "56c07b06-c6d3-4c03-9e57-7be636e7cc5c",
        value: 1065,
      },
      {
        id: "dca5fd31-71bc-4817-b87e-0acd55761e17",
        value: 142,
      },
      {
        id: "dca5fd31-71bc-4817-b87e-0acd55761e17",
        value: 140,
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
      parseNestedResponseData(responseData, "demographic.age_at_index"),
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

describe("getQ1Q3Line", () => {
  it("draws line through Q1 and Q3 of data", () => {
    const chartData = [
      { x: 1, y: 1 },
      { x: 3, y: 2 },
      { x: 3, y: 4 },
      { x: 4, y: 5 },
      { x: 6, y: 6 },
    ];

    expect(getQ1Q3Line(chartData)).toEqual([
      {
        x: 2.6666666666666665,
        y: 1,
      },
      {
        x: 3,
        y: 2,
      },
      {
        x: 4,
        y: 5,
      },
      {
        x: 4.333333333333333,
        y: 6,
      },
    ]);
  });
});
