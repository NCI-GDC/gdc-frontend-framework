import {
  buildRangeOperator,
  extractRangeValues,
  buildRangeBuckets,
  adjustAgeRange,
} from "./utils";

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

describe("Build Bucket Range Test", () => {
  test("test to build positive days range", () => {
    const expectedBucketRanges = {
      "0.0-3652.5": {
        from: 0,
        key: "0.0-3652.5",
        label: "≥ 0.0 to < 3652.5 days",
        to: 3652.5,
      },
      "10957.5-14610.0": {
        from: 10957.5,
        key: "10957.5-14610.0",
        label: "≥ 10957.5 to < 14610.0 days",
        to: 14610,
      },
      "14610.0-18262.5": {
        from: 14610,
        key: "14610.0-18262.5",
        label: "≥ 14610.0 to < 18262.5 days",
        to: 18262.5,
      },
      "18262.5-21915.0": {
        from: 18262.5,
        key: "18262.5-21915.0",
        label: "≥ 18262.5 to < 21915.0 days",
        to: 21915,
      },
      "21915.0-25567.5": {
        from: 21915,
        key: "21915.0-25567.5",
        label: "≥ 21915.0 to < 25567.5 days",
        to: 25567.5,
      },
      "25567.5-29220.0": {
        from: 25567.5,
        key: "25567.5-29220.0",
        label: "≥ 25567.5 to < 29220.0 days",
        to: 29220,
      },
      "29220.0-32872.5": {
        from: 29220,
        key: "29220.0-32872.5",
        label: "≥ 29220.0 to < 32872.5 days",
        to: 32872.5,
      },
      "32872.5-36525.0": {
        from: 32872.5,
        key: "32872.5-36525.0",
        label: "≥ 32872.5 to < 36525.0 days",
        to: 36525,
      },
      "3652.5-7305.0": {
        from: 3652.5,
        key: "3652.5-7305.0",
        label: "≥ 3652.5 to < 7305.0 days",
        to: 7305,
      },
      "7305.0-10957.5": {
        from: 7305,
        key: "7305.0-10957.5",
        label: "≥ 7305.0 to < 10957.5 days",
        to: 10957.5,
      },
    };
    const expectedRanges = [
      {
        from: 0,
        to: 3652.5,
      },
      {
        from: 3652.5,
        to: 7305,
      },
      {
        from: 7305,
        to: 10957.5,
      },
      {
        from: 10957.5,
        to: 14610,
      },
      {
        from: 14610,
        to: 18262.5,
      },
      {
        from: 18262.5,
        to: 21915,
      },
      {
        from: 21915,
        to: 25567.5,
      },
      {
        from: 25567.5,
        to: 29220,
      },
      {
        from: 29220,
        to: 32872.5,
      },
      {
        from: 32872.5,
        to: 36525,
      },
    ];

    const [bucketRanges, ranges] = buildRangeBuckets(10, "days", 0);
    expect(bucketRanges).toEqual(expectedBucketRanges);
    expect(ranges).toEqual(expectedRanges);
  });

  test("test to build -90/90 years range", () => {
    const expectedBucketRanges = {
      "-32872.5--29220.0": {
        from: -32872.5,
        to: -29220,
        key: "-32872.5--29220.0",
        label: "≥ -32872.5 to < -29220.0 days",
      },
      "-29220.0--25567.5": {
        from: -29220,
        to: -25567.5,
        key: "-29220.0--25567.5",
        label: "≥ -29220.0 to < -25567.5 days",
      },
      "-25567.5--21915.0": {
        from: -25567.5,
        to: -21915,
        key: "-25567.5--21915.0",
        label: "≥ -25567.5 to < -21915.0 days",
      },
      "-21915.0--18262.5": {
        from: -21915,
        to: -18262.5,
        key: "-21915.0--18262.5",
        label: "≥ -21915.0 to < -18262.5 days",
      },
      "-18262.5--14610.0": {
        from: -18262.5,
        to: -14610,
        key: "-18262.5--14610.0",
        label: "≥ -18262.5 to < -14610.0 days",
      },
      "-14610.0--10957.5": {
        from: -14610,
        to: -10957.5,
        key: "-14610.0--10957.5",
        label: "≥ -14610.0 to < -10957.5 days",
      },
      "-10957.5--7305.0": {
        from: -10957.5,
        to: -7305,
        key: "-10957.5--7305.0",
        label: "≥ -10957.5 to < -7305.0 days",
      },
      "-7305.0--3652.5": {
        from: -7305,
        to: -3652.5,
        key: "-7305.0--3652.5",
        label: "≥ -7305.0 to < -3652.5 days",
      },
      "-3652.5-0.0": {
        from: -3652.5,
        to: 0,
        key: "-3652.5-0.0",
        label: "≥ -3652.5 to < 0.0 days",
      },
      "0.0-3652.5": {
        from: 0,
        to: 3652.5,
        key: "0.0-3652.5",
        label: "≥ 0.0 to < 3652.5 days",
      },
      "3652.5-7305.0": {
        from: 3652.5,
        to: 7305,
        key: "3652.5-7305.0",
        label: "≥ 3652.5 to < 7305.0 days",
      },
      "7305.0-10957.5": {
        from: 7305,
        to: 10957.5,
        key: "7305.0-10957.5",
        label: "≥ 7305.0 to < 10957.5 days",
      },
      "10957.5-14610.0": {
        from: 10957.5,
        to: 14610,
        key: "10957.5-14610.0",
        label: "≥ 10957.5 to < 14610.0 days",
      },
      "14610.0-18262.5": {
        from: 14610,
        to: 18262.5,
        key: "14610.0-18262.5",
        label: "≥ 14610.0 to < 18262.5 days",
      },
      "18262.5-21915.0": {
        from: 18262.5,
        to: 21915,
        key: "18262.5-21915.0",
        label: "≥ 18262.5 to < 21915.0 days",
      },
      "21915.0-25567.5": {
        from: 21915,
        to: 25567.5,
        key: "21915.0-25567.5",
        label: "≥ 21915.0 to < 25567.5 days",
      },
      "25567.5-29220.0": {
        from: 25567.5,
        to: 29220,
        key: "25567.5-29220.0",
        label: "≥ 25567.5 to < 29220.0 days",
      },
      "29220.0-32872.5": {
        from: 29220,
        to: 32872.5,
        key: "29220.0-32872.5",
        label: "≥ 29220.0 to < 32872.5 days",
      },
      "32872.5-36525.0": {
        from: 32872.5,
        to: 36525,
        key: "32872.5-36525.0",
        label: "≥ 32872.5 to < 36525.0 days",
      },
    };
    const expectedRanges = [
      {
        from: -32872.5,
        to: -29220,
      },
      {
        from: -29220,
        to: -25567.5,
      },
      {
        from: -25567.5,
        to: -21915,
      },
      {
        from: -21915,
        to: -18262.5,
      },
      {
        from: -18262.5,
        to: -14610,
      },
      {
        from: -14610,
        to: -10957.5,
      },
      {
        from: -10957.5,
        to: -7305,
      },
      {
        from: -7305,
        to: -3652.5,
      },
      {
        from: -3652.5,
        to: 0,
      },
      {
        from: 0,
        to: 3652.5,
      },
      {
        from: 3652.5,
        to: 7305,
      },
      {
        from: 7305,
        to: 10957.5,
      },
      {
        from: 10957.5,
        to: 14610,
      },
      {
        from: 14610,
        to: 18262.5,
      },
      {
        from: 18262.5,
        to: 21915,
      },
      {
        from: 21915,
        to: 25567.5,
      },
      {
        from: 25567.5,
        to: 29220,
      },
      {
        from: 29220,
        to: 32872.5,
      },
      {
        from: 32872.5,
        to: 36525,
      },
    ];
    const [bucketRanges, ranges] = buildRangeBuckets(19, "days", -32872.5);
    expect(bucketRanges).toEqual(expectedBucketRanges);
    expect(ranges).toEqual(expectedRanges);
  });
});

describe("test adjust age range", () => {
  test("testing all age ranges", () => {
    expect(adjustAgeRange("<", 14974, "years")).toEqual(14610);
    expect(adjustAgeRange("<=", 14974, "years")).toEqual(14974);
    expect(adjustAgeRange("<=", 7305, "years")).toEqual(7305);
    expect(adjustAgeRange(">", 7305, "years")).toEqual(7305);
    expect(adjustAgeRange(">=", 6940, "years")).toEqual(6940);
  });
});
