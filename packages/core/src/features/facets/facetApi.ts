import { GdcApiResponse } from "../gdcapi/gdcapi";

export const fetchFacetByName = async (
  name: string,
): Promise<GdcApiResponse> => {
  const response = await fetch(
    `https://api.gdc.cancer.gov/cases?size=0&facets=${name}`,
  );
  if (response.ok) {
    return response.json();
  }
  // TODO make a better error with request info
  throw Error(await response.text());
};
