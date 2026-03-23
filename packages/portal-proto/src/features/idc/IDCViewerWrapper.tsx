import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Row,
  createColumnHelper,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";
import { compressors } from "hyparquet-compressors";
import { parquetReadObjects } from "hyparquet";
import {
  convertFilterToGqlFilter,
  useLazyGetCasesQuery,
  filterSetToOperation,
  GqlOperation,
  SortBy,
  useCurrentCohortFilters,
} from "@gff/core";
import VerticalTable from "@/components/Table/VerticalTable";
import IDCStudyRowComponent from "./IDCStudyRowComponent";
import ExpandRowComponent from "@/components/Table/ExpandRowComponent";
import { LoadingOverlay } from "@mantine/core";

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

// Types for table row/study used by the column helper
type IDCStudy = {
  StudyInstanceUID: string;
  series: any[];
  hasWSI: boolean;
  hasRadiology: boolean;
  StudyDate?: string;
  StudyDescription: string;
};

type IDCViewerRow = {
  caseId: string;
  programName: string;
  studiesList: IDCStudy[];
  studiesCount: number;
  wsiCount: number;
  radiologyCount: number;
};

// Type for a single row read from the IDC parquet index.
type IDCParquetData = {
  PatientID: string;
  StudyInstanceUID: string;
  StudyDate: string;
  StudyDescription: string;
  study_type: string;
  gdc_case_id: string;
};

// Helper: read idc_data from a parquet file
async function readParquetIndex(idc_index_file: any): Promise<{
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

const IDCViewerWrapper: FC = () => {
  const [mappings, setMappings] = useState<any[]>([]);
  // track non-transient load/render errors
  const [loadError, setLoadError] = useState<string | null>(null);

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

  // Global loading state for parquet download/parsing + GDC fetch
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // helper to toggle when VerticalTable calls setExpanded(row, columnId)
  const setTableExpanded = useCallback(
    (row: Row<IDCViewerRow>) => {
      // row.id is computed by getRowId (we will use caseId)
      if (!row?.id) return;
      toggleExpanded(row.id);
    },
    [toggleExpanded],
  );

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

  // server-side pagination state
  const [pageSize, setPageSize] = useState(20);
  const [activePage, setActivePage] = useState(1);

  // store API pagination metadata returned from triggerGetCases
  const [apiPagination, setApiPagination] = useState<any>({});

  // RTK Query lazy hook to fetch cases when we have the IDC case_ids available
  const [triggerGetCases] = useLazyGetCasesQuery();

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

      // Fetch matching GDC cases for the current page via RTK Query lazy trigger
      // size/from are controlled by pageSize/activePage so we perform server-side pagination
      const resp = await triggerGetCases({
        request: {
          fields: ["submitter_id", "disease_type", "primary_site", "project"],
          size: pageSize,
          from: (activePage - 1) * pageSize,
          case_filters: extendedFilters,
          expand: ["samples.portions.slides", "project.program"],
          sortBy: sortByForApi.length > 0 ? sortByForApi : undefined,
        },
        fetchAll: false,
      });

      const allHits = resp?.data?.hits || [];
      // capture API pagination metadata so we can render pagination controls
      setApiPagination(resp?.data?.pagination || {});

      // build mappings from allHits and idc_data
      const mappings = allHits.map((gdcCase: any) => {
        const submitterId = gdcCase?.submitter_id;
        const matches = (idc_data as ReadonlyArray<IDCParquetData>).filter(
          (row: IDCParquetData) =>
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
  }, [
    cohortGqlFilters,
    loadIdcData,
    mapSortingToSortBy,
    triggerGetCases,
    pageSize,
    activePage,
  ]);

  useEffect(() => {
    fetchAllGdcCasesAndMap();
    // intentionally only depend on sorting, cohortFiltersKey, and pagination
    // so that changing page/size triggers a refetch
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting, cohortFiltersKey, pageSize, activePage]);

  // when cohort filters change, reset to first page (parity with AnnotationTable)
  useEffect(() => {
    setActivePage(1);
  }, [cohortFiltersKey]);

  // derive tableData from mappings (convert mapping -> table row objects)
  const tableData = useMemo<IDCViewerRow[]>(() => {
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
        const rawMod = r.study_type.toString();
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

  const idcTableColumnHelper = createColumnHelper<IDCViewerRow>();

  const columns = useMemo<ColumnDef<IDCViewerRow>[]>(
    () => [
      idcTableColumnHelper.accessor("caseId", {
        id: "caseId",
        header: "GDC Case ID",
        cell: ({ getValue }) => getValue(),
        enableSorting: true, // maps to submitter_id
      }),
      idcTableColumnHelper.accessor("programName", {
        id: "program",
        header: "Program",
        cell: ({ getValue }) => getValue(),
        enableSorting: true,
      }),
      idcTableColumnHelper.accessor("studiesList", {
        id: "matches",
        header: "IDC Studies (Click to expand)",
        cell: (info) => {
          // Show only total number of studies and make it clickable to toggle expansion
          const studies = info.getValue() as IDCStudy[] | undefined;
          const arr = Array.isArray(studies)
            ? studies.map((s) => s.StudyInstanceUID ?? "(/)")
            : [];
          const count = arr.length;

          const studiesOrig =
            (info.row?.original?.studiesList as IDCStudy[]) ?? [];
          const wsiCount = studiesOrig.filter((s) => s?.hasWSI).length;
          const radiologyCount = studiesOrig.filter(
            (s) => s?.hasRadiology,
          ).length;

          const idcNoun = count === 1 ? "IDC study" : "IDC studies";
          const wsiLabel = `${wsiCount} WSI`;
          const radioLabel = `${radiologyCount} Radiology`;
          const titleLabel = `${idcNoun} (${wsiLabel} + ${radioLabel})`;

          if (count === 0) {
            return <span className="text-gdc-grey">-</span>;
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
              className="inline-block"
            >
              <ExpandRowComponent
                isRowExpanded={info.row.getIsExpanded()}
                value={arr ?? []}
                isColumnExpanded={true}
                renderSingleValueInline={false}
                title={titleLabel}
              />
            </div>
          );
        },
        enableSorting: false,
      }),
    ],
    [setTableExpanded, idcTableColumnHelper],
  );

  // map VerticalTable handleChange to server-side pagination handlers
  const handleTableChange = useCallback(
    (obj: { newPageNumber?: number; newPageSize?: string | number }) => {
      if (obj.newPageSize !== undefined) {
        const newSize =
          typeof obj.newPageSize === "string"
            ? parseInt(obj.newPageSize)
            : obj.newPageSize;
        // read page size from handleTableChange and reset to first page
        setPageSize(Number(newSize));
        setActivePage(1);
        return;
      }
      if (obj.newPageNumber !== undefined) {
        setActivePage(obj.newPageNumber);
      }
    },
    [],
  );

  // Build pagination object for VerticalTable / TablePagination using API metadata
  const pagination = {
    size: apiPagination?.size ?? pageSize,
    page: apiPagination?.page ?? activePage,
    pages: apiPagination?.pages ?? undefined,
    from: apiPagination?.from ?? (activePage - 1) * pageSize,
    total: apiPagination?.total ?? undefined,
    label: "study",
    customPluralLabel: "studies",
  };

  return (
    <div className="idc-viewer-wrapper-root p-3 bg-base-max">
      <div style={{ marginTop: 12 }}>
        <div style={{ maxHeight: 460, overflow: "auto" }}>
          <div style={{ position: "relative", minHeight: 120 }}>
            <LoadingOverlay visible={isLoading} zIndex={50} />
            {!isLoading &&
              (loadError ? (
                <div
                  data-testid="idc-error-message"
                  className="p-4 text-utility-error text-sm"
                >
                  There was an error rendering IDC table, please try again
                  later.
                </div>
              ) : tableData.length === 0 ? (
                <div
                  data-testid="no-idc-message"
                  className="p-4 text-gdc-grey-dark text-sm"
                >
                  No idc images for selected cohort.
                </div>
              ) : (
                // VerticalTable-based view
                (() => {
                  // renderSubComponent: show detailed studies list for expanded row

                  const renderSubComponent = ({ row }: any) => {
                    const studies = row.original.studiesList as any[];
                    return <IDCStudyRowComponent studies={studies} />;
                  };

                  return (
                    <VerticalTable
                      columns={columns}
                      data={tableData}
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
