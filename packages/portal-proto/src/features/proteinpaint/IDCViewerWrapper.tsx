// File: `packages/portal-proto/src/features/proteinpaint/IDCViewerWrapper.tsx`
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import {
  PROTEINPAINT_API,
  fetchGdcCases as fetchGdcCasesApi,
  useCurrentCohortFilters,
  filterSetToOperation,
  convertFilterToGqlFilter, // added: convert Operation -> GqlOperation
  useCurrentCohortCounts,
  GqlOperation, // added hook to get cohort case count
} from "@gff/core";
// replaced TableView with VerticalTable + helpers
import VerticalTable from "@/components/Table/VerticalTable";
import { ColumnDef } from "@tanstack/react-table";
import ExpandRowComponent from "@/components/Table/ExpandRowComponent";

/**
 * Cleaned IDCViewerWrapper:
 *  - Automatically runs mapping on mount (no button click required)
 *  - Caches parsed parquet results in Cache Storage (`idc_data.json`)
 */

const SLIM_VIEWER_BASE =
  "https://viewer.imaging.datacommons.cancer.gov/slim/studies/";

const CT_VIEWER_BASE =
  "https://viewer.imaging.datacommons.cancer.gov/v3/viewer/";

// Reusable columns list for IDC parquet reads (reverted for new format)
const IDC_PARQUET_COLUMNS = [
  "case_id",
  "PatientID",
  "StudyInstanceUID",
  "Modality",
  "StudyDate",
  "StudyDescription",
];

// Helper: read idc_data from a parquet file buffer (updated for new format)
async function readParquetIndex(
  hyparquet: any,
  idc_index_file: any,
): Promise<{ idc_data: any[]; case_ids: string[] }> {
  const idc_data = await hyparquet.parquetReadObjects({
    file: idc_index_file,
    columns: IDC_PARQUET_COLUMNS,
  });

  // Extract unique case_ids from the parquet data
  const caseIdSet = new Set<string>();
  idc_data.forEach((o: any) => {
    if (o.case_id) caseIdSet.add(o.case_id);
  });
  const case_ids = Array.from(caseIdSet);

  return { idc_data, case_ids };
}

// Helper: cache parsed IDC metadata
const IDCViewerWrapper: FC = () => {
  const [progress, setProgress] = useState<string>("Idle");
  const [logs, setLogs] = useState<string[]>([]);
  const [mappings, setMappings] = useState<any[]>([]);
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
  // derived object for VerticalTable controlled `expanded` prop
  const expandedState = React.useMemo(() => {
    const o: Record<string, boolean> = {};
    expandedCases.forEach((id) => {
      o[id] = true;
    });
    return o;
  }, [expandedCases]);
  // helper to toggle when VerticalTable calls setExpanded(row, columnId)
  const setTableExpanded = useCallback(
    (row: any /* tanstack Row */) => {
      // row.id is computed by getRowId (we will use caseId)
      if (!row?.id) return;
      toggleExpanded(row.id);
    },
    [toggleExpanded],
  );

  const addLog = (s: string) => setLogs((l) => [...l, s]);
  const buildSlimStudyURL = (studyInstanceUID: string) =>
    SLIM_VIEWER_BASE + encodeURIComponent(studyInstanceUID);

  const [cachedIdcData, setCachedIdcData] = useState<any[] | null>(null);
  const [cachedCaseIds, setCachedCaseIds] = useState<string[] | null>(null);

  // use current cohort filters (hook)
  const currentCohortFilterSet = useCurrentCohortFilters();
  // convert FilterSet -> Operation (internal representation)
  const cohortGqlFilters = currentCohortFilterSet
    ? filterSetToOperation(currentCohortFilterSet)
    : undefined;

  // Helper: fetch GDC cases for a page (pageIndex, pageSize)
  async function fetchGdcCases(pageSize: number, pageIndex: number) {
    try {
      const caseFiltersArg = cohortGqlFilters
        ? convertFilterToGqlFilter(cohortGqlFilters)
        : undefined;

      // Load all GDC case_ids from the new parquet file (via cached IDC data)
      const { case_ids } = await loadIdcDataIfNeeded();

      // Pass GDC case ids directly to filters
      const id_filters: GqlOperation = {
        op: "in",
        content: {
          field: "case_id",
          value: case_ids, // string[]
        },
      };

      const extendedFilters = mergeWithAndFilters(caseFiltersArg, id_filters);

      addLog(
        `Fetching GDC cases with cohort filters (GQL op): ${JSON.stringify(
          caseFiltersArg || {},
        )}`,
      );
      const casesResp = await fetchGdcCasesApi({
        fields: ["submitter_id", "disease_type", "primary_site"],
        size: pageSize,
        from: 0, // always start from 0 since we already paginated case_ids
        case_filters: extendedFilters, // pass converted GqlOperation
        expand: ["samples.portions.slides", "project.program"],
      });

      const hits = casesResp?.data?.hits || [];

      addLog(
        `Fetched ${hits.length} hits (pageIndex=${pageIndex}, pageSize=${pageSize})`,
      );

      // return filtered full case objects (we need project.program in mapping)
      return hits;
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
        case_ids: cachedCaseIds ?? [],
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
        setCachedCaseIds(parsed.case_ids || []);
        setCachedIdcData(parsed.idc_data || []);
        setProgress("Ready");
        return {
          idc_data: parsed.idc_data || [],
          case_ids: parsed.case_ids || [],
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
        setCachedCaseIds(parsed.case_ids);
        try {
          const jsonString = JSON.stringify({
            case_ids: parsed.case_ids,
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
      setCachedCaseIds(parsed.case_ids);
      return parsed;
    }
  }, [cachedIdcData, cachedCaseIds]);

  // Load a single page of GDC cases (pageIndex starts at 0)
  const loadPage = useCallback(
    async (pageIndex: number, pageSizeArg?: number) => {
      try {
        setProgress(`Loading page ${pageIndex}...`);
        addLog(`Loading GDC page ${pageIndex}`);

        const ps = pageSizeArg ?? 10;

        // fetch GDC case objects
        const gdcCases = await fetchGdcCases(ps, pageIndex);

        addLog(
          `Retrieved ${gdcCases.length} GDC case(s) from GDC API (page ${pageIndex})`,
        );

        // Load IDC data for mapping
        const { idc_data } = await loadIdcDataIfNeeded();

        // Mapping logic: for each GDC case, find all IDC rows where PatientID matches submitter_id
        const mappings = gdcCases.map((gdcCase: any) => {
          const submitterId =
            gdcCase?.submitter_id ??
            gdcCase?.case_id ??
            gdcCase?.case_uuid ??
            null;
          // Find all IDC rows with matching PatientID
          const matches = idc_data.filter(
            (row: any) =>
              row.PatientID &&
              submitterId &&
              row.PatientID.toString() === submitterId.toString(),
          );
          return {
            gdcCase,
            matches,
          };
        });

        setMappings(mappings);
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
    loadPage(0, 10);
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

  // Handler passed to TablePagination via VerticalTable
  const handleTableChange = useCallback(
    (obj: { newPageNumber?: number; newPageSize?: string | number }) => {
      if (obj.newPageSize !== undefined) {
        const newSize =
          typeof obj.newPageSize === "string"
            ? parseInt(obj.newPageSize)
            : obj.newPageSize;
        // reload first page when page size changes
        loadPage(0, newSize);
        return;
      }
      if (obj.newPageNumber !== undefined) {
        const pageIndex = Math.max(0, obj.newPageNumber - 1);
        // Use current page size from pagination (default to 10)
        loadPage(pageIndex);
      }
    },
    [loadPage],
  );

  // Build pagination object for VerticalTable / TablePagination (reuse CasesView logic)
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = gdcCount ? Math.max(0, Math.ceil(gdcCount / pageSize)) : 0;
  const pagination = {
    size: pageSize,
    page: currentPage + 1, // TablePagination expects 1-based page
    pages: totalPages,
    from: currentPage * pageSize + 1,
    total: gdcCount ?? undefined,
    label: "study",
    customPluralLabel: "study",
  };

  return (
    <div
      ref={divRef}
      className="idc-viewer-wrapper-root"
      style={{ padding: 12 }}
    >
      <div style={{ marginTop: 12 }}>
        <div style={{ maxHeight: 460, overflow: "auto" }}>
          {/* VerticalTable-based view (replaces TableView */}
          {/*
            Build the table columns and data from `mappings`.
            We preserve expand/collapse by:
              - using getRowId -> caseId
              - passing `expanded` as object derived from expandedCases
              - passing setExpanded which toggles the Set via toggleExpanded
          */}
          {(() => {
            // prepare table data
            const tableData = (mappings || []).map((m) => {
              const caseId =
                m.gdcCase?.submitter_id ??
                m.gdcCase?.case_id ??
                m.gdcCase?.case_uuid ??
                "(no id)";
              const programName =
                m.gdcCase?.project?.program?.name ?? "(no program)";

              // group rows by StudyInstanceUID
              const studiesMap = new Map();
              (m.matches || []).forEach((r: any) => {
                const studyId = r?.StudyInstanceUID ?? "__NO_STUDY__";
                if (!studiesMap.has(studyId)) {
                  studiesMap.set(studyId, {
                    StudyInstanceUID: r?.StudyInstanceUID ?? null,
                    series: [],
                    hasWSI: false,
                    hasRadiology: false,
                    StudyDate: r?.StudyDate ?? null,
                    StudyDescription: r?.StudyDescription ?? null,
                  });
                }
                const st = studiesMap.get(studyId);
                st.series.push(r);
                const mod = (r?.Modality ?? "").toString().trim().toUpperCase();
                if (mod === "WSI") st.hasWSI = true;
                if (mod === "CT") st.hasRadiology = true;
              });

              const studiesList = Array.from(studiesMap.values());

              // derive quick-first-links for compact cells
              const firstStudyWithWSI = studiesList.find((s) => s.hasWSI);
              const firstStudyWithRadio = studiesList.find(
                (s) => s.hasRadiology,
              );
              const firstWsiLink = firstStudyWithWSI?.StudyInstanceUID
                ? buildSlimStudyURL(firstStudyWithWSI.StudyInstanceUID)
                : null;
              const firstRadioLink = firstStudyWithRadio?.StudyInstanceUID
                ? CT_VIEWER_BASE +
                  "?StudyInstanceUIDs=" +
                  encodeURIComponent(firstStudyWithRadio.StudyInstanceUID)
                : null;

              return {
                caseId,
                programName,
                studiesList,
                studiesCount: studiesList.length,
                firstWsiLink,
                firstRadioLink,
                _originalMapping: m,
              };
            });

            // columns
            const columns: ColumnDef<any>[] = [
              {
                id: "caseId",
                accessorFn: (row) => row.caseId,
                header: "GDC caseId",
                cell: (info) => info.getValue(),
              },
              {
                id: "program",
                accessorFn: (row) => row.programName,
                header: "Program",
                cell: (info) => info.getValue(),
              },
              {
                id: "matches",
                accessorFn: (row) =>
                  row.studiesList.map((s) => s.StudyInstanceUID ?? "(/)"),
                header: "IDC StudyInstanceUUID",
                cell: (info) => {
                  const arr = info.getValue() as string[];
                  // Render the compact expand/collapse indicator (reuse ExpandRowComponent)
                  return (
                    <ExpandRowComponent
                      isRowExpanded={info.row.getIsExpanded()}
                      value={arr}
                      isColumnExpanded={true}
                      title="study"
                    />
                  );
                },
              },
              {
                id: "wsi",
                accessorFn: (row) => row.firstWsiLink,
                header: "WSI link",
                cell: (info) =>
                  info.getValue() ? (
                    <a
                      href={info.getValue().toString()}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Open study
                    </a>
                  ) : (
                    <span style={{ color: "#666" }}>-</span>
                  ),
              },
              {
                id: "radiology",
                accessorFn: (row) => row.firstRadioLink,
                header: "Radiology Link",
                cell: (info) =>
                  info.getValue() ? (
                    <a
                      href={info.getValue().toString()}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Open study
                    </a>
                  ) : (
                    <span style={{ color: "#666" }}>-</span>
                  ),
              },
            ];

            // renderSubComponent: show detailed studies list for expanded row
            const renderSubComponent = ({ row }: any) => {
              const studies = row.original.studiesList as any[];
              if (!studies || studies.length === 0) return null;
              return (
                <div style={{ padding: 8, background: "#fff" }}>
                  <table
                    style={{
                      width: "100%",
                      fontSize: 13,
                      borderCollapse: "collapse",
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          textAlign: "left",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        <th style={{ padding: 6 }}>StudyInstanceUID</th>
                        <th style={{ padding: 6 }}>StudyDate</th>
                        <th style={{ padding: 6 }}>StudyDescription</th>
                        <th style={{ padding: 6 }}>WSI</th>
                        <th style={{ padding: 6 }}>Radiology</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studies.map((s, i) => {
                        const wsiLink =
                          s.hasWSI && s.StudyInstanceUID
                            ? buildSlimStudyURL(s.StudyInstanceUID)
                            : null;
                        const radioLink =
                          s.hasRadiology && s.StudyInstanceUID
                            ? CT_VIEWER_BASE +
                              "?StudyInstanceUIDs=" +
                              encodeURIComponent(s.StudyInstanceUID)
                            : null;
                        return (
                          <tr
                            key={i}
                            style={{
                              background: i % 2 === 0 ? "#fbfbfd" : "#f2f2f2",
                            }}
                          >
                            <td style={{ padding: 6, wordBreak: "break-all" }}>
                              {s.StudyInstanceUID ?? "(/)"}
                            </td>
                            <td style={{ padding: 6 }}>{s.StudyDate ?? "-"}</td>
                            <td style={{ padding: 6 }}>
                              {s.StudyDescription ?? "-"}
                            </td>
                            <td style={{ padding: 6 }}>
                              {wsiLink ? (
                                <a
                                  href={wsiLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Open study
                                </a>
                              ) : (
                                <span style={{ color: "#666" }}>-</span>
                              )}
                            </td>
                            <td style={{ padding: 6 }}>
                              {radioLink ? (
                                <a
                                  href={radioLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Open study
                                </a>
                              ) : (
                                <span style={{ color: "#666" }}>-</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            };

            return (
              <VerticalTable
                columns={columns}
                data={tableData}
                tableTitle={undefined}
                // expansion control
                getRowCanExpand={(row: any) =>
                  Array.isArray(row.original?.studiesList) &&
                  row.original.studiesList.length > 0
                }
                expandableColumnIds={["matches"]}
                expanded={expandedState}
                setExpanded={(row: any) => setTableExpanded(row)}
                // ensure row ids come from caseId
                getRowId={(row: any) => row.caseId}
                renderSubComponent={renderSubComponent}
                // pagination integration (uses TablePagination internally)
                pagination={pagination}
                handleChange={handleTableChange}
              />
            );
          })()}
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

// Utility to merge two GqlOperation filters with "and"
function mergeWithAndFilters(
  filterA: GqlOperation,
  filterB: GqlOperation,
): GqlOperation {
  if (filterA.op === "and" && filterB.op === "and") {
    return { op: "and", content: [...filterA.content, ...filterB.content] };
  }
  if (filterA.op === "and") {
    return { op: "and", content: [...filterA.content, filterB] };
  }
  if (filterB.op === "and") {
    return { op: "and", content: [filterA, ...filterB.content] };
  }
  return { op: "and", content: [filterA, filterB] };
}

export default IDCViewerWrapper;
