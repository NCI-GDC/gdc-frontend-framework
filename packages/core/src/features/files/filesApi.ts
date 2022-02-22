import { GdcApiResponse } from "../gdcapi/gdcapi";
import {
  GqlOperation,
} from "../gdcapi/filters";

export interface GdcApiFile {
  readonly id: string;
  readonly submitter_id: string;
  readonly access: string;
  readonly acl: ReadonlyArray<string>;
  readonly create_datetime: string;
  readonly updated_datetime: string;
  readonly data_category: string;
  readonly data_format: string;
  readonly data_release: string;
  readonly data_type: string;
  readonly file_id: string;
  readonly file_name: string;
  readonly file_size: number;
  readonly md5sum: string;
  readonly state: string;
  readonly type: string;
  readonly version: string;
  readonly experimental_strategy: string;
}

export const fetchFiles = async (filters :  GqlOperation | undefined): Promise<GdcApiResponse<GdcApiFile>> => {
  const parameters = filters ? `&filters=${encodeURIComponent(JSON.stringify(filters))}` : "";
  const response = await fetch(`https://api.gdc.cancer.gov/files?size=20${parameters}`);
  if (response.ok) {
    return response.json();
  }
  // TODO make a better error with request info
  throw Error(await response.text());
};
