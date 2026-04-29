import { compressors } from "hyparquet-compressors";
import { parquetReadObjects } from "hyparquet";
import { IDCParquetData } from "@/features/proteinpaint/idc/types";

export const IDC_BUCKET_URL =
  "https://storage.googleapis.com/idc-index-data-artifacts/";
export const IDC_PARQUET_KEY_SUFFIX =
  "/release_artifacts/gdc_idc_mapping.parquet";
export const IDC_PARQUET_CURRENT_URL = `${IDC_BUCKET_URL}current${IDC_PARQUET_KEY_SUFFIX}`;

// Columns list for IDC parquet reads
const IDC_PARQUET_COLUMNS = [
  "collection_id",
  "PatientID",
  "StudyInstanceUID",
  "StudyDate",
  "StudyDescription",
  "study_type",
  "gdc_case_id",
];

// Helper: read idc_data from a parquet file
export async function readParquetIndex(idc_index_file: any): Promise<{
  idc_data: ReadonlyArray<IDCParquetData>;
  case_ids: readonly string[];
}> {
  const raw_rows = await parquetReadObjects({
    file: idc_index_file,
    columns: IDC_PARQUET_COLUMNS,
    compressors: compressors,
  });

  const idc_data = raw_rows || [];

  // Extract unique gdc case ids from the parquet data
  const gdcCaseIdSet = new Set<string>();
  idc_data.forEach((o: any) => {
    const cid = o?.gdc_case_id;
    if (cid) gdcCaseIdSet.add(String(cid));
  });
  const gdcCaseIds = Array.from(gdcCaseIdSet) as readonly string[];

  return {
    idc_data: idc_data as Array<IDCParquetData>,
    case_ids: gdcCaseIds,
  };
}

// Fetch + parse a parquet URL; throws on any failure.
export async function loadParquetFromUrl(url: string) {
  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error(
      `Failed to fetch parquet: ${resp.status} ${resp.statusText}`,
    );
  }
  const arrayBuffer = await resp.arrayBuffer();
  return readParquetIndex(arrayBuffer);
}

// Compare dotted numeric versions (e.g. "23.6.0"). Returns sign of a - b.
export function compareVersions(a: string, b: string): number {
  const pa = a.split(".").map((p) => Number(p) || 0);
  const pb = b.split(".").map((p) => Number(p) || 0);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

// Fetch bucket XML listing and return the versioned parquet URL with the highest version.
export async function fetchLatestVersionedParquetUrl(): Promise<
  string | undefined
> {
  const resp = await fetch(IDC_BUCKET_URL);
  if (!resp.ok) return undefined;
  const text = await resp.text();
  const doc = new DOMParser().parseFromString(text, "application/xml");
  const versions = Array.from(doc.getElementsByTagName("Key"))
    .map((el) => el.textContent || "")
    .filter((k) => k.endsWith(IDC_PARQUET_KEY_SUFFIX))
    .map((k) => k.slice(0, -IDC_PARQUET_KEY_SUFFIX.length))
    .filter((v) => v !== "current" && /^\d+(\.\d+)*$/.test(v));

  if (versions.length === 0) return undefined;
  const latest = versions.reduce((max, v) =>
    compareVersions(v, max) > 0 ? v : max,
  );

  return `${IDC_BUCKET_URL}${latest}${IDC_PARQUET_KEY_SUFFIX}`;
}
