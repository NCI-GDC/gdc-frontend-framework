import { GdcApiResponse } from "../gdcapi/gdcapi";

export const fetchFiles = async (): Promise<GdcApiResponse> => {
  const response = await fetch("https://api.gdc.cancer.gov/files?size=20");
  if (response.ok) {
    return response.json();
  }
  // TODO make a better error with request info
  throw Error(await response.text());
};
