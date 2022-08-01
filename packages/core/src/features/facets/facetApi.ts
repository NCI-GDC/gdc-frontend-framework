import { GdcApiResponse } from "../gdcapi/gdcapi";
import "isomorphic-fetch";

export const fetchFacetByNameRestApi = async (
  name: string,
): Promise<GdcApiResponse<never>> => {
  const response = await fetch(
    `https://api.gdc.cancer.gov/cases?size=0&facets=${name}`,
  );
  if (response.ok) {
    return response.json();
  }
  // TODO make a better error with request info
  throw Error(await response.text());
};

export const fetchFacetsByNamesRestApi = async (
  names: ReadonlyArray<string>,
): Promise<GdcApiResponse<never>> => {
  const response = await fetch(
    `https://api.gdc.cancer.gov/cases?size=0&facets=${names.join(",")}`,
  );
  if (response.ok) {
    return response.json();
  }
  // TODO make a better error with request info
  throw Error(await response.text());
};
