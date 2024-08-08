import {
  buildRangeOperator,
  extractRangeValues,
  buildRangeBuckets,
  adjustDaysToYearsIfUnitsAreYears,
  adjustYearsToDaysIfUnitsAreYears,
  symmetricalRound,
  getLowerAgeYears,
  getLowerAgeFromYears,
} from "../utils";

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

    const [bucketRanges, ranges] = buildRangeBuckets(10, "days", 0, false);
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
    const [bucketRanges, ranges] = buildRangeBuckets(18, "days", -32873, false);
    expect(bucketRanges).toEqual(expectedBucketRanges);
    expect(ranges).toEqual(expectedRanges);
  });
});

test("test to build range and query in years", () => {
  const expectedBucketRanges = {
    "0.0-10.0": {
      from: 0,
      key: "0.0-10.0",
      label: "≥ 0 to < 10 years",
      to: 10,
    },
    "10.0-20.0": {
      from: 10,
      key: "10.0-20.0",
      label: "≥ 10 to < 20 years",
      to: 20,
    },
    "20.0-30.0": {
      from: 20,
      key: "20.0-30.0",
      label: "≥ 20 to < 30 years",
      to: 30,
    },
    "30.0-40.0": {
      from: 30,
      key: "30.0-40.0",
      label: "≥ 30 to < 40 years",
      to: 40,
    },
    "40.0-50.0": {
      from: 40,
      key: "40.0-50.0",
      label: "≥ 40 to < 50 years",
      to: 50,
    },
    "50.0-60.0": {
      from: 50,
      key: "50.0-60.0",
      label: "≥ 50 to < 60 years",
      to: 60,
    },
    "60.0-70.0": {
      from: 60,
      key: "60.0-70.0",
      label: "≥ 60 to < 70 years",
      to: 70,
    },
    "70.0-80.0": {
      from: 70,
      key: "70.0-80.0",
      label: "≥ 70 to < 80 years",
      to: 80,
    },
    "80.0-90.0": {
      from: 80,
      key: "80.0-90.0",
      label: "≥ 80 to < 90 years",
      to: 90,
    },
    "90.0-100.0": {
      from: 90,
      key: "90.0-100.0",
      label: "≥ 90 to < 100 years",
      to: 100,
    },
  };

  const expectedRanges = [
    {
      from: 0,
      to: 10,
    },
    {
      from: 10,
      to: 20,
    },
    {
      from: 20,
      to: 30,
    },
    {
      from: 30,
      to: 40,
    },
    {
      from: 40,
      to: 50,
    },
    {
      from: 50,
      to: 60,
    },
    {
      from: 60,
      to: 70,
    },
    {
      from: 70,
      to: 80,
    },
    {
      from: 80,
      to: 90,
    },
    {
      from: 90,
      to: 100,
    },
  ];
  const [bucketRanges, ranges] = buildRangeBuckets(10, "years", 0, true);
  expect(bucketRanges).toEqual(expectedBucketRanges);
  expect(ranges).toEqual(expectedRanges);
});

describe("test years to days conversion", () => {
  test("years to days", () => {
    expect(adjustYearsToDaysIfUnitsAreYears(2, "years", false)).toEqual(731);
    expect(adjustYearsToDaysIfUnitsAreYears(0, "years", false)).toEqual(0);
    expect(adjustYearsToDaysIfUnitsAreYears(7305, "days", false)).toEqual(7305);
    expect(adjustYearsToDaysIfUnitsAreYears(80, "years", false)).toEqual(29220);
    expect(adjustYearsToDaysIfUnitsAreYears(-90, "years", false)).toEqual(
      -32873,
    );
    expect(adjustYearsToDaysIfUnitsAreYears(-70, "years", false)).toEqual(
      -25568,
    );
    expect(adjustYearsToDaysIfUnitsAreYears(90, "years", false)).toEqual(32873);
  });
});

describe("test days to years conversion", () => {
  test("days to years", () => {
    expect(adjustDaysToYearsIfUnitsAreYears(365, "years", false)).toEqual(1);
    expect(adjustDaysToYearsIfUnitsAreYears(182, "years", false)).toEqual(0);
    expect(adjustDaysToYearsIfUnitsAreYears(183, "years", false)).toEqual(1);
    expect(adjustDaysToYearsIfUnitsAreYears(364, "days", false)).toEqual(364);
    expect(adjustDaysToYearsIfUnitsAreYears(730, "years", false)).toEqual(2);
    expect(adjustDaysToYearsIfUnitsAreYears(36500, "years", false)).toEqual(
      100,
    );
    expect(adjustDaysToYearsIfUnitsAreYears(32873, "years", false)).toEqual(90);
    expect(adjustDaysToYearsIfUnitsAreYears(-25568, "years", false)).toEqual(
      -70,
    );
    expect(adjustDaysToYearsIfUnitsAreYears(-32873, "days", false)).toEqual(
      -32873,
    );

    expect(adjustDaysToYearsIfUnitsAreYears(0, "range", false)).toEqual(0);
    expect(adjustDaysToYearsIfUnitsAreYears(1, "range", false)).toEqual(1);
    expect(adjustDaysToYearsIfUnitsAreYears(-10, "range", false)).toEqual(-10);
    expect(adjustDaysToYearsIfUnitsAreYears(300, "range", false)).toEqual(300);

    expect(adjustDaysToYearsIfUnitsAreYears(20, "age", false)).toEqual(20);
    expect(adjustDaysToYearsIfUnitsAreYears(100, "age", false)).toEqual(100);
    expect(adjustDaysToYearsIfUnitsAreYears(0, "age", false)).toEqual(0);
    expect(adjustDaysToYearsIfUnitsAreYears(-999, "age", false)).toEqual(-999);

    expect(adjustDaysToYearsIfUnitsAreYears(1980, "year", false)).toEqual(1980);
    expect(adjustDaysToYearsIfUnitsAreYears(2000, "year", false)).toEqual(2000);
    expect(adjustDaysToYearsIfUnitsAreYears(0, "year", false)).toEqual(0);
    expect(adjustDaysToYearsIfUnitsAreYears(-50, "year", false)).toEqual(-50);

    expect(adjustDaysToYearsIfUnitsAreYears(50, "percent", false)).toEqual(50);
    expect(adjustDaysToYearsIfUnitsAreYears(-50, "percent", false)).toEqual(
      -50,
    );
    expect(adjustDaysToYearsIfUnitsAreYears(0, "percent", false)).toEqual(0);
    expect(adjustDaysToYearsIfUnitsAreYears(100, "percent", false)).toEqual(
      100,
    );
  });

  test("don't adjust years if the query expects years", () => {
    expect(adjustDaysToYearsIfUnitsAreYears(365, "years", true)).toEqual(365);
    expect(adjustDaysToYearsIfUnitsAreYears(182, "years", true)).toEqual(182);
    expect(adjustDaysToYearsIfUnitsAreYears(183, "years", true)).toEqual(183);
    expect(adjustDaysToYearsIfUnitsAreYears(730, "years", true)).toEqual(730);
    expect(adjustDaysToYearsIfUnitsAreYears(36500, "years", true)).toEqual(
      36500,
    );
  });

  test("symmetricalRound", () => {
    expect(symmetricalRound(4.5)).toBe(5);
    expect(symmetricalRound(-4.5)).toBe(-5);
    expect(symmetricalRound(4.4)).toBe(4);
    expect(symmetricalRound(-4.4)).toBe(-4);
  });

  test("getLowerAgeYears", () => {
    expect(getLowerAgeYears(730.5)).toBe(2);
    expect(getLowerAgeYears(undefined)).toBeUndefined();
    expect(getLowerAgeYears(365.25)).toBe(1);
  });

  test("getLowerAgeFromYears", () => {
    expect(getLowerAgeFromYears(2)).toBe(731);
    expect(getLowerAgeFromYears(undefined)).toBeUndefined();
    expect(getLowerAgeFromYears(1)).toBe(365);
  });
});
