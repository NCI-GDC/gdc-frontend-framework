/**
 * Converts a date into a string of YYYY-MM-DD padding 0 for months and days \< 10.
 * Note the use of UTC to ensure the GMT timezone.
 * @param d - date to convert
 */
export const convertDateToString = (d: Date | null): string | undefined => {
  if (d === null) return undefined;
  return `${d.getUTCFullYear()}-${(d.getUTCMonth() + 1) //UTC Months start at 0
    .toString()
    .padStart(2, "0")}-${d.getUTCDate().toString().padStart(2, "0")}`;
};
