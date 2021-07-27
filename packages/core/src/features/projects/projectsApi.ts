import { GdcApiResponse } from "../gdcapi/gdcapi";
import "isomorphic-fetch";
export interface ProjectHit {
  readonly project_id: string;
  readonly name: string;
}

export const fetchProjects = async (): Promise<GdcApiResponse<ProjectHit>> => {
  const response = await fetch(`https://api.gdc.cancer.gov/projects?size=100`);
  if (response.ok) {
    return response.json();
  }
  // TODO make a better error with request info
  throw Error(await response.text());
};
