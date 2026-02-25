// File: `packages/portal-proto/src/features/proteinpaint/IDCViewerWrapper.tsx`
import React, {
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import {
  PROTEINPAINT_API,
  fetchGdcCases as fetchGdcCasesApi,
  useCurrentCohortFilters,
  filterSetToOperation,
  convertFilterToGqlFilter, // added: convert Operation -> GqlOperation
  useCurrentCohortCounts,
  GqlOperation, // added hook to get cohort case count
  SortBy, // keep SortBy type import
} from "@gff/core";
// replaced TableView with VerticalTable + helpers
import VerticalTable from "@/components/Table/VerticalTable";
import { ColumnDef, SortingState } from "@tanstack/react-table"; // <-- added SortingState
import ExpandRowComponent from "@/components/Table/ExpandRowComponent";
import useStandardPagination from "@/hooks/useStandardPagination";

/**
 * Cleaned IDCViewerWrapper:
 *  - Automatically runs mapping on mount (no button click required)
 *  - Caches parsed parquet results in Cache Storage (`idc_data.json`)
 */

const SLIM_VIEWER_BASE =
  "https://viewer.imaging.datacommons.cancer.gov/slim/studies/";

const CT_VIEWER_BASE =
  "https://viewer.imaging.datacommons.cancer.gov/v3/viewer/";

// Reusable columns list for IDC parquet reads (use study_type, remove Modality)
const IDC_PARQUET_COLUMNS = [
  "PatientID",
  "StudyInstanceUID",
  "StudyDate",
  "StudyDescription",
  "study_type",
  "gdc_case_id",
  "in_gdc",
];

// Helper: read idc_data from a parquet file buffer (updated for new format)
async function readParquetIndex(
  hyparquet: any,
  idc_index_file: any,
): Promise<{ idc_data: ReadonlyArray<any>; case_ids: readonly string[] }> {
  const raw_rows = await hyparquet.parquetReadObjects({
    file: idc_index_file,
    columns: IDC_PARQUET_COLUMNS,
  });

  // Filter rows to just those that are in_gdc === true (accept string/bool)
  const idc_data = (raw_rows || []).filter((o: any) => {
    if (o == null) return false;
    const v = o.in_gdc;
    if (typeof v === "boolean") return v === true;
    if (v == null) return false;
    return String(v).toLowerCase() === "true";
  });

  // Normalize StudyDate default and ensure minimal fields are present
  idc_data.forEach((o: any) => {
    if (!o.StudyDate || String(o.StudyDate).trim() === "") {
      // default StudyDate when missing
      o.StudyDate = "n/a";
    }
    // keep other fields as-is (PatientID, StudyInstanceUID, StudyDescription, Modality, study_type, gdc_case_id)
  });

  // Extract unique case_ids from the filtered parquet data
  const caseIdSet = new Set<string>();
  idc_data.forEach((o: any) => {
    // prefer gdc_case_id, fall back to case_id or PatientID
    const cid = o?.gdc_case_id ?? o?.case_id ?? o?.PatientID ?? null;
    if (cid) caseIdSet.add(String(cid));
  });
  const case_ids = Array.from(caseIdSet) as readonly string[];

  return { idc_data: idc_data as ReadonlyArray<any>, case_ids };
}

// Helper: cache parsed IDC metadata
const IDCViewerWrapper: FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [mappings, setMappings] = useState<any[]>([]);
  useCurrentCohortCounts();
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

  const [cachedIdcData, setCachedIdcData] = useState<ReadonlyArray<any> | null>(
    null,
  );
  const [cachedCaseIds, setCachedCaseIds] = useState<readonly string[] | null>(
    null,
  );

  // --- NEW: sorting state (tanstack) — user interactions will update this ---
  const [sorting, setSorting] = useState<SortingState>([
    { id: "caseId", desc: false },
  ]);

  // use current cohort filters (hook)
  const currentCohortFilterSet = useCurrentCohortFilters();

  // Convert FilterSet -> Operation, but derive it from a stable JSON key so the
  // effect below doesn't retrigger due to changing object identities from the hook.
  const cohortFiltersKey = useMemo(
    () => JSON.stringify(currentCohortFilterSet ?? null),
    [currentCohortFilterSet],
  );
  const cohortGqlFilters = useMemo(
    () =>
      cohortFiltersKey && cohortFiltersKey !== "null"
        ? filterSetToOperation(currentCohortFilterSet as any)
        : undefined,
    // rely on the stable JSON key so this only changes when filter contents change
    [cohortFiltersKey, currentCohortFilterSet],
  );

  // guard against concurrent/overlapping fetches
  const fetchInProgressRef = useRef(false);

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

  // Map sorting (table) -> API SortBy
  const mapSortingToSortBy = useCallback((): ReadonlyArray<SortBy> => {
    const COLUMN_ID_TO_FIELD: Record<string, string> = {
      caseId: "submitter_id",
      program: "project.program.name",
      // add other mappings if you enable more sortable columns
    };
    if (!sorting || sorting.length === 0) return [];
    return sorting.map((s) => {
      const field = COLUMN_ID_TO_FIELD[String(s.id)] ?? String(s.id);
      return { field, direction: s.desc ? "desc" : "asc" } as SortBy;
    });
  }, [sorting]);

  // --- UPDATED: fetch all matching GDC cases in chunks and build mappings once ---
  const fetchAllGdcCasesAndMap = useCallback(async () => {
    // prevent re-entrant calls
    if (fetchInProgressRef.current) {
      addLog("Fetch already in progress — skipping duplicate call");
      return;
    }
    fetchInProgressRef.current = true;
    try {
      addLog("Preparing to fetch all matching GDC cases");

      const caseFiltersArg = cohortGqlFilters
        ? convertFilterToGqlFilter(cohortGqlFilters)
        : undefined;

      // ensure IDC data is loaded to get case_ids
      const { idc_data, case_ids } = await loadIdcDataIfNeeded();

      const id_filters: GqlOperation = {
        op: "in",
        content: {
          field: "case_id",
          value: case_ids,
        },
      };

      const extendedFilters = caseFiltersArg
        ? mergeWithAndFilters(caseFiltersArg, id_filters)
        : id_filters;

      addLog(
        `Fetching all GDC cases with cohort filters (GQL op): ${JSON.stringify(
          caseFiltersArg || {},
        )} and ${String(case_ids.length)} IDC case_ids`,
      );

      // derive SortBy from table sorting state
      const sortByForApi = mapSortingToSortBy();

      // Fetch all matching GDC cases in a single request (request size = number of case_ids)
      const resp = await fetchGdcCasesApi({
        fields: ["submitter_id", "disease_type", "primary_site", "project"],
        size: case_ids.length,
        from: 0,
        case_filters: extendedFilters,
        expand: ["samples.portions.slides", "project.program"],
        sortBy: sortByForApi.length > 0 ? sortByForApi : undefined,
      });
      const allHits = resp?.data?.hits || [];
      addLog(`Fetched ${allHits.length} hits`);

      addLog(`Total GDC cases fetched: ${allHits.length}`);

      // build mappings from allHits and idc_data
      const mappings = allHits.map((gdcCase: any) => {
        const submitterId =
          gdcCase?.submitter_id ??
          gdcCase?.case_id ??
          gdcCase?.case_uuid ??
          null;
        const matches = (idc_data as ReadonlyArray<any>).filter(
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
    } catch (err: any) {
      addLog(`Failed to fetch GDC cases: ${err?.message ?? String(err)}`);
    } finally {
      fetchInProgressRef.current = false;
    }
  }, [cohortGqlFilters, loadIdcDataIfNeeded, mapSortingToSortBy]); // <-- depends on sorting via mapSortingToSortBy

  // Auto-load all cases+mapping once on mount and whenever sorting or cohort filters change.
  // Use a stable string key for cohort filters to avoid effect retriggers caused by
  // changing object identities from the cohort hook.
  useEffect(() => {
    fetchAllGdcCasesAndMap();
    // intentionally only depend on sorting and the stable cohortFiltersKey
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting, cohortFiltersKey]);

  useEffect(() => {
    const root = divRef.current;
    if (!root) return;
    root.style.background = "#fff";
    return () => {
      if (root) root.innerHTML = "";
    };
  }, []);

  // derive tableData from mappings (convert mapping -> table row objects)
  const tableData = useMemo(() => {
    return (mappings || []).map((m) => {
      const caseId =
        m.gdcCase?.submitter_id ??
        m.gdcCase?.case_id ??
        m.gdcCase?.case_uuid ??
        "(no id)";
      const programName = m.gdcCase?.project?.program?.name ?? "(no program)";

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
            StudyDate: r?.StudyDate ?? "2013-02-01",
            StudyDescription: r?.StudyDescription ?? null,
          });
        }
        const st = studiesMap.get(studyId);
        st.series.push(r);
        // Normalize modality / study type: prefer study_type (Modality removed from parquet)
        const rawMod = (r?.study_type ?? r?.Modality ?? "").toString();
        const mod = rawMod.trim().toUpperCase();
        // treat Histopathology (or legacy WSI) as Histopathology
        if (mod === "HISTOPATHOLOGY") st.hasWSI = true;
        // treat Radiology (or legacy Radio) as Radiology
        if (mod === "RADIOLOGY") st.hasRadiology = true;
      });

      const studiesList = Array.from(studiesMap.values());

      // derive quick-first-links for compact cells
      const firstStudyWithWSI = studiesList.find((s) => s.hasWSI);
      const firstStudyWithRadio = studiesList.find((s) => s.hasRadiology);
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
  }, [mappings]);

  // prepare columns (kept same as before) so hook can use column meta for sorting if needed
  const columns: ColumnDef<any>[] = useMemo(
    () => [
      {
        id: "caseId",
        accessorFn: (row) => row.caseId,
        header: "GDC caseId",
        cell: (info) => info.getValue(),
        enableSorting: true, // <-- enable sorting for caseId (maps to submitter_id)
      },
      {
        id: "program",
        accessorFn: (row) => row.programName,
        header: "Program",
        cell: (info) => info.getValue(),
        enableSorting: true, // <-- enable sorting for program (maps to project.program.name)
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
        header: "Histopathology link",
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
    ],
    [],
  );

  // Use client-side pagination hook (reads page size from VerticalTable via handleChange)
  const {
    handlePageChange,
    handlePageSizeChange,
    page,
    pages,
    size,
    from,
    total,
    displayedData,
  } = useStandardPagination(tableData, columns);

  // map VerticalTable handleChange to hook handlers
  const handleTableChange = useCallback(
    (obj: { newPageNumber?: number; newPageSize?: string | number }) => {
      if (obj.newPageSize !== undefined) {
        const newSize =
          typeof obj.newPageSize === "string"
            ? parseInt(obj.newPageSize)
            : obj.newPageSize;
        handlePageSizeChange(String(newSize));
        return;
      }
      if (obj.newPageNumber !== undefined) {
        handlePageChange(obj.newPageNumber);
      }
    },
    [handlePageChange, handlePageSizeChange],
  );

  // Build pagination object for VerticalTable / TablePagination using hook values
  const pagination = {
    size,
    page,
    pages,
    from: from,
    total,
    label: "study",
    customPluralLabel: "study",
  };

  return (
    <div
      ref={divRef}
      className="idc-viewer-wrapper-root"
      style={{ padding: 12 }}
    >
      {/* Removed manual sort controls — sorting is now handled by the table */}
      <div style={{ marginTop: 12 }}>
        <div style={{ maxHeight: 460, overflow: "auto" }}>
          {/* VerticalTable-based view (replaces TableView */}
          {(() => {
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
                        <th style={{ padding: 6 }}>Histopathology</th>
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
                data={displayedData}
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
                // --- NEW: wire table sorting to manual mode + external sorting state ---
                columnSorting="manual"
                sorting={sorting}
                setSorting={setSorting}
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
