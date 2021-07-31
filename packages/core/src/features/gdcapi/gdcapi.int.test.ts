import {
  fetchGdcCases,
  fetchGdcCasesMapping,
  FieldTypes,
  GdcApiMapping,
} from "./gdcapi";

describe("GDC API", () => {
  describe("Fetch cases", () => {
    test("can retrieve defaults", async () => {
      const cases = await fetchGdcCases();
      expect(cases?.data?.hits?.length).toEqual(10);
      expect(cases?.data?.pagination?.count).toEqual(10);
    });

    test("can specify size", async () => {
      const cases = await fetchGdcCases({
        size: 1,
      });
      expect(cases?.data?.hits?.length).toEqual(1);
      expect(cases?.data?.pagination?.count).toEqual(1);
    });
  });

  describe("Fetch cases mapping", () => {
    let mapping: GdcApiMapping;

    beforeAll(async () => {
      mapping = await fetchGdcCasesMapping();
    });

    test("should return mapping", () => {
      expect(mapping).toBeDefined();
    });

    test("should define field details", () => {
      expect(Object.keys(mapping?._mapping).length).toBeGreaterThan(0);
    });

    test("should define known types", () => {
      Object.keys(mapping._mapping).forEach((key) => {
        expect(FieldTypes).toContain(mapping?._mapping?.[key]?.type);
      });
    });

    test("should define defaults", () => {
      expect(mapping?.defaults?.length).toBeGreaterThan(0);
    });

    test("should define fields", () => {
      expect(mapping?.fields?.length).toBeGreaterThan(0);
    });
  });
});
