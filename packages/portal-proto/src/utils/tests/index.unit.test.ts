import {
  ageDisplay,
  capitalize,
  calculatePercentageAsString,
  filtersToName,
  getFormattedTimestamp,
} from "../index";

describe("capitalize", () => {
  it("should captalize a string", () => {
    expect(capitalize("portal enhancement analysis refactor")).toEqual(
      "Portal Enhancement Analysis Refactor",
    );
  });

  it("should capitalize dbgap as dbGaP", () => {
    expect(capitalize("dbgap")).toEqual("dbGaP");
    expect(capitalize("portal enhancement analysis dbgap refactor")).toEqual(
      "Portal Enhancement Analysis dbGaP Refactor",
    );
  });

  it("should capitalize dbsnp as dbSNP", () => {
    expect(capitalize("dbsnp")).toEqual("dbSNP");
    expect(capitalize("portal enhancement analysis dbsnp refactor")).toEqual(
      "Portal Enhancement Analysis dbSNP Refactor",
    );
  });

  it("should capitalize cosmic as COSMIC", () => {
    expect(capitalize("cosmic")).toEqual("COSMIC");
    expect(capitalize("portal enhancement analysis cosmic refactor")).toEqual(
      "Portal Enhancement Analysis COSMIC Refactor",
    );
  });
});

describe("calculatePercentageAsString", () => {
  it("should return correct percentage string upto 2 decimal point", () => {
    expect(calculatePercentageAsString(12, 120)).toEqual("10.00%");
    expect(calculatePercentageAsString(14, 27)).toEqual("51.85%");
    expect(calculatePercentageAsString(15, 31)).toEqual("48.39%");
  });
});

describe("ageDisplay", () => {
  it("should return correct years, day format for non leap year", () => {
    expect(ageDisplay(0)).toEqual("0 days");
    expect(ageDisplay(12345)).toEqual("33 years 292 days");
    expect(ageDisplay(12345, true)).toEqual("33 years");
  });

  it("should return correct value for leap years day", () => {
    expect(ageDisplay(36890)).toEqual("101 years");
  });

  it("should return correct years, day format for non leap year for negative values", () => {
    expect(ageDisplay(-12345)).toEqual("-33 years 292 days");
    expect(ageDisplay(-12345, true)).toEqual("-33 years");
  });

  it("should return correct value for leap years day for negative values", () => {
    expect(ageDisplay(-36890)).toEqual("-101 years");
  });
});

describe("filtersToName", () => {
  it("should return an empty string when passed empty filters", () => {
    expect(filtersToName(undefined)).toEqual("");
    expect(
      filtersToName({
        mode: "and",
        root: { field: { operands: [], operator: "and" } },
      }),
    ).toEqual("");
  });

  it("should join same value by '/', different values by ','", () => {
    expect(
      filtersToName({
        mode: "and",
        root: {
          field1: {
            operands: ["one", "two"],
            operator: "includes",
            field: "field1",
          },
        },
      }),
    ).toEqual("one / two");
    expect(
      filtersToName({
        mode: "and",
        root: {
          field1: {
            operands: ["one", "two"],
            operator: "includes",
            field: "field1",
          },
          field2: {
            operands: ["one", "two"],
            operator: "includes",
            field: "field2",
          },
        },
      }),
    ).toEqual("one / two, one / two");
  });

  it("should handle ops with single value", () => {
    expect(
      filtersToName({
        mode: "and",
        root: {
          field1: { operands: ["one"], operator: "includes", field: "field1" },
        },
      }),
    ).toEqual("one");

    expect(
      filtersToName({
        mode: "and",
        root: {
          field1: { operands: ["one"], operator: "includes", field: "field1" },
          field2: {
            operands: ["one", "two"],
            operator: "includes",
            field: "field2",
          },
        },
      }),
    ).toEqual("one, one / two");
  });

  it("should truncate to 6 values", () => {
    expect(
      filtersToName({
        mode: "and",
        root: {
          field1: {
            operands: ["one", "two", "three", "four", "five", "six"],
            operator: "includes",
            field: "field1",
          },
        },
      }),
    ).toEqual("one / two / three / four / five / six");

    expect(
      filtersToName({
        mode: "and",
        root: {
          field1: {
            operands: ["one", "two", "three", "four", "five", "six", "seven"],
            operator: "includes",
            field: "field1",
          },
        },
      }),
    ).toEqual("one / two / three / four / five / six...");

    expect(
      filtersToName({
        mode: "and",
        root: {
          field1: {
            operands: ["one", "two"],
            operator: "includes",
            field: "field1",
          },
          field2: {
            operands: ["one"],
            operator: "includes",
            field: "field2",
          },
          field3: {
            operands: ["one", "two"],
            operator: "includes",
            field: "field3",
          },
          field4: {
            operands: ["one"],
            operator: "includes",
            field: "field4",
          },
        },
      }),
    ).toEqual("one / two, one, one / two, one");

    expect(
      filtersToName({
        mode: "and",
        root: {
          field1: {
            operands: ["one", "two"],
            operator: "includes",
            field: "field1",
          },
          field2: {
            operands: ["one"],
            operator: "includes",
            field: "field2",
          },
          field3: {
            operands: ["one", "two"],
            operator: "includes",
            field: "field3",
          },
          field4: {
            operands: ["one", "two"],
            operator: "includes",
            field: "field4",
          },
        },
      }),
    ).toEqual("one / two, one, one / two, one...");
  });
});

describe("getFormattedTimestamp", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  const mockDateAndTest = (
    dateString: string,
    expectedOutput: string,
    description: string,
  ) => {
    test(description, () => {
      const mockDate = new Date(dateString);
      jest
        .spyOn(global, "Date")
        .mockImplementation(() => mockDate as unknown as string);
      const result = getFormattedTimestamp();
      expect(result).toBe(expectedOutput);
    });
  };

  mockDateAndTest(
    "Tue Oct 08 2024 16:14:11 GMT-0500 (Central Daylight Time)",
    "2024-10-08.161411",
    "formats regular datetime correctly",
  );

  mockDateAndTest(
    "Tue Sep 08 2024 04:05:06 GMT-0500 (Central Daylight Time)",
    "2024-09-08.040506",
    "handles single-digit hours/minutes/seconds",
  );

  mockDateAndTest(
    "Tue Dec 31 2024 23:59:59 GMT-0600 (Central Standard Time)",
    "2024-12-31.235959",
    "handles end of year in CST",
  );

  test("verifies format pattern", () => {
    const mockDate = new Date(
      "Tue Jan 01 2024 12:00:00 GMT-0600 (Central Standard Time)",
    );
    jest
      .spyOn(global, "Date")
      .mockImplementation(() => mockDate as unknown as string);
    const result = getFormattedTimestamp();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}\.\d{6}$/);
  });
});
