/**
 *  Feature flags for GDC Portal.
 *  Define a flag in either local storage or  environment variable
 *  Note that in a production build NextJS will compile in the value of the ENV
 *  variable when it is built
 *
 */
let localStorage: Storage = {} as Storage;
if (typeof window !== "undefined") localStorage = window.localStorage;

/**
 * Feature flag for Single Cell RNA-seq
 */
export const DISPLAY_SC_RNA_SEQ_APP =
  localStorage.GDC_PORTAL_DISPLAY_SC_RNA_SEQ_APP ||
  process.env.NEXT_PUBLIC_GDC_PORTAL_DISPLAY_SC_RNA_SEQ_APP ||
  false;

/**
 * Determines whether a feature is enabled based on the provided value.
 *
 * The function evaluates the input based on its type to return a boolean indicating
 * the enabled status. If the input is undefined, it returns false. If the input is a
 * boolean, it returns the value directly. If the input is a string, it checks if the
 * string value is "true" (case insensitive) to return true; otherwise, returns false.
 *
 * @param {string | boolean | undefined} value - The input value to evaluate.
 * @returns {boolean} - True if the feature is enabled, false otherwise.
 */
export const isFeatureEnabled = (
  value: string | boolean | undefined,
): boolean => {
  if (value === undefined) return false;
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return String(value).toLowerCase() == "true";
  return false;
};
