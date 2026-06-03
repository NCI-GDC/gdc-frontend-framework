import { compressors } from "hyparquet-compressors";
import { parquetReadObjects, parquetMetadata } from "hyparquet";
import semver from "semver";
import {
  IDCParquetData,
  IDCParquetIndexResult,
} from "@/features/proteinpaint/idc/types";

export const IDC_BUCKET_URL =
  "https://storage.googleapis.com/idc-index-data-artifacts/";
export const IDC_PARQUET_KEY_SUFFIX =
  "/release_artifacts/gdc_idc_mapping.parquet";
export const IDC_PARQUET_CURRENT_URL = `${IDC_BUCKET_URL}current1${IDC_PARQUET_KEY_SUFFIX}`;

// Label used to identify the "current" (latest published) parquet artifact.
export const IDC_CURRENT_VERSION_LABEL = "current";

// Key in the parquet footer key/value metadata that holds the IDC index data
// version (e.g. "24.2.1-0-g119c0c7").
const IDC_DATA_VERSION_METADATA_KEY = "idc_index_data_version";

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

// Columns that MUST be present for a parquet file to be considered a valid,
// readable IDC mapping file (used to verify the file format is as expected).
const IDC_REQUIRED_COLUMNS = ["PatientID", "StudyInstanceUID", "gdc_case_id"];

// Result of a successful (validated) IDC parquet load.
export interface IDCParquetLoadResult {
  idc_data: ReadonlyArray<IDCParquetData>;
  case_ids: readonly string[];
  // Version label of the artifact that was successfully loaded, e.g.
  // "current" or "23.6.0".
  urlVersion: string;
  // The fully-qualified URL the data was loaded from.
  url: string;
  // Version embedded in the parquet footer key/value metadata
  // (idc_index_data_version), e.g. "24.2.1-0-g119c0c7". Undefined when the
  // metadata key is absent.
  metadataVersion?: string;
}

// A versioned parquet artifact entry parsed from the bucket listing.
export interface IDCVersionedEntry {
  version: string;
  url: string;
}

// Verify the parsed parquet rows are in the expected format (readable).
// An empty array is considered invalid; a non-empty array must expose the
// required IDC columns on its rows.
export function isValidIDCParquetData(rows: unknown): rows is IDCParquetData[] {
  if (!Array.isArray(rows)) return false;
  if (rows.length === 0) return false;
  const sample = rows[0];
  if (!sample || typeof sample !== "object") return false;
  return IDC_REQUIRED_COLUMNS.every((col) => col in (sample as object));
}

// Read the IDC index data version from the parquet footer key/value metadata.
// Returns undefined when the file metadata cannot be read or the key is absent.
export function readIDCDataVersion(
  arrayBuffer: ArrayBuffer,
): string | undefined {
  try {
    const metadata = parquetMetadata(arrayBuffer);
    const entry = metadata?.key_value_metadata?.find(
      (kv) => kv.key === IDC_DATA_VERSION_METADATA_KEY,
    );
    return entry?.value;
  } catch {
    return undefined;
  }
}

// Helper: read idc_data from a parquet file
export async function readParquetIndex(
  idc_index_file: any,
): Promise<IDCParquetIndexResult> {
  const raw_rows = await parquetReadObjects({
    file: idc_index_file,
    columns: IDC_PARQUET_COLUMNS,
    compressors: compressors,
  });

  const idc_data = raw_rows || [];

  // Verify the file is in the expected format before using it. An unexpected
  // shape means the file is unreadable / corrupted for our purposes.
  if (!isValidIDCParquetData(idc_data)) {
    throw new Error("Parquet file is not in the expected IDC mapping format");
  }

  // Extract unique gdc case ids from the parquet data
  const gdcCaseIdSet = new Set<string>();
  idc_data.forEach((o: any) => {
    const cid = o?.gdc_case_id;
    if (cid) gdcCaseIdSet.add(String(cid));
  });
  const gdcCaseIds = Array.from(gdcCaseIdSet) as readonly string[];

  // Read the embedded data version from the parquet footer metadata. Only
  // possible when we have the raw bytes (ArrayBuffer / Uint8Array).
  const dataVersion =
    idc_index_file instanceof ArrayBuffer
      ? readIDCDataVersion(idc_index_file)
      : undefined;

  return {
    idc_data: idc_data as Array<IDCParquetData>,
    case_ids: gdcCaseIds,
    dataVersion,
  };
}

// Fetch + parse a parquet URL; throws on any failure (network, CORS, HTTP
// error, or unreadable/invalid file format).
export async function loadParquetFromUrl(
  url: string,
): Promise<IDCParquetIndexResult> {
  // A CORS failure or network error rejects fetch with a TypeError, which
  // propagates to the caller and is treated as "not accessible".
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
  const sa = semver.coerce(a) ?? "0.0.0";
  const sb = semver.coerce(b) ?? "0.0.0";
  return semver.compare(sa, sb);
}

// Fetch bucket XML listing and return every versioned parquet artifact,
// sorted from newest to oldest. The "current" alias is excluded since it is
// handled separately. Returns an empty array on any failure (e.g. CORS).
export async function fetchVersionedParquetEntries(): Promise<
  IDCVersionedEntry[]
> {
  try {
    const resp = await fetch(IDC_BUCKET_URL);
    if (!resp.ok) return [];

    const text = await resp.text();
    const doc = new DOMParser().parseFromString(text, "application/xml");
    const versions = Array.from(doc.getElementsByTagName("Key"))
      .map((el) => el.textContent || "")
      .filter((k) => k.endsWith(IDC_PARQUET_KEY_SUFFIX))
      .map((k) => k.slice(0, -IDC_PARQUET_KEY_SUFFIX.length))
      .filter(
        (v) => v !== IDC_CURRENT_VERSION_LABEL && /^\d+(\.\d+)*$/.test(v),
      );

    // newest -> oldest
    const sorted = Array.from(new Set(versions)).sort((a, b) =>
      compareVersions(b, a),
    );

    return sorted.map((version) => ({
      version,
      url: `${IDC_BUCKET_URL}${version}${IDC_PARQUET_KEY_SUFFIX}`,
    }));
  } catch {
    // network / CORS failure or unparseable listing
    return [];
  }
}

// Attempt to load + validate a single artifact. Resolves with the validated
// result, or `undefined` if the artifact is unavailable, inaccessible
// (CORS/network), or unreadable (unexpected format).
async function tryLoadValidatedParquet(
  url: string,
  version: string,
): Promise<IDCParquetLoadResult | undefined> {
  try {
    const data = await loadParquetFromUrl(url);
    return { ...data, urlVersion: version, url };
  } catch (err) {
    console.warn(
      `[IDC] Parquet artifact "${version}" is unavailable, inaccessible, or invalid and will be skipped:`,
      err instanceof Error ? err.message : err,
    );
    return undefined;
  }
}

// Load the IDC parquet mapping with version fallback.
//
// 1. Try the "current" artifact first.
// 2. If it is unavailable, inaccessible (CORS), or unreadable, traverse the
//    archived versioned artifacts from newest to oldest until a valid one is
//    found.
//
// Resolves with the validated data plus the version that was used, or
// `undefined` if no valid artifact could be loaded.
export async function loadIDCParquetWithFallback(): Promise<
  IDCParquetLoadResult | undefined
> {
  // 1. Try the current (latest published) artifact.
  const current = await tryLoadValidatedParquet(
    IDC_PARQUET_CURRENT_URL,
    IDC_CURRENT_VERSION_LABEL,
  );
  if (current) return current;

  // 2. Fall back through the archived versions, newest first.
  const versioned = await fetchVersionedParquetEntries();
  for (const entry of versioned) {
    const result = await tryLoadValidatedParquet(entry.url, entry.version);
    if (result) {
      // eslint-disable-next-line no-console
      console.warn(
        `[IDC] Using fallback IDC mapping version "${entry.version}" because the current artifact was unavailable or invalid.`,
      );
      return result;
    }
  }

  return undefined;
}
