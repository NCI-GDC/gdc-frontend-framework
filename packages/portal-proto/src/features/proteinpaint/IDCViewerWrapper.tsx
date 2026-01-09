// File: `packages/portal-proto/src/features/proteinpaint/IDCViewerWrapper.tsx`
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { PROTEINPAINT_API } from "@gff/core";

/**
 * Cleaned IDCViewerWrapper:
 *  - Automatically runs mapping on mount (no button click required)
 *  - Caches parsed parquet results in Cache Storage (`idc_data.json`)
 */

const SLIM_VIEWER_BASE =
  "https://viewer.imaging.datacommons.cancer.gov/slim/studies/";

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
async function cacheIdcMetadata(
  cache: Cache,
  cacheRequest: Request,
  collection_ids: string[],
  idc_data: any[],
  addLog: (s: string) => void,
) {
  try {
    const jsonString = JSON.stringify({ collection_ids, idc_data });
    const jsonBlob = new Blob([jsonString], { type: "application/json" });
    await cache.put(cacheRequest, new Response(jsonBlob));
    addLog("Downloaded IDC metadata and cached it");
  } catch (cacheErr) {
    addLog(`Failed to cache IDC metadata: ${String(cacheErr)}`);
  }
}

const IDCViewerWrapper: FC = () => {
  const [progress, setProgress] = useState<string>("Idle");
  const [logs, setLogs] = useState<string[]>([]);
  const [mappings, setMappings] = useState<any[]>([]);
  const [gdcCount, setGdcCount] = useState<number | null>(null);
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

  const buildSlimSeriesURL = (
    studyInstanceUID: string,
    seriesInstanceUID: string,
  ) =>
    SLIM_VIEWER_BASE +
    encodeURIComponent(studyInstanceUID) +
    "/series/" +
    encodeURIComponent(seriesInstanceUID);

  const runMapping = useCallback(async () => {
    // Move the function declaration to the function body root (avoid inner declaration)
    async function fetchGdcCases(limit = 5) {
      try {
        const base = "https://api.gdc.cancer.gov/cases";
        const urlParams = new URLSearchParams(window.location.search);
        const primarySite = urlParams.get("primary_site");

        // Build filter object: op: "and" with optional primary_site constraint
        const filterObj: any = { op: "and", content: [] };
        if (primarySite) {
          filterObj.content.push({
            op: "=",
            content: { field: "cases.primary_site", value: primarySite },
          });
          addLog(`Filtering GDC cases by primary_site=${primarySite}`);
        }

        const filtersEncoded = encodeURIComponent(JSON.stringify(filterObj));
        const url =
          base +
          "?" +
          "size=" +
          encodeURIComponent(String(limit)) +
          "&" +
          "filters=" +
          filtersEncoded +
          "&pretty=true" +
          "&expand=samples.portions.slides" +
          "&fields=submitter_id,disease_type,primary_site";

        addLog(`GDC GET URL: ${url}`);
        const resp = await fetch(url, {
          method: "GET",
          headers: { Accept: "application/json" },
        });
        if (!resp.ok) throw new Error(`GDC API error ${resp.status}`);
        const json = await resp.json();
        const hits = json?.data?.hits || [];

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
          `Fetched ${hits.length} hits; ${filteredHits.length} have slides`,
        );

        return filteredHits
          .map((h: any) => h.submitter_id)
          .filter((s: any) => typeof s === "string");
      } catch (e) {
        addLog(`Failed to fetch GDC cases: ${String(e)}`);
        return [];
      }
    }

    try {
      const fetchedSubmitterIds = await fetchGdcCases(450);
      const cases = fetchedSubmitterIds.slice(0, 450);
      const gdcCases = cases.map((c) => ({ submitter_id: c, case_id: c }));
      setGdcCount(gdcCases.length);
      addLog(`Retrieved ${gdcCases.length} GDC submitter_id(s) from GDC API`);

      setProgress("Loading IDC parquet index (cached or /parquet)...");
      addLog("Preparing to load cached metadata or fetch /parquet");

      // Attempt to load parsed parquet JSON from Cache Storage first
      let idc_data: any[] = [];
      let collection_ids: string[] = [];

      try {
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
          collection_ids = parsed.collection_ids;
          idc_data = parsed.idc_data;
        } else {
          addLog("Cache miss — fetching parquet via proxy /parquet");
          const hyparquet = (await import("hyparquet")) as any;

          const idc_index_url = `${PROTEINPAINT_API.replace(
            /\/$/,
            "",
          )}/parquet`;
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

          // Extracted: read idc_data + collection_ids and cache
          const parsed = await readParquetIndex(hyparquet, idc_index_file);
          idc_data = parsed.idc_data;
          collection_ids = parsed.collection_ids;
          await cacheIdcMetadata(
            cache,
            cacheRequest,
            collection_ids,
            idc_data,
            addLog,
          );
        }
      } catch (cacheErr) {
        addLog(
          `Cache handling failed: ${String(
            cacheErr,
          )} — falling back to direct fetch`,
        );
        // Fallback: attempt direct fetch/parse once
        const hyparquet = (await import("hyparquet")) as any;
        const idc_index_url = `${PROTEINPAINT_API}/parquet`;
        const idc_index_file = await hyparquet.asyncBufferFromUrl({
          url: idc_index_url,
        });
        const parsed = await readParquetIndex(hyparquet, idc_index_file);
        idc_data = parsed.idc_data;
        collection_ids = parsed.collection_ids;
      }

      setIdcCount(idc_data.length);
      addLog(`Parsed ${idc_data.length} IDC rows from parquet`);

      setProgress("Mapping GDC cases → IDC rows...");
      const results: any[] = [];
      for (const gc of gdcCases) {
        const submitter = gc.submitter_id ?? gc.case_id ?? null;
        const found: any[] = [];

        if (submitter) {
          // match by PatientID
          found.push(...idc_data.filter((r: any) => r.PatientID === submitter));
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

      const matchedCount = results.filter((r) => r.matches.length > 0).length;
      addLog(`Mapping complete: ${matchedCount} GDC cases with >=1 IDC match`);

      // Filter mappings: only keep GDC cases that have at least one match with a viewer link (series_aws_url)
      const resultsWithViewer = results.filter(
        (r) =>
          Array.isArray(r.matches) &&
          r.matches.length > 0 &&
          r.matches.some((m: any) => !!m.series_aws_url),
      );
      addLog(
        `Filtered to ${resultsWithViewer.length} GDC case(s) with at least one IDC match that has a viewer link`,
      );

      setMappings(resultsWithViewer);

      setProgress("Ready");
    } catch (err: any) {
      addLog(`Error: ${err?.message ?? String(err)}`);
      setProgress("Error");
    }
  }, []);

  // Auto-run mapping on mount
  useEffect(() => {
    runMapping();
  }, [runMapping]);

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
      <h2>IDCViewer — GDC ↔ IDC mapping</h2>
      <div style={{ fontSize: 13, marginBottom: 8 }}>
        <strong>Progress:</strong> {progress}
      </div>

      <div style={{ fontSize: 13, marginBottom: 8 }}>
        <strong>Counts:</strong> GDC cases: {gdcCount ?? "n/a"} — IDC rows:{" "}
        {idcCount ?? "n/a"} {" — "}
      </div>

      <div style={{ marginTop: 12 }}>
        <h3>Mapping table</h3>
        <div style={{ maxHeight: 460, overflow: "auto" }}>
          {mappings.length === 0 ? (
            <div>No mapping results yet.</div>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 12,
                background: "#fafafa",
                borderRadius: 6,
                tableLayout: "fixed",
              }}
            >
              <colgroup>
                <col style={{ width: "15%" }} />
                <col style={{ width: "35%" }} />
                <col style={{ width: "35%" }} />
                <col style={{ width: "15%" }} />
              </colgroup>
              <thead>
                <tr
                  style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}
                >
                  <th style={{ padding: "6px 8px" }}>GDC caseId</th>
                  <th style={{ padding: "6px 8px" }}>StudyInstanceUUID</th>
                  <th style={{ padding: "6px 8px" }}>SeriesUUIS</th>
                  <th style={{ padding: "6px 8px" }}>IDC Vewer link</th>
                </tr>
              </thead>
              <tbody>
                {mappings.map((m, idx) => {
                  const caseId =
                    m.gdcCase.submitter_id ??
                    m.gdcCase.case_id ??
                    m.gdcCase.case_uuid ??
                    "(no id)";
                  // Build unique series list from matches
                  const seriesMap = new Map<string, any>();
                  if (Array.isArray(m.matches)) {
                    for (const row of m.matches) {
                      const sid = row?.SeriesInstanceUID;
                      if (!sid) continue;
                      const existing = seriesMap.get(sid);
                      if (!existing) {
                        seriesMap.set(sid, {
                          StudyInstanceUID: row?.StudyInstanceUID ?? null,
                          SeriesInstanceUID: sid,
                        });
                      } else if (
                        !existing.StudyInstanceUID &&
                        row?.StudyInstanceUID
                      ) {
                        existing.StudyInstanceUID = row.StudyInstanceUID;
                      }
                    }
                  }
                  const seriesList = Array.from(seriesMap.values());
                  // Determine a study-level UID for study link
                  let studyUIDForLink: string | null = null;
                  if (seriesList.length > 0 && seriesList[0].StudyInstanceUID) {
                    studyUIDForLink = seriesList[0].StudyInstanceUID;
                  } else if (Array.isArray(m.matches)) {
                    const found = m.matches.find(
                      (r: any) => !!r.StudyInstanceUID,
                    );
                    studyUIDForLink = found?.StudyInstanceUID ?? null;
                  }
                  const studyUrl = studyUIDForLink
                    ? buildSlimStudyURL(studyUIDForLink)
                    : null;

                  const isExpanded = expandedCases.has(caseId);
                  const rows: React.ReactNode[] = [];

                  // Study row (click to expand/collapse series rows)
                  rows.push(
                    <tr
                      key={`${idx}-study`}
                      style={{ borderTop: "1px solid #eee", cursor: "pointer" }}
                      onClick={() => toggleExpanded(caseId)}
                    >
                      <td style={{ padding: "6px 8px" }}>{caseId}</td>
                      <td
                        style={{ padding: "6px 8px", wordBreak: "break-all" }}
                      >
                        {studyUIDForLink ?? "(none)"}
                      </td>
                      <td style={{ padding: "6px 8px" }}>none</td>
                      <td style={{ padding: "6px 8px" }}>
                        {studyUrl ? (
                          <a
                            href={studyUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Open study
                          </a>
                        ) : (
                          <span style={{ color: "#666" }}>(no link)</span>
                        )}
                      </td>
                    </tr>,
                  );

                  // Per-series rows (render only when expanded)
                  if (isExpanded) {
                    seriesList.forEach((s, si) => {
                      const link =
                        s.StudyInstanceUID && s.SeriesInstanceUID
                          ? buildSlimSeriesURL(
                              s.StudyInstanceUID,
                              s.SeriesInstanceUID,
                            )
                          : null;
                      rows.push(
                        <tr
                          key={`${idx}-${si}`}
                          style={{ borderTop: "1px solid #eee" }}
                        >
                          <td style={{ padding: "6px 8px" }}>{caseId}</td>
                          <td
                            style={{
                              padding: "6px 8px",
                              wordBreak: "break-all",
                            }}
                          >
                            {s.StudyInstanceUID ?? "(none)"}
                          </td>
                          <td
                            style={{
                              padding: "6px 8px",
                              wordBreak: "break-all",
                            }}
                          >
                            {s.SeriesInstanceUID ?? "(none)"}
                          </td>
                          <td style={{ padding: "6px 8px" }}>
                            {link ? (
                              <a href={link} target="_blank" rel="noreferrer">
                                Open series
                              </a>
                            ) : (
                              <span style={{ color: "#666" }}>(no link)</span>
                            )}
                          </td>
                        </tr>,
                      );
                    });
                  }

                  return rows;
                })}
              </tbody>
            </table>
          )}
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
