// File: `packages/portal-proto/src/features/proteinpaint/IDCViewerWrapper.tsx`
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import {
  PROTEINPAINT_API,
  fetchGdcCases as fetchGdcCasesApi,
  useCurrentCohortFilters,
  filterSetToOperation,
  convertFilterToGqlFilter, // added: convert Operation -> GqlOperation
  useCurrentCohortCounts, // added hook to get cohort case count
} from "@gff/core";
// import the new split components
import TableView from "./TableView";

/**
 * Cleaned IDCViewerWrapper:
 *  - Automatically runs mapping on mount (no button click required)
 *  - Caches parsed parquet results in Cache Storage (`idc_data.json`)
 */

const SLIM_VIEWER_BASE =
  "https://viewer.imaging.datacommons.cancer.gov/slim/studies/";

const CT_VIEWER_BASE =
  "https://viewer.imaging.datacommons.cancer.gov/v3/viewer/";

// Reusable columns list for IDC parquet reads
const IDC_PARQUET_COLUMNS = [
  "collection_id",
  "PatientID",
  "StudyInstanceUID",
  "SeriesInstanceUID",
  "series_aws_url",
  "Modality",
  "StudyDate",
  "StudyDescription",
];

// Helper: read idc_data + collection_ids from a parquet file buffer
async function readParquetIndex(
  hyparquet: any,
  idc_index_file: any,
): Promise<{ idc_data: any[]; collection_ids: string[] }> {
  const idc_data = await hyparquet.parquetReadObjects({
    file: idc_index_file,
    columns: IDC_PARQUET_COLUMNS,
  });

  const collectionQuery = await hyparquet.parquetReadObjects({
    file: idc_index_file,
    columns: ["collection_id"],
  });
  const colSet = new Set<string>();
  collectionQuery.forEach((o: any) => colSet.add(o.collection_id));
  const collection_ids = Array.from(colSet);

  return { idc_data, collection_ids };
}

// Helper: cache parsed IDC metadata
const IDCViewerWrapper: FC = () => {
  const [progress, setProgress] = useState<string>("Idle");
  const [logs, setLogs] = useState<string[]>([]);
  const [mappings, setMappings] = useState<any[]>([]);
  // derive GDC total from current cohort counts hook instead of local state
  const cohortCounts = useCurrentCohortCounts();
  const gdcCount = cohortCounts?.data?.caseCount ?? null;
  const [idcCount, setIdcCount] = useState<number | null>(null);
  const divRef = useRef<HTMLDivElement | null>(null);
  // Track which cases are expanded to show their series rows
  const [expandedCases, setExpandedCases] = useState<Set<string>>(new Set());
  const toggleExpanded = useCallback((caseId: string) => {
    setExpandedCases((prev) => {
      const next = new Set(prev);
      if (next.has(caseId)) next.delete(caseId);
      else next.add(caseId);
      return next;
    });
  }, []);

  const addLog = (s: string) => setLogs((l) => [...l, s]);

  const buildSlimStudyURL = (studyInstanceUID: string) =>
    SLIM_VIEWER_BASE + encodeURIComponent(studyInstanceUID);

  // --- Pagination constants & state ---
  const PAGE_SIZE = 400; // page size (used for fetching pages)

  // Cache parsed IDC data in component state so we don't re-download/parse repeatedly
  const [cachedIdcData, setCachedIdcData] = useState<any[] | null>(null);
  const [cachedCollectionIds, setCachedCollectionIds] = useState<
    string[] | null
  >(null);

  // use current cohort filters (hook)
  const currentCohortFilterSet = useCurrentCohortFilters();
  // convert FilterSet -> Operation (internal representation)
  const cohortGqlFilters = currentCohortFilterSet
    ? filterSetToOperation(currentCohortFilterSet)
    : undefined;

  // Helper: fetch GDC cases (supports limit & from)
  async function fetchGdcCases(limit = 500, from = 0) {
    try {
      // Convert Operation -> GqlOperation expected by fetchGdcCasesApi
      const caseFiltersArg = cohortGqlFilters
        ? convertFilterToGqlFilter(cohortGqlFilters)
        : undefined;

      addLog(
        `Fetching GDC cases with cohort filters (GQL op): ${JSON.stringify(
          caseFiltersArg || {},
        )}`,
      );
      const casesResp = await fetchGdcCasesApi({
        fields: ["submitter_id", "disease_type", "primary_site"],
        size: limit,
        from,
        case_filters: caseFiltersArg, // pass converted GqlOperation
        expand: ["samples.portions.slides"],
      });

      const hits = casesResp?.data?.hits || [];

      // optional local filtering to ensure slides exist
      const filteredHits = hits.filter(
        (hit: any) =>
          hit.samples &&
          hit.samples.some(
            (s: any) =>
              s.portions &&
              s.portions.some((p: any) => p.slides && p.slides.length > 0),
          ),
      );

      addLog(
        `Fetched ${hits.length} hits; ${filteredHits.length} have slides (from=${from})`,
      );

      return filteredHits
        .map((h: any) => h.submitter_id)
        .filter((s: any) => typeof s === "string");
    } catch (e) {
      addLog(`Failed to fetch GDC cases: ${String(e)}`);
      return [];
    }
  }

  // Helper: ensure IDC metadata is loaded and cached in component state (only does work once)
  const loadIdcDataIfNeeded = useCallback(async () => {
    if (cachedIdcData) {
      addLog("Using cached IDC metadata (already loaded)");
      return {
        idc_data: cachedIdcData,
        collection_ids: cachedCollectionIds ?? [],
      };
    }

    try {
      setProgress("Loading IDC parquet index (cached or /parquet)...");
      addLog("Preparing to load cached metadata or fetch /parquet");

      const cache = await caches.open("idc-download");
      const cacheRequest = new Request("idc_data.json");
      const cachedResponse = await cache.match(cacheRequest);

      if (cachedResponse) {
        addLog("Loaded IDC metadata from cache");
        const cachedBlob = await cachedResponse.blob();
        const cachedJSON = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = reject;
          reader.readAsText(cachedBlob);
        });
        const parsed = JSON.parse(cachedJSON);
        setCachedCollectionIds(parsed.collection_ids || []);
        setCachedIdcData(parsed.idc_data || []);
        setProgress("Ready");
        return {
          idc_data: parsed.idc_data || [],
          collection_ids: parsed.collection_ids || [],
        };
      } else {
        addLog("Cache miss — fetching parquet via proxy /parquet");
        const hyparquet = (await import("hyparquet")) as any;

        const idc_index_url = `${PROTEINPAINT_API.replace(/\/$/, "")}/parquet`;
        addLog(`Downloading parquet from ${idc_index_url}...`);
        const idc_index_file = await hyparquet.asyncBufferFromUrl({
          url: idc_index_url,
        });

        // report buffer size when available
        try {
          let sizeDesc = "unknown";
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const f: any = idc_index_file;
          if (typeof f?.byteLength === "number")
            sizeDesc = `${f.byteLength} bytes`;
          else if (typeof f?.length === "number")
            sizeDesc = `${f.length} bytes`;
          else if (typeof f?.size === "number") sizeDesc = `${f.size} bytes`;
          addLog(
            `Downloaded parquet buffer from ${idc_index_url} — success${
              sizeDesc !== "unknown" ? `, size: ${sizeDesc}` : ""
            }`,
          );
        } catch {
          addLog(
            `Downloaded parquet buffer from ${idc_index_url} — success (size unavailable)`,
          );
        }

        const parsed = await readParquetIndex(hyparquet, idc_index_file);
        setCachedIdcData(parsed.idc_data);
        setCachedCollectionIds(parsed.collection_ids);
        try {
          const jsonString = JSON.stringify({
            collection_ids: parsed.collection_ids,
            idc_data: parsed.idc_data,
          });
          const jsonBlob = new Blob([jsonString], { type: "application/json" });
          await cache.put(cacheRequest, new Response(jsonBlob));
          addLog("Downloaded IDC metadata and cached it");
        } catch (cacheErr) {
          addLog(`Failed to cache IDC metadata: ${String(cacheErr)}`);
        }
        setProgress("Ready");
        return parsed;
      }
    } catch (cacheErr) {
      addLog(
        `Cache handling failed: ${String(
          cacheErr,
        )} — falling back to direct fetch`,
      );
      const hyparquet = (await import("hyparquet")) as any;
      const idc_index_url = `${PROTEINPAINT_API}/parquet`;
      const idc_index_file = await hyparquet.asyncBufferFromUrl({
        url: idc_index_url,
      });
      const parsed = await readParquetIndex(hyparquet, idc_index_file);
      setCachedIdcData(parsed.idc_data);
      setCachedCollectionIds(parsed.collection_ids);
      return parsed;
    }
  }, [cachedIdcData, cachedCollectionIds]);

  // Load a single page of GDC cases (pageIndex starts at 0) and map against IDC data
  const loadPage = useCallback(
    async (pageIndex: number) => {
      try {
        // setCurrentPage(pageIndex);
        setProgress(`Loading page ${pageIndex}...`);
        addLog(`Loading GDC page ${pageIndex}`);

        const from = pageIndex * PAGE_SIZE;
        const submitterIds = await fetchGdcCases(PAGE_SIZE, from);
        const gdcCases = submitterIds.map((c) => ({
          submitter_id: c,
          case_id: c,
        }));

        // gdcCount will be set from the API pagination inside fetchGdcCases

        addLog(
          `Retrieved ${gdcCases.length} GDC submitter_id(s) from GDC API (page ${pageIndex})`,
        );

        // Ensure IDC metadata is loaded (only on first call this will do work)
        const parsed = await loadIdcDataIfNeeded();
        const idc_data = parsed.idc_data || [];

        setIdcCount(idc_data.length);
        addLog(`Using ${idc_data.length} IDC rows for mapping`);

        setProgress("Mapping GDC cases → IDC rows...");
        const results: any[] = [];
        for (const gc of gdcCases) {
          const submitter = gc.submitter_id ?? gc.case_id ?? null;
          const found: any[] = [];

          if (submitter) {
            // match by PatientID
            found.push(
              ...idc_data.filter((r: any) => r.PatientID === submitter),
            );
          }

          if (gc.case_id) {
            // match columns that may store case ids
            found.push(
              ...idc_data.filter(
                (r: any) =>
                  r.gdc_case_id === gc.case_id || r.case_id === gc.case_id,
              ),
            );
          }

          // unique
          const uniq = Array.from(new Set(found));
          results.push({ gdcCase: gc, matches: uniq });
        }

        const resultsWithViewer = results.filter(
          (r) =>
            Array.isArray(r.matches) &&
            r.matches.length > 0 &&
            r.matches.some((m: any) => !!m.series_aws_url),
        );

        addLog(
          `Page ${pageIndex} mapping complete: ${resultsWithViewer.length} GDC case(s) with >=1 IDC match that has a viewer link`,
        );

        setMappings(resultsWithViewer);
        setProgress("Ready");
      } catch (err: any) {
        addLog(
          `Error loading page ${pageIndex}: ${err?.message ?? String(err)}`,
        );
        setProgress("Error");
      }
    },
    [loadIdcDataIfNeeded],
  );

  // Auto-load only the initial page (page 0) on mount
  useEffect(() => {
    loadPage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const root = divRef.current;
    if (!root) return;
    root.style.background = "#fff";
    return () => {
      if (root) root.innerHTML = "";
    };
  }, []);

  return (
    <div
      ref={divRef}
      className="idc-viewer-wrapper-root"
      style={{ padding: 12 }}
    >
      <h2>IDCViewer — GDC ↔ IDC mappings</h2>

      <div style={{ marginTop: 12 }}>
        <div style={{ maxHeight: 460, overflow: "auto" }}>
          {/* Render the table view (table header + body). TableView handles empty state and uses idcImageSlice for rows */}
          <TableView
            mappings={mappings}
            expandedCases={expandedCases}
            toggleExpanded={toggleExpanded}
            buildSlimStudyURL={buildSlimStudyURL}
          />
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <h3>Debug log</h3>
        <div
          style={{
            maxHeight: 220,
            overflow: "auto",
            background: "#111",
            color: "#fff",
            padding: 8,
            borderRadius: 6,
          }}
        >
          {logs.map((l, i) => (
            <div key={i} style={{ fontSize: 12, marginBottom: 4 }}>
              {l}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IDCViewerWrapper;
