import { isArray, isObject } from "../../ts-utils";
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

    test("can specify fields", async () => {
      const cases = await fetchGdcCases({
        fields: ["primary_site", "samples.sample_type"],
      });
      expect(cases?.data?.hits?.length).toEqual(10);
      cases?.data?.hits?.forEach((gdcCase) => {
        /**
         * The following code is pretty nasty. It's trying to verify that
         * the hit looks like:
         * {
         *   "primary_site": "any_primary_site",
         *   "samples": [
         *     {
         *       "sample_type": "any_sample_type"
         *     }
         *   ]
         * }
         *
         * The issue is that the hit type is `unknown`. So, we need to
         * use type guards to access each level of the object.
         *
         * We could get around this by generating an interface from each
         * endpoint mapping.
         */
        if (isObject(gdcCase)) {
          expect("primary_site" in gdcCase).toBeTruthy();
          expect("samples" in gdcCase).toBeTruthy();
          if (isArray(gdcCase["samples"])) {
            if (isObject(gdcCase["samples"][0])) {
              expect("sample_type" in gdcCase["samples"][0]).toBeTruthy();
            } else {
              fail(`first sample is not an object in ${gdcCase}`);
            }
          } else {
            fail(`samples is not an array in ${gdcCase}`);
          }
        } else {
          fail(`case is not an object ${gdcCase}`);
        }
      });
    });

    test("can specify filters", async () => {
      const cases = await fetchGdcCases({
        filters: {
          op: "=",
          content: {
            field: "primary_site",
            value: "Brain",
          },
        },
      });

      expect(cases.data.hits.length).toEqual(10);
      cases.data.hits.forEach((gdcCase) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const c = gdcCase as any;
        expect(c["primary_site"]).toEqual("Brain");
      });
    });

    test("can specify expands", async () => {
      const cases = await fetchGdcCases({
        expand: ["samples", "project.program"],
      });

      expect(cases.data.hits.length).toEqual(10);
      cases.data.hits.forEach((hit) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const gdcCase = hit as Record<string, any>;
        // checking the existence of required fields per expanded node type.
        // required fields are defined by the gdc dictionary
        expect(gdcCase.project.program.name).toBeDefined();
        expect(gdcCase.project.program.program_id).toBeDefined();
        expect(gdcCase.project.program.dbgap_accession_number).toBeDefined();
        expect(gdcCase.samples[0].submitter_id).toBeDefined();
        expect(gdcCase.samples[0].sample_id).toBeDefined();
        expect(gdcCase.samples[0].sample_type).toBeDefined();
        expect(gdcCase.samples[0].tissue_type).toBeDefined();
      });
    });

    test.skip("can specify format", async () => {
      // TODO the underlying fetch code will fail when it tries to return json.
      // update the fetch to check the content type header to decide what to return.
      const cases = await fetchGdcCases({
        format: "TSV",
      });

      console.log(cases);
      expect(cases).toBeDefined();
    });

    test.skip("can specify pretty", async () => {
      fail("not implemented yet");
    });

    test("can specify from", async () => {
      const cases = await fetchGdcCases({
        from: 100,
      });

      expect(cases.data.hits.length).toEqual(10);

      expect(cases.data.pagination.count).toEqual(10);
      expect(cases.data.pagination.from).toEqual(100);
    });

    test.skip("can specify sort", async () => {
      fail("not implemented yet");
    });

    test.skip("can specify facets", async () => {
      fail("not implemented yet");
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
