import {
  buildRangeOperator,
  extractRangeValues,
  buildRangeBuckets,
  adjustYearsToDays,
  adjustDaysToYears,
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
      "0.0-3653.0": {
        from: 0,
        key: "0.0-3653.0",
        label: "≥ 0 to < 3653 days",
        to: 3653,
      },
      "10958.0-14610.0": {
        from: 10958,
        key: "10958.0-14610.0",
        label: "≥ 10958 to < 14610 days",
        to: 14610,
      },
      "14610.0-18263.0": {
        from: 14610,
        key: "14610.0-18263.0",
        label: "≥ 14610 to < 18263 days",
        to: 18263,
      },
      "18263.0-21915.0": {
        from: 18263,
        key: "18263.0-21915.0",
        label: "≥ 18263 to < 21915 days",
        to: 21915,
      },
      "21915.0-25568.0": {
        from: 21915,
        key: "21915.0-25568.0",
        label: "≥ 21915 to < 25568 days",
        to: 25568,
      },
      "25568.0-29220.0": {
        from: 25568,
        key: "25568.0-29220.0",
        label: "≥ 25568 to < 29220 days",
        to: 29220,
      },
      "29220.0-32873.0": {
        from: 29220,
        key: "29220.0-32873.0",
        label: "≥ 29220 to < 32873 days",
        to: 32873,
      },
      "32873.0-36525.0": {
        from: 32873,
        key: "32873.0-36525.0",
        label: "≥ 32873 to < 36525 days",
        to: 36525,
      },
      "3653.0-7305.0": {
        from: 3653,
        key: "3653.0-7305.0",
        label: "≥ 3653 to < 7305 days",
        to: 7305,
      },
      "7305.0-10958.0": {
        from: 7305,
        key: "7305.0-10958.0",
        label: "≥ 7305 to < 10958 days",
        to: 10958,
      },
    };
    const expectedRanges = [
      {
        from: 0,
        to: 3653,
      },
      {
        from: 3653,
        to: 7305,
      },
      {
        from: 7305,
        to: 10958,
      },
      {
        from: 10958,
        to: 14610,
      },
      {
        from: 14610,
        to: 18263,
      },
      {
        from: 18263,
        to: 21915,
      },
      {
        from: 21915,
        to: 25568,
      },
      {
        from: 25568,
        to: 29220,
      },
      {
        from: 29220,
        to: 32873,
      },
      {
        from: 32873,
        to: 36525,
      },
    ];

    const [bucketRanges, ranges] = buildRangeBuckets(10, "days", 0);
    expect(bucketRanges).toEqual(expectedBucketRanges);
    expect(ranges).toEqual(expectedRanges);
  });

  test("test to build -90/90 years range", () => {
    const expectedBucketRanges = {
      "-10958.0--7305.0": {
        from: -10958,
        key: "-10958.0--7305.0",
        label: "≥ -10958 to < -7305 days",
        to: -7305,
      },
      "-14610.0--10958.0": {
        from: -14610,
        key: "-14610.0--10958.0",
        label: "≥ -14610 to < -10958 days",
        to: -10958,
      },
      "-18263.0--14610.0": {
        from: -18263,
        key: "-18263.0--14610.0",
        label: "≥ -18263 to < -14610 days",
        to: -14610,
      },
      "-21915.0--18263.0": {
        from: -21915,
        key: "-21915.0--18263.0",
        label: "≥ -21915 to < -18263 days",
        to: -18263,
      },
      "-25568.0--21915.0": {
        from: -25568,
        key: "-25568.0--21915.0",
        label: "≥ -25568 to < -21915 days",
        to: -21915,
      },
      "-29220.0--25568.0": {
        from: -29220,
        key: "-29220.0--25568.0",
        label: "≥ -29220 to < -25568 days",
        to: -25568,
      },
      "-32873.0--29220.0": {
        from: -32873,
        key: "-32873.0--29220.0",
        label: "≥ -32873 to < -29220 days",
        to: -29220,
      },
      "-3653.0-0.0": {
        from: -3653,
        key: "-3653.0-0.0",
        label: "≥ -3653 to < 0 days",
        to: 0,
      },
      "-7305.0--3653.0": {
        from: -7305,
        key: "-7305.0--3653.0",
        label: "≥ -7305 to < -3653 days",
        to: -3653,
      },
      "0.0-3653.0": {
        from: 0,
        key: "0.0-3653.0",
        label: "≥ 0 to < 3653 days",
        to: 3653,
      },
      "10958.0-14610.0": {
        from: 10958,
        key: "10958.0-14610.0",
        label: "≥ 10958 to < 14610 days",
        to: 14610,
      },
      "14610.0-18263.0": {
        from: 14610,
        key: "14610.0-18263.0",
        label: "≥ 14610 to < 18263 days",
        to: 18263,
      },
      "18263.0-21915.0": {
        from: 18263,
        key: "18263.0-21915.0",
        label: "≥ 18263 to < 21915 days",
        to: 21915,
      },
      "21915.0-25568.0": {
        from: 21915,
        key: "21915.0-25568.0",
        label: "≥ 21915 to < 25568 days",
        to: 25568,
      },
      "25568.0-29220.0": {
        from: 25568,
        key: "25568.0-29220.0",
        label: "≥ 25568 to < 29220 days",
        to: 29220,
      },
      "29220.0-32873.0": {
        from: 29220,
        key: "29220.0-32873.0",
        label: "≥ 29220 to < 32873 days",
        to: 32873,
      },
      "3653.0-7305.0": {
        from: 3653,
        key: "3653.0-7305.0",
        label: "≥ 3653 to < 7305 days",
        to: 7305,
      },
      "7305.0-10958.0": {
        from: 7305,
        key: "7305.0-10958.0",
        label: "≥ 7305 to < 10958 days",
        to: 10958,
      },
    };
    const expectedRanges = [
      {
        from: -32873,
        to: -29220,
      },
      {
        from: -29220,
        to: -25568,
      },
      {
        from: -25568,
        to: -21915,
      },
      {
        from: -21915,
        to: -18263,
      },
      {
        from: -18263,
        to: -14610,
      },
      {
        from: -14610,
        to: -10958,
      },
      {
        from: -10958,
        to: -7305,
      },
      {
        from: -7305,
        to: -3653,
      },
      {
        from: -3653,
        to: 0,
      },
      {
        from: 0,
        to: 3653,
      },
      {
        from: 3653,
        to: 7305,
      },
      {
        from: 7305,
        to: 10958,
      },
      {
        from: 10958,
        to: 14610,
      },
      {
        from: 14610,
        to: 18263,
      },
      {
        from: 18263,
        to: 21915,
      },
      {
        from: 21915,
        to: 25568,
      },
      {
        from: 25568,
        to: 29220,
      },
      {
        from: 29220,
        to: 32873,
      },
    ];
    const [bucketRanges, ranges] = buildRangeBuckets(18, "days", -32873);
    expect(bucketRanges).toEqual(expectedBucketRanges);
    expect(ranges).toEqual(expectedRanges);
  });
});

describe("test years to days conversion", () => {
  test("years to days", () => {
    expect(adjustYearsToDays(2, "years")).toEqual(731);
    expect(adjustYearsToDays(0, "years")).toEqual(0);
    expect(adjustYearsToDays(7305, "days")).toEqual(7305);
    expect(adjustYearsToDays(80, "years")).toEqual(29220);
    expect(adjustYearsToDays(-90, "years")).toEqual(-32873);
    expect(adjustYearsToDays(-70, "years")).toEqual(-25568);
    expect(adjustYearsToDays(90, "years")).toEqual(32873);
  });
});

describe("test days to years conversion", () => {
  test("days to years", () => {
    expect(adjustDaysToYears(365, "years")).toEqual(1);
    expect(adjustDaysToYears(182, "years")).toEqual(0);
    expect(adjustDaysToYears(183, "years")).toEqual(1);
    expect(adjustDaysToYears(364, "days")).toEqual(364);
    expect(adjustDaysToYears(730, "years")).toEqual(2);
    expect(adjustDaysToYears(36500, "years")).toEqual(100);
    expect(adjustDaysToYears(32873, "years")).toEqual(90);
    expect(adjustDaysToYears(-25568, "years")).toEqual(-70);
    expect(adjustYearsToDays(-32873, "days")).toEqual(-32873);
  });
});
