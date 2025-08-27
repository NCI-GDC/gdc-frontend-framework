export const GDC_APP_API_AUTH = process.env.NEXT_PUBLIC_GDC_APP_API_AUTH;
export const GDC_AUTH = process.env.NEXT_PUBLIC_GDC_AUTH;
export const GDC_API = process.env.NEXT_PUBLIC_GDC_API;
export const PROTEINPAINT_API =
  process.env.PROTEINPAINT_API || process.env.NEXT_PUBLIC_PROTEINPAINT_API;

export const DAYS_IN_YEAR = 365.25;
export const DAYS_IN_DECADE = 3652.5;
export const CART_LIMIT = 10000;

export const PUBLIC_APP_INFO = {
  version: process.env.NEXT_PUBLIC_APP_VERSION,
  hash: process.env.NEXT_PUBLIC_APP_HASH,
};
export const ERROR_UNHANDLED_AGGREGATION = "Unhandled aggregation";
