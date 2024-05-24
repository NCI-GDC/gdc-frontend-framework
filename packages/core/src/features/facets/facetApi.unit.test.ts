import { GdcApiResponse } from "../gdcapi/gdcapi";
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
    });
  });
});
