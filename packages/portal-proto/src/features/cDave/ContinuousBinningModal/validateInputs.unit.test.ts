import {
  validateMinInput,
  validateMaxInput,
  validateIntervalInput,
  validateRangeInput,
} from "./validateInputs";

describe("validateInputs", () => {
  it("validate interval input", () => {
    expect(validateIntervalInput("", "5", "10")).toEqual("Required field");
    expect(validateIntervalInput("fhqwhgads", "5", "10")).toEqual(
      "fhqwhgads is not a valid number",
    );
    expect(validateIntervalInput("1.22222", "5", "10")).toEqual(
      "Use up to 2 decimal places",
    );
    expect(validateIntervalInput("-1", "5", "10")).toEqual(
      "Must be greater than 0",
    );
    expect(validateIntervalInput("7", "5", "10")).toEqual(
      "Must be less than or equal to 5",
    );
    expect(validateIntervalInput("7", "", "10")).toEqual(null);
    expect(validateIntervalInput("1", "5", "10")).toEqual(null);
  });

  it("validate min input", () => {
    expect(validateMinInput("", "10")).toEqual("Required field");
    expect(validateMinInput("blargh", "10")).toEqual(
      "blargh is not a valid number",
    );
    expect(validateMinInput("2.5252", "")).toEqual(
      "Use up to 2 decimal places",
    );
    expect(validateMinInput("15", "10")).toEqual("Must be less than 10");
    expect(validateMinInput("10", "")).toEqual(null);
    expect(validateMinInput("10", "15")).toEqual(null);
  });

  it("validate max input", () => {
    expect(validateMaxInput("", "10")).toEqual("Required field");
    expect(validateMaxInput("mmm", "10")).toEqual("mmm is not a valid number");
    expect(validateMaxInput("2.0001", "")).toEqual(
      "Use up to 2 decimal places",
    );
    expect(validateMaxInput("5", "10")).toEqual("Must be greater than 10");
    expect(validateMaxInput("10", "")).toEqual(null);
    expect(validateMaxInput("15", "10")).toEqual(null);
  });

  it("validate range input", () => {
    expect(
      validateRangeInput([
        {
          name: "",
          from: "10",
          to: "20",
        },
      ]),
    ).toEqual({ "ranges.0.name": "Required field" });
    expect(
      validateRangeInput([
        { name: "bin", from: "10", to: "20" },
        { name: "bin", from: "20", to: "30" },
      ]),
    ).toEqual({
      "ranges.0.name": "Bin names must be unique",
      "ranges.1.name": "Bin names must be unique",
    });

    expect(
      validateRangeInput([
        { name: "bin", from: "10", to: "20" },
        { name: "bin1", from: "15", to: "30" },
      ]),
    ).toEqual({
      "ranges.1.name": "bin1 overlaps with bin",
    });

    expect(
      validateRangeInput([
        { name: "bin", from: "mmm", to: "5" },
        { name: "bin1", from: "15", to: "30" },
      ]),
    ).toEqual({
      "ranges.0.from": "mmm is not a valid number",
    });

    expect(
      validateRangeInput([
        { name: "bin", from: "0", to: "5" },
        { name: "bin1", from: "15", to: "30.55555" },
      ]),
    ).toEqual({
      "ranges.1.to": "Use up to 2 decimal places",
    });

    expect(
      validateRangeInput([
        { name: "bin", from: "10", to: "5" },
        { name: "bin1", from: "15", to: "30" },
      ]),
    ).toEqual({
      "ranges.0.from": "Must be less than 5",
      "ranges.0.to": "Must be greater than 10",
    });

    expect(
      validateRangeInput([
        { name: "bin", from: "0", to: "5" },
        { name: "bin1", from: "15", to: "30" },
      ]),
    ).toEqual({});
  });
});
