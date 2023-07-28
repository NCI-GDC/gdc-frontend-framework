import {
  createBuckets,
  filterUsefulFacets,
  parseFieldName,
  qnorm,
  toDisplayName,
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
