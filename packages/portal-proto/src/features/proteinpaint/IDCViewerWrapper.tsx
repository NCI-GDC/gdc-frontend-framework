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
  // replaced: per-page GDC count vs total
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

  // --- Pagination constants & state ---
  const PAGE_SIZE = 100; // per requirement
  const TOTAL_GDC_CASES = 50270; // hardcoded total
  const TOTAL_PAGES = Math.ceil(TOTAL_GDC_CASES / PAGE_SIZE); // 101
  const [currentPage, setCurrentPage] = useState<number>(0);

  // Cache parsed IDC data in component state so we don't re-download/parse repeatedly
  const [cachedIdcData, setCachedIdcData] = useState<any[] | null>(null);
  const [cachedCollectionIds, setCachedCollectionIds] = useState<
    string[] | null
  >(null);

  // Helper: fetch GDC cases (supports limit & from)
  async function fetchGdcCases(limit = 500, from = 0) {
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
        "from=" +
        encodeURIComponent(String(from)) +
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
        setCurrentPage(pageIndex);
        setProgress(`Loading page ${pageIndex}...`);
        addLog(`Loading GDC page ${pageIndex}`);

        const from = pageIndex * PAGE_SIZE;
        const submitterIds = await fetchGdcCases(PAGE_SIZE, from);
        const gdcCases = submitterIds.map((c) => ({
          submitter_id: c,
          case_id: c,
        }));

        // Hardcoded total per requirement
        setGdcCount(TOTAL_GDC_CASES);

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

  // Compute displayed page buttons (compact, with ellipses)
  // Configuration: number of numeric buttons to show
  const VISIBLE_BUTTONS = 10; // configurable
  // Desired position (1-based) to try keeping the selected page on (example: 5)
  const DESIRED_POSITION = 5;

  // small helper: inclusive range
  const range = (a: number, b: number) => {
    const r: number[] = [];
    for (let i = a; i <= b; i++) r.push(i);
    return r;
  };

  // Build displayed numeric pages (labels are 1-based). Also decide on leading/trailing ellipses.
  const {
    displayedPages,
    showLeadingEllipsis,
    showTrailingEllipsis,
  }: {
    displayedPages: number[];
    showLeadingEllipsis: boolean;
    showTrailingEllipsis: boolean;
  } = (() => {
    const total = TOTAL_PAGES;
    const visible = Math.max(3, Math.min(VISIBLE_BUTTONS, total)); // at least 3 when possible
    const currentLabel = currentPage + 1;

    if (total <= visible) {
      return {
        displayedPages: range(1, total),
        showLeadingEllipsis: false,
        showTrailingEllipsis: false,
      };
    }

    // If near start: display first (visible-1) numeric buttons and last one
    const offset = DESIRED_POSITION - 1; // desired zero-based offset
    if (currentLabel - offset <= 1) {
      const end = visible - 1; // reserve last page as the final numeric button
      const middle = range(1, end);
      const needsTrailingEllipsis = middle[middle.length - 1] < total - 1;
      return {
        displayedPages: [...middle, total],
        showLeadingEllipsis: false,
        showTrailingEllipsis: needsTrailingEllipsis,
      };
    }

    // If near end: display first, then last (visible-1) numeric buttons
    if (currentLabel + (visible - offset - 1) >= total) {
      const start = total - (visible - 1) + 1; // compute start so we have (visible-1) final numbers
      const middle = range(Math.max(2, start), total);
      const needsLeadingEllipsis = middle[0] > 2;
      return {
        displayedPages: [1, ...middle],
        showLeadingEllipsis: needsLeadingEllipsis,
        showTrailingEllipsis: false,
      };
    }

    // Middle case: reserve first & last, fill middle with (visible - 2) items centered around currentLabel
    const middleCount = visible - 2;
    const middleStart = currentLabel - Math.floor(middleCount / 2);
    const middleEnd = middleStart + middleCount - 1;
    const middle = range(middleStart, middleEnd);
    const needsLeading = middle[0] > 2;
    const needsTrailing = middle[middle.length - 1] < total - 1;
    return {
      displayedPages: [1, ...middle, total],
      showLeadingEllipsis: needsLeading,
      showTrailingEllipsis: needsTrailing,
    };
  })();

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

        {/* Pagination buttons above the table */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 12, marginBottom: 6 }}>
            Pages (0..{TOTAL_PAGES - 1}), page size: {PAGE_SIZE}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 6,
            }}
          >
            {/* Render displayed numeric buttons with optional ellipses */}
            {displayedPages.map((label, idx) => {
              // render leading ellipsis between first and the next item if required
              const items: React.ReactNode[] = [];

              if (idx === 1 && showLeadingEllipsis && displayedPages[0] !== 1) {
                // after the first button, insert leading ellipsis (only once)
                items.push(
                  <span
                    key={`lead-ell-${label}`}
                    style={{ padding: "6px 6px" }}
                  >
                    ...
                  </span>,
                );
              }

              // render numeric button
              const pageIndex = label - 1; // convert to zero-based index
              items.push(
                <button
                  key={`page-${label}`}
                  onClick={() => loadPage(pageIndex)}
                  style={{
                    padding: "6px 8px",
                    borderRadius: 4,
                    border:
                      pageIndex === currentPage
                        ? "2px solid #0078d4"
                        : "1px solid #ccc",
                    background: pageIndex === currentPage ? "#e6f0fb" : "#fff",
                    cursor: "pointer",
                  }}
                  aria-pressed={pageIndex === currentPage}
                >
                  {label}
                </button>,
              );

              // render trailing ellipsis before the last button when necessary
              if (
                idx === displayedPages.length - 2 &&
                showTrailingEllipsis &&
                displayedPages[displayedPages.length - 1] !== TOTAL_PAGES
              ) {
                items.push(
                  <span
                    key={`trail-ell-${label}`}
                    style={{ padding: "6px 6px" }}
                  >
                    ...
                  </span>,
                );
              }

              return items;
            })}
          </div>
        </div>

        <div style={{ maxHeight: 460, overflow: "auto" }}>
          {mappings.length === 0 ? (
            <div>No mapping results yet.</div>
          ) : (
            <>
              <style>
                {`
                  .idc-mapping-table tbody tr:hover {
                    background: #fff9e6 !important;
                  }
                `}
              </style>
              <table
                className="idc-mapping-table"
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
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "35%" }} />
                  <col style={{ width: "35%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "10%" }} />
                </colgroup>
                <thead>
                  <tr
                    style={{
                      textAlign: "left",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    <th style={{ padding: "6px 8px" }}>GDC caseId</th>
                    <th style={{ padding: "6px 8px" }}>StudyInstanceUUID</th>
                    <th style={{ padding: "6px 8px" }}>Series Count</th>
                    <th style={{ padding: "6px 8px" }}>WSI link</th>
                    <th style={{ padding: "6px 8px" }}>Radiology Link</th>
                  </tr>
                </thead>
                <tbody>
                  {mappings.map((m, idx) => {
                    const caseId =
                      m.gdcCase.submitter_id ??
                      m.gdcCase.case_id ??
                      m.gdcCase.case_uuid ??
                      "(no id)";

                    // --- REPLACED: build studiesMap (group by StudyInstanceUID) ---
                    const studiesMap = new Map<
                      string,
                      {
                        StudyInstanceUID: string | null;
                        series: {
                          SeriesInstanceUID?: string | null;
                          Modality?: string | null;
                        }[];
                        anyCT: boolean;
                        anyNonCT: boolean;
                      }
                    >();

                    if (Array.isArray(m.matches)) {
                      for (const row of m.matches) {
                        const studyId = row?.StudyInstanceUID ?? null;
                        const key = studyId ?? "__NO_STUDY__";
                        let existing = studiesMap.get(key);
                        if (!existing) {
                          existing = {
                            StudyInstanceUID: studyId,
                            series: [],
                            anyCT: false,
                            anyNonCT: false,
                          };
                          studiesMap.set(key, existing);
                        }
                        // collect series info
                        existing.series.push({
                          SeriesInstanceUID: row?.SeriesInstanceUID ?? null,
                          Modality: row?.Modality ?? null,
                        });
                        // modality flags
                        if (row?.Modality === "CT") existing.anyCT = true;
                        else if (row?.Modality) existing.anyNonCT = true;
                      }
                    }

                    const studiesList = Array.from(studiesMap.values());
                    const isExpanded = expandedCases.has(caseId);
                    const rows: React.ReactNode[] = [];

                    // Subtle zebra for case rows
                    const isEvenStudy = idx % 2 === 0;
                    const studyBg = isEvenStudy ? "#f5f6f7" : "#eef0f2";

                    // Top-level GDC case row (no links)
                    rows.push(
                      <tr
                        key={`${idx}-case`}
                        style={{
                          borderTop: "1px solid #eee",
                          cursor: "pointer",
                          background: studyBg,
                        }}
                        onClick={() => toggleExpanded(caseId)}
                      >
                        <td style={{ padding: "6px 8px" }}>{caseId}</td>
                        <td
                          style={{ padding: "6px 8px", wordBreak: "break-all" }}
                        >
                          {/* show how many studies are available for this case */}
                          {studiesList.length > 0
                            ? `${studiesList.length} study(s)`
                            : "(/)"}
                        </td>
                        <td style={{ padding: "6px 8px", textAlign: "center" }}>
                          <span style={{ fontSize: 14 }}>
                            {/* show ↓ when expanded, ↑ when collapsed */}
                            {isExpanded ? "↓" : "↑"}
                          </span>
                        </td>
                        {/* No links on the GDC case row */}
                        <td style={{ padding: "6px 8px" }}>
                          <span style={{ color: "#666" }}>(n/a)</span>
                        </td>
                        <td style={{ padding: "6px 8px" }}>
                          <span style={{ color: "#666" }}>(n/a)</span>
                        </td>
                      </tr>,
                    );

                    // When expanded, render one row per StudyInstanceUID
                    if (isExpanded) {
                      studiesList.forEach((study, si) => {
                        const studyUID = study.StudyInstanceUID;
                        const studyIdcLink =
                          studyUID && study.anyNonCT
                            ? buildSlimStudyURL(studyUID)
                            : null;
                        const studyRadiologyLink =
                          studyUID && study.anyCT
                            ? CT_VIEWER_BASE +
                              "?StudyInstanceUIDs=" +
                              encodeURIComponent(studyUID)
                            : null;

                        const seriesCount = study.series.length;
                        const seriesBg = si % 2 === 0 ? "#fbfbfd" : "#f2f2f2";

                        rows.push(
                          <tr
                            key={`${idx}-study-${si}`}
                            style={{
                              background: seriesBg,
                            }}
                          >
                            <td style={{ padding: "6px 8px" }}>{caseId}</td>
                            <td
                              style={{
                                padding: "6px 8px",
                                wordBreak: "break-all",
                              }}
                            >
                              {studyUID ?? "(/)"}
                            </td>
                            <td
                              style={{
                                padding: "6px 8px",
                                textAlign: "center",
                                color: "#444",
                              }}
                            >
                              {/* show number of series in this study */}
                              {seriesCount > 0
                                ? `${seriesCount} series`
                                : "(/)"}
                            </td>
                            <td style={{ padding: "6px 8px" }}>
                              {studyIdcLink ? (
                                <a
                                  href={studyIdcLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Open study
                                </a>
                              ) : (
                                <span style={{ color: "#666" }}>(n/a)</span>
                              )}
                            </td>
                            <td style={{ padding: "6px 8px" }}>
                              {studyRadiologyLink ? (
                                <a
                                  href={studyRadiologyLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Open study
                                </a>
                              ) : (
                                <span style={{ color: "#666" }}>(n/a)</span>
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
            </>
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
