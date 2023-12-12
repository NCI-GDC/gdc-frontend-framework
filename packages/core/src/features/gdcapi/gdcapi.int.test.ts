import { isArray, isObject } from "../../ts-utils";
import {
  fetchGdcCases,
  fetchGdcCasesMapping,
  fetchGdcProjects,
  fetchGdcAnnotations,
  fetchGdcEntities,
  fetchGdcFiles,
  getGdcHistory,
  FieldTypes,
  GdcApiMapping,
  isBucketsAggregation,
  isStatsAggregation,
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
         * ```json
         * {
         *   "primary_site": "any_primary_site",
         *   "samples": [
         *     {
         *       "sample_type": "any_sample_type"
         *     }
         *   ]
         * }
         * ```
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

    test("can specify sort", async () => {
      const cases = await fetchGdcCases({
        sortBy: [
          { field: "primary_site", direction: "asc" },
          { field: "case_id", direction: "desc" },
        ],
        from: 1,
      });

      expect(cases.data.hits.length).toEqual(10);

      const primary_sites = cases.data.hits.map((hit) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const gdcCase = hit as Record<string, any>;
        return gdcCase["primary_site"];
      });
      const sorted_primary_sites = [...primary_sites].sort();
      expect(primary_sites).toEqual(sorted_primary_sites);

      const case_ids = cases.data.hits.map((hit) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const gdcCase = hit as Record<string, any>;
        return gdcCase["case_id"];
      });
      // case ids should be in descending order.  ascending sort, then reverse to get descending
      const sorted_case_ids = [...case_ids].sort().reverse();
      expect(case_ids).toEqual(sorted_case_ids);
    });

    test("can specify facets", async () => {
      const cases = await fetchGdcCases({
        facets: ["primary_site", "index_date", "demographic.days_to_death"],
      });

      expect(cases.data.aggregations).toBeDefined();
      expect(
        isBucketsAggregation(cases.data.aggregations?.["primary_site"]),
      ).toBeTruthy();
      expect(
        isBucketsAggregation(cases.data.aggregations?.["index_date"]),
      ).toBeTruthy();
      expect(
        isStatsAggregation(
          cases.data.aggregations?.["demographic.days_to_death"],
        ),
      ).toBeTruthy();
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

  describe("Fetch projects", () => {
    test("can retrieve defaults", async () => {
      const projects = await fetchGdcProjects();
      expect(projects?.data?.hits?.length).toEqual(10);
      expect(projects?.data?.pagination?.count).toEqual(10);
      projects.data.hits.forEach((project) =>
        expect(project.project_id).toBeDefined(),
      );
    });
  });

  describe("Fetch annotations", () => {
    test("can retrieve defaults", async () => {
      const annotations = await fetchGdcAnnotations();
      expect(annotations?.data?.hits?.length).toEqual(10);
      expect(annotations?.data?.pagination?.count).toEqual(10);
      expect(annotations?.data?.pagination?.total).toBeDefined();
    });
  });

  describe("Get History", () => {
    test("can retrieve defaults", async () => {
      const history = await getGdcHistory(
        "ab641fde-b700-4880-b4cd-bcee86f8e598",
      );
      expect(history?.length).toEqual(1);
      expect(history?.[0].uuid).toEqual("ab641fde-b700-4880-b4cd-bcee86f8e598");
      expect(history?.[0].version).toEqual("1");
      expect(history?.[0].file_change).toEqual("released");
      expect(history?.[0].release_date).toEqual("2022-03-29");
      expect(history?.[0].data_release).toEqual("32.0");
    });
  });

  describe("Fetch entities", () => {
    test("does not fetch all by default", async () => {
      const entities = await fetchGdcEntities(
        "analysis/top_mutated_genes_by_project",
        {
          filters: {
            op: "in",
            content: {
              field: "genes.gene_id",
              value: ["ENSG00000141510", "ENSG00000133703"],
            },
          },
          from: 0,
          size: 1,
        },
      );
      expect(entities?.data?.hits?.length).toEqual(1);
    });

    test("can fetch all", async () => {
      const entities = await fetchGdcEntities(
        "analysis/top_mutated_genes_by_project",
        {
          filters: {
            op: "in",
            content: {
              field: "genes.gene_id",
              value: ["ENSG00000141510", "ENSG00000133703"],
            },
          },
          from: 0,
          size: 1,
        },
        true,
      );
      expect(entities?.data?.hits?.length).toBeGreaterThan(1);
    });
  });

  describe("Fetch files", () => {
    test("can retrieve defaults", async () => {
      const projects = await fetchGdcFiles();
      expect(projects?.data?.hits?.length).toEqual(10);
      expect(projects?.data?.pagination?.count).toEqual(10);
      projects.data.hits.forEach((project) => expect(project.id).toBeDefined());
    });
  });
});
