// https://stackoverflow.com/questions/2388115/get-locale-short-date-format-using-javascript
/**
 * Returns a formatted timestamp string based on the provided date or the current date.
 *
 * @param options - An object containing the following optional parameters:
 *   @param options.date - A Date object to format. If not provided, uses the current date.
 *   @param options.includeTimes - Boolean to include time in the output. Defaults to false.
 * @returns A timestamp in the format 'YYYY-MM-DD' if includeTimes is false, or 'YYYY-MM-DD.HHMMSS' if true.
 * If date is null it returns undefined
 *
 * Uses the Swedish ("sv-SE") locale for consistent formatting (YYYY-MM-DD HH:MM:SS).
 * Explicitly sets the time zone to the system's local time zone.
 */
export function getFormattedTimestamp(
  options: {
    date?: Date | null;
    includeTimes?: boolean;
  } = {},
): string | undefined {
  const { date = new Date(), includeTimes = false } = options;
  if (date === null) return undefined;

  const formatOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };

  if (includeTimes) {
    Object.assign(formatOptions, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  }

  const formattedDate = date.toLocaleString("sv-SE", formatOptions);

  if (includeTimes) {
    return formattedDate.replace(" ", ".").replace(/[:]/g, "");
  } else {
    return formattedDate;
  }
}
