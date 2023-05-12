import { validateIntervalInput, validateRangeInput } from "./validateInputs";

describe("validateInputs", () => {
  it("validate interval size input", () => {
    expect(validateIntervalInput("", "5", "10")).toEqual({
      setIntervalSize: "Required field",
    });
    expect(validateIntervalInput("fhqwhgads", "5", "10")).toEqual({
      setIntervalSize: "fhqwhgads is not a valid number",
    });
    expect(validateIntervalInput("1.22222", "5", "10")).toEqual({
      setIntervalSize: "Use up to 2 decimal places",
    });
    expect(validateIntervalInput("-1", "5", "10")).toEqual({
      setIntervalSize: "Must be greater than 0",
    });
    expect(validateIntervalInput("7", "5", "10")).toEqual({
      setIntervalSize: "Must be less than or equal to 5",
    });
    expect(validateIntervalInput("1", "5", "10")).toEqual({});
  });

  it("validate min input", () => {
    expect(validateIntervalInput("1", "", "10")).toEqual({
      setIntervalMin: "Required field",
    });
    expect(validateIntervalInput("1", "blargh", "10")).toEqual({
      setIntervalMin: "blargh is not a valid number",
    });
    expect(validateIntervalInput("1", "2.5252", "10")).toEqual({
      setIntervalMin: "Use up to 2 decimal places",
    });
    expect(validateIntervalInput("1", "15", "10")).toEqual({
      setIntervalMin: "Must be less than 10",
      setIntervalMax: "Must be greater than 15",
    });
  });

  it("validate max input", () => {
    expect(validateIntervalInput("1", "10", "")).toEqual({
      setIntervalMax: "Required field",
    });
    expect(validateIntervalInput("1", "10", "mmm")).toEqual({
      setIntervalMax: "mmm is not a valid number",
    });
    expect(validateIntervalInput("1", "0", "2.0001")).toEqual({
      setIntervalMax: "Use up to 2 decimal places",
    });
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
        { name: "bin   ", from: "20", to: "30" },
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
      "ranges.0.name": "'bin' overlaps with 'bin1'",
      "ranges.1.name": "'bin1' overlaps with 'bin'",
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
