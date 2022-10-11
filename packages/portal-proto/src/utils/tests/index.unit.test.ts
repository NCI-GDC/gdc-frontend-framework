import { ageDisplay, capitalize, calculatePercentage } from "../index";

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

describe("calculatePercentage", () => {
  it("should return correct percentage string upto 2 decimal point", () => {
    expect(calculatePercentage(12, 120)).toEqual("10.00%");
    expect(calculatePercentage(14, 27)).toEqual("51.85%");
    expect(calculatePercentage(15, 31)).toEqual("48.39%");
  });
});

describe("ageDisplay", () => {
  it("should return correct years, day format for non leap year", () => {
    expect(ageDisplay(12345)).toEqual("33 years 292 days");
    expect(ageDisplay(12345, true)).toEqual("33");
  });

  it("should return correct value for leap years day", () => {
    expect(ageDisplay(36890)).toEqual("101 years");
  });
});
