import { buildRangeOperator, extractRangeValues } from "./utils";

describe("Build Range Tests for Numeric Ranges", () => {
  test("a closed numeric range", () => {
    const res = buildRangeOperator("diagnoses.gleason_patterns_percent", {
      from: 1.0,
      fromOp: ">",
      to: 100.2,
      toOp: "<=",
    });
    expect(res).toEqual({
      operands: [
        {
          field: "diagnoses.gleason_patterns_percent",
          operand: 1,
          operator: ">",
        },
        {
          field: "diagnoses.gleason_patterns_percent",
          operand: 100.2,
          operator: "<=",
        },
      ],
      operator: "and",
    });
  });

  test("an open from numeric range", () => {
    const res = buildRangeOperator("diagnoses.gleason_patterns_percent", {
      from: 1.033,
      fromOp: ">",
    });
    expect(res).toEqual({
      field: "diagnoses.gleason_patterns_percent",
      operand: 1.033,
      operator: ">",
    });
  });

  test("an open to numeric range", () => {
    const res = buildRangeOperator("diagnoses.gleason_patterns_percent", {
      to: 100.033,
      toOp: "<",
    });
    expect(res).toEqual({
      field: "diagnoses.gleason_patterns_percent",
      operand: 100.033,
      operator: "<",
    });
  });

  test("an empty range ", () => {
    const res = buildRangeOperator("diagnoses.gleason_patterns_percent", {
      from: undefined,
      fromOp: undefined,
    });
    expect(res).toEqual(undefined);
  });
});

describe("Build Range Tests for String Ranges", () => {
  test("a closed string range", () => {
    const res = buildRangeOperator("analysis.created_datetime", {
      from: "2003-10-03",
      fromOp: ">",
      to: "2005-03-03",
      toOp: "<=",
    });
    expect(res).toEqual({
      operands: [
        {
          field: "analysis.created_datetime",
          operand: "2003-10-03",
          operator: ">",
        },
        {
          field: "analysis.created_datetime",
          operand: "2005-03-03",
          operator: "<=",
        },
      ],
      operator: "and",
    });
  });

  test("an open from string range", () => {
    const res = buildRangeOperator("analysis.created_datetime", {
      from: "2003-10-03",
      fromOp: ">",
    });
    expect(res).toEqual({
      field: "analysis.created_datetime",
      operand: "2003-10-03",
      operator: ">",
    });
  });

  test("an open to numeric range", () => {
    const res = buildRangeOperator("analysis.created_datetime", {
      to: "2005-03-03",
      toOp: "<",
    });
    expect(res).toEqual({
      field: "analysis.created_datetime",
      operand: "2005-03-03",
      operator: "<",
    });
  });
});

describe("Extract Range tests", () => {
  test("test extract < string range", () => {
    const res = extractRangeValues({
      field: "analysis.created_datetime",
      operand: "2005-03-03",
      operator: "<",
    });
    expect(res).toEqual({
      to: "2005-03-03",
      toOp: "<",
    });
  });

  test("test extract > to string range", () => {
    const res = extractRangeValues({
      field: "analysis.created_datetime",
      operand: "2005-03-03",
      operator: ">",
    });
    expect(res).toEqual({
      from: "2005-03-03",
      fromOp: ">",
    });
  });

  test("test extract >= to string range", () => {
    const res = extractRangeValues({
      field: "analysis.created_datetime",
      operand: "2015-11-03",
      operator: ">=",
    });
    expect(res).toEqual({
      from: "2015-11-03",
      fromOp: ">=",
    });
  });

  test("test extract >= to numeric range", () => {
    const res = extractRangeValues({
      field: "analysis.created_datetime",
      operand: 0.0342,
      operator: ">=",
    });
    expect(res).toEqual({
      from: 0.0342,
      fromOp: ">=",
    });
  });

  test("test closed extract numeric range", () => {
    const res = extractRangeValues({
      operands: [
        {
          field: "diagnoses.gleason_patterns_percent",
          operand: 1,
          operator: ">",
        },
        {
          field: "diagnoses.gleason_patterns_percent",
          operand: 100.2,
          operator: "<=",
        },
      ],
      operator: "and",
    });
    expect(res).toEqual({
      from: 1,
      fromOp: ">",
      to: 100.2,
      toOp: "<=",
    });
  });
});
