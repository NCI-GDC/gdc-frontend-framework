// File: `packages/portal-proto/src/features/proteinpaint/IDCViewerWrapper.tsx`
import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { compressors } from "hyparquet-compressors";
import { parquetReadObjects } from "hyparquet";
import {
  convertFilterToGqlFilter,
  fetchGdcCases as fetchGdcCasesApi,
  filterSetToOperation,
  GqlOperation,
  SortBy,
  useCurrentCohortFilters,
} from "@gff/core";
import VerticalTable from "@/components/Table/VerticalTable";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import ExpandRowComponent from "@/components/Table/ExpandRowComponent";
import useStandardPagination from "@/hooks/useStandardPagination";
import { LoadingOverlay } from "@mantine/core";

/**
 * Cleaned IDCViewerWrapper:
 *  - Automatically runs mapping on mount (no button click required)
 */

const SLIM_VIEWER_BASE =
  "https://viewer.imaging.datacommons.cancer.gov/slim/studies/";

const CT_VIEWER_BASE =
  "https://viewer.imaging.datacommons.cancer.gov/v3/viewer/";

const IDC_PARQUET_URL =
  "https://storage.googleapis.com/idc-index-data-artifacts/current/release_artifacts/gdc_idc_mapping.parquet";

// Columns list for IDC parquet reads
const IDC_PARQUET_COLUMNS = [
  "PatientID",
  "StudyInstanceUID",
  "StudyDate",
  "StudyDescription",
  "study_type",
  "gdc_case_id",
];

// Helper: read idc_data from a parquet file
async function readParquetIndex(
  idc_index_file: any,
): Promise<{ idc_data: ReadonlyArray<any>; case_ids: readonly string[] }> {
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

  return { idc_data: idc_data as ReadonlyArray<any>, case_ids: gdcCaseIds };
}

const IDCViewerWrapper: FC = () => {
  const [mappings, setMappings] = useState<any[]>([]);
  // track non-transient load/render errors
  const [loadError, setLoadError] = useState<string | null>(null);

  const idcViewerRootDivRef = useRef<HTMLDivElement | null>(null);
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
  // NEW: global loading state for parquet download/parsing + GDC fetch
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // helper to toggle when VerticalTable calls setExpanded(row, columnId)
  const setTableExpanded = useCallback(
    (row: any /* tanstack Row */) => {
      // row.id is computed by getRowId (we will use caseId)
      if (!row?.id) return;
      toggleExpanded(row.id);
    },
    [toggleExpanded],
  );

  const buildSlimStudyURL = (studyInstanceUID: string) =>
    SLIM_VIEWER_BASE + encodeURIComponent(studyInstanceUID);

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

  // Helper: ensure IDC metadata is loaded (no cache, always download & parse)
  const loadIdcData = useCallback(async () => {
    const resp = await fetch(IDC_PARQUET_URL);
    if (!resp.ok) {
      throw new Error(
        `Failed to fetch parquet: ${resp.status} ${resp.statusText}`,
      );
    }
    const arrayBuffer = await resp.arrayBuffer();
    return await readParquetIndex(arrayBuffer);
  }, []);

  // Map sorting (table) -> API SortBy
  const mapSortingToSortBy = useCallback((): ReadonlyArray<SortBy> => {
    const COLUMN_ID_TO_FIELD: Record<string, string> = {
      caseId: "submitter_id",
      program: "project.program.name",
    };
    if (!sorting || sorting.length === 0) return [];
    return sorting.map((s) => {
      const field = COLUMN_ID_TO_FIELD[String(s.id)] ?? String(s.id);
      return { field, direction: s.desc ? "desc" : "asc" } as SortBy;
    });
  }, [sorting]);

  // fetch all matching GDC cases in chunks and build mappings once ---
  const fetchAllGdcCasesAndMap = useCallback(async () => {
    // prevent re-entrant calls
    if (fetchInProgressRef.current) {
      return;
    }
    fetchInProgressRef.current = true;
    setIsLoading(true);
    setLoadError(null); // clear previous error when starting a new fetch
    try {
      const caseFiltersArg = cohortGqlFilters
        ? convertFilterToGqlFilter(cohortGqlFilters)
        : undefined;

      // ensure IDC data is loaded to get case_ids
      const { idc_data, case_ids } = await loadIdcData();

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

      // build mappings from allHits and idc_data
      const mappings = allHits.map((gdcCase: any) => {
        const submitterId = gdcCase?.submitter_id;
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
      // surface a user-friendly error message in the UI
      setLoadError(
        "There was an error rendering IDC table, please try again later.",
      );
    } finally {
      fetchInProgressRef.current = false;
      setIsLoading(false);
    }
  }, [cohortGqlFilters, loadIdcData, mapSortingToSortBy]);

  useEffect(() => {
    fetchAllGdcCasesAndMap();
    // intentionally only depend on sorting and the stable cohortFiltersKey
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting, cohortFiltersKey]);

  useEffect(() => {
    const root = idcViewerRootDivRef.current;
    if (!root) return;
    root.style.background = "#fff";
    return () => {
      if (root) root.innerHTML = "";
    };
  }, []);

  // derive tableData from mappings (convert mapping -> table row objects)
  const tableData = useMemo(() => {
    return (mappings || []).map((m) => {
      const caseId = m.gdcCase?.submitter_id ?? "n/a";
      const programName = m.gdcCase?.project?.program?.name ?? "n/a";

      // group rows by StudyInstanceUID
      const studiesMap = new Map();
      (m.matches || []).forEach((r: any) => {
        const studyId = r?.StudyInstanceUID ?? "n/a";
        if (!studiesMap.has(studyId)) {
          studiesMap.set(studyId, {
            StudyInstanceUID: r?.StudyInstanceUID ?? null,
            series: [],
            hasWSI: false,
            hasRadiology: false,
            StudyDate: r?.StudyDate ?? "n/a",
            StudyDescription: r?.StudyDescription ?? null,
          });
        }
        const st = studiesMap.get(studyId);
        st.series.push(r);
        const rawMod = (r?.study_type ?? "").toString();
        const mod = rawMod.trim().toUpperCase();
        if (mod === "M") st.hasWSI = true;
        if (mod === "R") st.hasRadiology = true;
      });

      const studiesList = Array.from(studiesMap.values());

      // compute counts for non-expanded row display
      const wsiCount = studiesList.filter((s) => s.hasWSI).length;
      const radiologyCount = studiesList.filter((s) => s.hasRadiology).length;

      return {
        caseId,
        programName,
        studiesList,
        studiesCount: studiesList.length,
        wsiCount,
        radiologyCount,
      };
    });
  }, [mappings]);

  const columns: ColumnDef<any>[] = useMemo(
    () => [
      {
        id: "caseId",
        accessorFn: (row) => row.caseId,
        header: "GDC Case ID",
        cell: (info) => info.getValue(),
        enableSorting: true, // <-- enable sorting for caseId (maps to submitter_id)
      },
      {
        id: "program",
        accessorFn: (row) => row.programName,
        header: "Program",
        cell: (info) => info.getValue(),
        enableSorting: true,
      },
      {
        id: "matches",
        accessorFn: (row) =>
          row.studiesList.map((s) => s.StudyInstanceUID ?? "(/)"),
        header: "IDC Studies (Click to expand)",
        cell: (info) => {
          // Show only total number of studies and make it clickable to toggle expansion
          const arr = info.getValue() as string[] | undefined;
          const count = Array.isArray(arr) ? arr.length : 0;

          const studies = (info.row?.original?.studiesList as any[]) ?? [];
          const wsiCount = studies.filter((s) => s?.hasWSI).length;
          const radiologyCount = studies.filter((s) => s?.hasRadiology).length;

          const idcNoun = count === 1 ? "IDC study" : "IDC studies";
          const wsiLabel = `${wsiCount} WSI`;
          const radioLabel = `${radiologyCount} Radiology`;
          const titleLabel = `${idcNoun} (${wsiLabel} + ${radioLabel})`;

          if (count === 0) {
            return <span style={{ color: "#666" }}>-</span>;
          }

          return (
            <div
              onClick={(e) => {
                e.stopPropagation();
                setTableExpanded(info.row);
              }}
              onKeyDown={(e: React.KeyboardEvent) => {
                // Activate on Enter or Space keys
                if (
                  e.key === "Enter" ||
                  e.key === " " ||
                  e.key === "Spacebar"
                ) {
                  e.preventDefault();
                  e.stopPropagation();
                  setTableExpanded(info.row);
                }
              }}
              title={`${count} ${titleLabel}`}
              role="button"
              tabIndex={0}
              aria-expanded={Boolean(info.row.getIsExpanded())}
              aria-label={`${count} ${titleLabel}. Press Enter or Space to expand.`}
              style={{ display: "inline-block" }}
            >
              <ExpandRowComponent
                isRowExpanded={info.row.getIsExpanded()}
                value={arr ?? []}
                isColumnExpanded={true}
                handleOneElementValue={false}
                title={titleLabel}
              />
            </div>
          );
        },
        enableSorting: false,
      },
    ],
    [setTableExpanded],
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
      ref={idcViewerRootDivRef}
      className="idc-viewer-wrapper-root"
      style={{ padding: 12 }}
    >
      <div style={{ marginTop: 12 }}>
        <div style={{ maxHeight: 460, overflow: "auto" }}>
          <div style={{ position: "relative", minHeight: 120 }}>
            <LoadingOverlay visible={isLoading} zIndex={50} />
            {!isLoading &&
              (loadError ? (
                <div
                  data-testid="idc-error-message"
                  style={{ padding: 16, color: "#900", fontSize: 14 }}
                >
                  There was an error rendering IDC table, please try again
                  later.
                </div>
              ) : tableData.length === 0 ? (
                <div
                  data-testid="no-idc-message"
                  style={{ padding: 16, color: "#666", fontSize: 14 }}
                >
                  No idc images for selected cohort.
                </div>
              ) : (
                // VerticalTable-based view
                (() => {
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
                              <th style={{ padding: 6 }}>
                                IDC StudyInstanceUID
                              </th>
                              <th style={{ padding: 6 }}>StudyDate</th>
                              <th style={{ padding: 6 }}>StudyDescription</th>
                              <th style={{ padding: 6 }}>IDC WSI viewer</th>
                              <th style={{ padding: 6 }}>
                                IDC Radiology viewer
                              </th>
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
                                    background:
                                      i % 2 === 0 ? "#fbfbfd" : "#f2f2f2",
                                  }}
                                >
                                  <td
                                    style={{
                                      padding: 6,
                                      wordBreak: "break-all",
                                    }}
                                  >
                                    {s.StudyInstanceUID ?? "(/)"}
                                  </td>
                                  <td style={{ padding: 6 }}>
                                    {s.StudyDate ?? "-"}
                                  </td>
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
                      getRowCanExpand={(_: any) => true}
                      expandableColumnIds={["matches"]}
                      expanded={expandedState}
                      setExpanded={(row: any) => setTableExpanded(row)}
                      getRowId={(row: any) => row.caseId}
                      renderSubComponent={renderSubComponent}
                      pagination={pagination}
                      handleChange={handleTableChange}
                      columnSorting="manual"
                      sorting={sorting}
                      setSorting={setSorting}
                    />
                  );
                })()
              ))}
          </div>
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
