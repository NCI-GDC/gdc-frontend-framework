import { GdcApiRequest } from "./types";
import {
  buildFetchError,
  isBucketsAggregation,
  isStatsAggregation,
} from "./utils";

describe("GDC API Utilities", () => {
  describe("isBucketsAggregation", () => {
    test("returns true for valid buckets aggregation", () => {
      const buckets = { buckets: [{ key: "test", doc_count: 10 }] };
      expect(isBucketsAggregation(buckets)).toBeTruthy();
    });

    test("returns false for non-buckets data", () => {
      expect(isBucketsAggregation(null)).toBeFalsy();
      expect(isBucketsAggregation({})).toBeFalsy();
      expect(isBucketsAggregation({ stats: {} })).toBeFalsy();
    });
  });

  describe("isStatsAggregation", () => {
    test("returns true for valid stats aggregation", () => {
      const stats = {
        stats: { count: 10, sum: 100, min: 1, max: 20, avg: 10 },
      };
      expect(isStatsAggregation(stats)).toBeTruthy();
    });

    test("returns false for non-stats data", () => {
      expect(isStatsAggregation(null)).toBeFalsy();
      expect(isStatsAggregation({})).toBeFalsy();
      expect(isStatsAggregation({ buckets: [] })).toBeFalsy();
    });
  });

  describe("buildFetchError", () => {
    test("builds error object from response", async () => {
      const mockResponse = {
        url: "https://gdc.gov/testurl",
        status: 404,
        statusText: "Not Found",
        text: jest.fn().mockResolvedValue("Resource not found"),
      };

      const error = await buildFetchError(mockResponse as unknown as Response);

      expect(error).toEqual({
        url: "https://gdc.gov/testurl",
        status: 404,
        statusText: "Not Found",
        text: "Resource not found",
      });
    });

    test("includes request info when provided", async () => {
      const mockResponse = {
        url: "https://gdc.gov/testurl",
        status: 500,
        statusText: "Server Error",
        text: jest.fn().mockResolvedValue("Internal server error"),
      };

      const mockRequest = {
        filters: { op: "=", content: { field: "test", value: "value" } },
      };

      const error = await buildFetchError(
        mockResponse as unknown as Response,
        mockRequest as GdcApiRequest,
      );

      expect(error.gdcApiReq).toEqual(mockRequest);
    });
  });
});
