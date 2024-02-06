import {
  Buckets,
  GdcApiResponse,
  isBucketsAggregation,
  isStatsAggregation,
  Statistics,
} from "../gdcapi/gdcapi";
import { fetchFacetByNameRestApi } from "./facetApi";

describe("facetApi", () => {
  describe("fetchFacetByName", () => {
    describe("enum facet", () => {
      let facet: GdcApiResponse<never>;

      beforeAll(async () => {
        facet = await fetchFacetByNameRestApi("primary_site");
      });

      test("should contain no hits", () => {
        expect(facet?.data?.hits).toEqual([]);
      });

      test("should contain no errors", () => {
        expect(facet?.warnings).toEqual({});
      });

      test("should have aggregations", () => {
        expect(facet?.data?.aggregations).toBeDefined();
      });

      test("should be bucket aggregations", () => {
        if (facet?.data?.aggregations?.primary_site) {
          expect(
            isBucketsAggregation(facet?.data?.aggregations?.primary_site),
          ).toBeTruthy();
        } else {
          fail("aggregations should have been defined");
        }
      });

      describe("buckets", () => {
        let buckets: Buckets;

        beforeAll(() => {
          const agg = facet?.data?.aggregations?.primary_site;
          if (agg && isBucketsAggregation(agg)) {
            buckets = agg;
          }
        });

        test("should all have names", () => {
          buckets.buckets.forEach((bucket) => {
            expect(bucket.key).toBeDefined();
          });
        });

        test("should all have non-negative counts", () => {
          buckets.buckets.forEach((bucket) => {
            expect(bucket.doc_count).toBeGreaterThanOrEqual(0);
          });
        });
      });
    });

    describe("numeric facet", () => {
      let facet: GdcApiResponse<never>;

      beforeAll(async () => {
        facet = await fetchFacetByNameRestApi("demographic.days_to_death");
      });

      test("should contain no hits", () => {
        expect(facet?.data?.hits).toEqual([]);
      });

      test("should contain no errors", () => {
        expect(facet?.warnings).toEqual({});
      });

      test("should have aggregations", () => {
        expect(facet?.data?.aggregations).toBeDefined();
      });

      test("should be stats aggregations", () => {
        if (facet?.data?.aggregations?.["demographic.days_to_death"]) {
          expect(
            isStatsAggregation(
              facet?.data?.aggregations?.["demographic.days_to_death"],
            ),
          ).toBeTruthy();
        } else {
          fail("aggregations should have been defined");
        }
      });

      describe("stats", () => {
        let stats: Statistics;

        beforeAll(() => {
          const agg = facet?.data?.aggregations?.["demographic.days_to_death"];
          if (agg && isStatsAggregation(agg)) {
            stats = agg.stats;
          } else {
            fail("stats should be defined");
          }
        });

        test("should have non-negative count", () => {
          expect(stats.count).toBeGreaterThanOrEqual(0);
        });

        test("should have sum", () => {
          expect(stats.sum).toBeDefined();
        });
      });
    });
  });
});
