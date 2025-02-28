import { fetchGdcCases, fetchGdcEntities } from ".";

global.fetch = jest.fn();
jest.mock("src/constants", () => ({
  GDC_APP_API_AUTH: "https://gdc.gov",
}));

jest.mock("queue", () => {
  return jest.fn().mockImplementation(() => {
    return {
      push: jest.fn((task) => {
        task(() => {});
      }),
      start: jest.fn((callback) => {
        callback();
      }),
    };
  });
});
jest.mock("blueimp-md5", () => jest.fn(() => "mock-hash"));

describe("Request Building Logic", () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({ data: { hits: [], pagination: {} }, warnings: {} }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("correctly formats sortBy parameters", async () => {
    await fetchGdcEntities("cases", {
      sortBy: [
        { field: "primary_site", direction: "asc" },
        { field: "case_id", direction: "desc" },
      ],
    });

    const [, options] = (global.fetch as jest.Mock).mock.calls[0];
    const requestBody = JSON.parse(options.body);

    expect(requestBody.sort).toBe("primary_site:asc,case_id:desc");
  });

  test("correctly formats fields parameter", async () => {
    await fetchGdcEntities("cases", {
      fields: ["case_id", "primary_site", "disease_type"],
    });

    const [, options] = (global.fetch as jest.Mock).mock.calls[0];
    const requestBody = JSON.parse(options.body);

    expect(requestBody.fields).toBe("case_id,primary_site,disease_type");
  });

  test("correctly formats expand parameter", async () => {
    await fetchGdcEntities("cases", {
      expand: ["samples", "project.program"],
    });

    const [, options] = (global.fetch as jest.Mock).mock.calls[0];
    const requestBody = JSON.parse(options.body);

    expect(requestBody.expand).toBe("samples,project.program");
  });

  test("correctly formats facets parameter", async () => {
    await fetchGdcEntities("cases", {
      facets: ["primary_site", "disease_type"],
    });

    const [, options] = (global.fetch as jest.Mock).mock.calls[0];
    const requestBody = JSON.parse(options.body);

    expect(requestBody.facets).toBe("primary_site,disease_type");
  });

  test("correctly sets pagination parameters", async () => {
    await fetchGdcEntities("cases", {
      from: 20,
      size: 50,
    });

    const [, options] = (global.fetch as jest.Mock).mock.calls[0];
    const requestBody = JSON.parse(options.body);

    expect(requestBody.from).toBe(20);
    expect(requestBody.size).toBe(50);
  });

  test("correctly sets default pagination parameters", async () => {
    await fetchGdcEntities("cases", {
      from: 20,
    });

    const [, options] = (global.fetch as jest.Mock).mock.calls[0];
    const requestBody = JSON.parse(options.body);

    expect(requestBody.from).toBe(20);
    expect(requestBody.size).toBe(10);
  });
});

describe("Error Handling", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("handles network errors", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Network error"),
    );

    await expect(fetchGdcCases()).rejects.toThrow("Network error");
  });

  test("handles API errors", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      url: "https://gdc.gov/cases",
      status: 400,
      statusText: "Bad Request",
      text: jest
        .fn()
        .mockResolvedValue(JSON.stringify({ error: "Invalid request" })),
    });

    try {
      await fetchGdcCases();
      fail("Should have thrown an error");
    } catch (error) {
      expect(error).toHaveProperty("url", "https://gdc.gov/cases");
      expect(error).toHaveProperty("status", 400);
      expect(error).toHaveProperty("statusText", "Bad Request");
      expect(error).toHaveProperty(
        "text",
        JSON.stringify({ error: "Invalid request" }),
      );
    }
  });
});

describe("Batch processing tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("single fetch when fetchAll is false", async () => {
    const mockResponse = {
      ok: true,
      json: () =>
        Promise.resolve({
          data: {
            hits: [{ id: "1" }, { id: "2" }],
            pagination: { total: 2 },
          },
        }),
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = await fetchGdcEntities("cases", { fields: ["id"] }, false);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(result.data.hits).toEqual([{ id: "1" }, { id: "2" }]);
  });

  test("multiple fetches when fetchAll is true", async () => {
    const firstResponse = {
      ok: true,
      json: () =>
        Promise.resolve({
          data: {
            hits: [{ id: "1" }, { id: "2" }],
            pagination: { total: 250 },
          },
        }),
    };

    const secondResponse = {
      ok: true,
      json: () =>
        Promise.resolve({
          data: {
            hits: [{ id: "3" }, { id: "4" }],
            pagination: { total: 250 },
          },
        }),
    };

    const thirdResponse = {
      ok: true,
      json: () =>
        Promise.resolve({
          data: {
            hits: [{ id: "5" }, { id: "6" }],
            pagination: { total: 250 },
          },
        }),
    };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce(firstResponse)
      .mockResolvedValueOnce(secondResponse)
      .mockResolvedValueOnce(thirdResponse);

    await fetchGdcEntities("cases", { fields: ["id"], size: 100 }, true);

    expect(global.fetch).toHaveBeenCalledTimes(3);

    expect((global.fetch as jest.Mock).mock.calls[0][0]).toBe(
      "https://gdc.gov/cases",
    );

    const secondCallParams = JSON.parse(
      (global.fetch as jest.Mock).mock.calls[1][1].body,
    );
    expect(secondCallParams.from).toBe(100);

    const thirdCallParams = JSON.parse(
      (global.fetch as jest.Mock).mock.calls[2][1].body,
    );
    expect(thirdCallParams.from).toBe(200);
  });
});
