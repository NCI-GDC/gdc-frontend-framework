import { getFormattedTimestamp } from "../date";

describe("getFormattedTimestamp", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  const mockDateAndTest = (
    dateString: string,
    expectedWithoutTime: string,
    expectedWithTime: string,
    description: string,
  ) => {
    test(description, () => {
      const mockDate = new Date(dateString);
      jest
        .spyOn(global, "Date")
        .mockImplementation(() => mockDate as unknown as string);

      const mockIntl = jest.spyOn(Intl, "DateTimeFormat");
      mockIntl.mockImplementation(
        () =>
          ({
            resolvedOptions: () => ({ timeZone: "America/Chicago" }),
          } as any),
      );

      const resultWithoutTime = getFormattedTimestamp();
      expect(resultWithoutTime).toBe(expectedWithoutTime);

      const resultWithTime = getFormattedTimestamp({ includeTimes: true });
      expect(resultWithTime).toBe(expectedWithTime);
    });
  };

  mockDateAndTest(
    "2024-10-08T16:14:11-05:00",
    "2024-10-08",
    "2024-10-08.161411",
    "formats regular datetime correctly",
  );

  mockDateAndTest(
    "2024-09-08T04:05:06-05:00",
    "2024-09-08",
    "2024-09-08.040506",
    "handles single-digit hours/minutes/seconds",
  );

  mockDateAndTest(
    "2024-12-31T23:59:59-06:00", // -06:00 because of non-daylight savings UTC-6
    "2024-12-31",
    "2024-12-31.235959",
    "handles end of year in CST",
  );

  test("verifies format pattern", () => {
    const mockDate = new Date("2024-01-01T12:00:00-06:00");
    jest
      .spyOn(global, "Date")
      .mockImplementation(() => mockDate as unknown as string);

    const mockIntl = jest.spyOn(Intl, "DateTimeFormat");
    mockIntl.mockImplementation(
      () =>
        ({
          resolvedOptions: () => ({ timeZone: "America/Chicago" }),
        } as any),
    );

    const resultWithoutTime = getFormattedTimestamp();
    expect(resultWithoutTime).toMatch(/^\d{4}-\d{2}-\d{2}$/);

    const resultWithTime = getFormattedTimestamp({ includeTimes: true });
    expect(resultWithTime).toMatch(/^\d{4}-\d{2}-\d{2}\.\d{6}$/);
  });

  test("handles null date", () => {
    const result = getFormattedTimestamp({ date: null });
    expect(result).toBeUndefined();
  });

  test("handles explicit date input", () => {
    const inputDate = new Date("2023-05-15T10:30:45");
    const result = getFormattedTimestamp({ date: inputDate });
    expect(result).toBe("2023-05-15");
  });

  test("handles different time zones", () => {
    const mockIntl = jest.spyOn(Intl, "DateTimeFormat");

    // Test with UTC
    mockIntl.mockImplementation(
      () => ({ resolvedOptions: () => ({ timeZone: "UTC" }) } as any),
    );
    const utcDate = new Date("2024-01-01T00:00:00Z");
    const utcResult = getFormattedTimestamp({
      date: utcDate,
      includeTimes: true,
    });
    expect(utcResult).toBe("2024-01-01.000000");

    // Test with a different time zone (e.g., Tokyo)
    mockIntl.mockImplementation(
      () => ({ resolvedOptions: () => ({ timeZone: "Asia/Tokyo" }) } as any),
    );
    const tokyoResult = getFormattedTimestamp({
      date: utcDate,
      includeTimes: true,
    });
    expect(tokyoResult).toBe("2024-01-01.090000"); // 9 hours ahead of UTC i.e., UTC+9
  });
});
