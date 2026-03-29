import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import {
  Row,
  createColumnHelper,
  ColumnDef,
  SortingState,
  ExpandedState,
} from "@tanstack/react-table";
import { compressors } from "hyparquet-compressors";
import { parquetReadObjects } from "hyparquet";
import {
  convertFilterToGqlFilter,
  useGetCasesQuery,
  filterSetToOperation,
  GqlOperation,
  SortBy,
  useCurrentCohortFilters,
  Pagination,
} from "@gff/core";
import { useDeepCompareMemo, useDeepCompareEffect } from "use-deep-compare";
import VerticalTable from "@/components/Table/VerticalTable";
import IDCExpandRowComponent from "./IDCExpandRowComponent";
import { LoadingOverlay } from "@mantine/core";
import IDCStudyRowsComponent from "@/features/idc/IDCStudyRowsComponent";
import { IDCStudy, IDCViewerRow } from "@/features/idc/types";
import { PaginationOptions } from "@/components/Table/types";

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
  // Global loading state for parquet download/parsing + GDC fetch
  const [parquetLoading, setParquetLoading] = useState<boolean>(false);
  const [mappings, setMappings] = useState<any[]>([]);
  const [loadError, setLoadError] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<ExpandedState>({});
  // server-side pagination state
  const [pageSize, setPageSize] = useState(20);
  const [activePage, setActivePage] = useState(1);

  // helper to toggle when VerticalTable calls setExpanded(row, columnId)
  const setTableExpanded = useCallback((row: Row<IDCViewerRow>) => {
    // row.id is computed by getRowId (we will use caseId)
    if (!row?.id) return;
    setExpanded((prev) => {
      // ExpandedState can be `true` or a Record<string, boolean>. Normalize to an object.
      const prevMap: Record<string, boolean> =
        prev && typeof prev === "object"
          ? (prev as Record<string, boolean>)
          : {};
      return { ...prevMap, [row.id]: !prevMap[row.id] };
    });
  }, []);

  const [sorting, setSorting] = useState<SortingState>([
    { id: "caseId", desc: false },
  ]);

  const currentCohortFilterSet = useCurrentCohortFilters();
  const cohortGqlFilters = useDeepCompareMemo(() => {
    return currentCohortFilterSet
      ? filterSetToOperation(currentCohortFilterSet)
      : undefined;
  }, [currentCohortFilterSet]);

  // Parquet data loaded once on mount
  const [idcData, setIdcData] = useState<
    | {
        idc_data: ReadonlyArray<IDCParquetData>;
        case_ids: readonly string[];
      }
    | undefined
  >(undefined);

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

  useEffect(() => {
    let mounted = true;
    const loadIdc = async () => {
      setParquetLoading(true);
      setLoadError(false);
      try {
        const resp = await fetch(IDC_PARQUET_URL);
        if (!resp.ok) {
          throw new Error(
            `Failed to fetch parquet: ${resp.status} ${resp.statusText}`,
          );
        }
        const arrayBuffer = await resp.arrayBuffer();
        const parsed = await readParquetIndex(arrayBuffer);
        if (mounted) setIdcData(parsed);
      } catch (err) {
        setLoadError(true);
      } finally {
        if (mounted) setParquetLoading(false);
      }
    };

    loadIdc();

    return () => {
      mounted = false;
    };
  }, []);

  const extendedFilters = useDeepCompareMemo(() => {
    if (!idcData) return undefined;

    const id_filters: GqlOperation = {
      op: "in",
      content: {
        field: "case_id",
        value: idcData.case_ids,
      },
    };

    const caseFiltersArg = cohortGqlFilters
      ? convertFilterToGqlFilter(cohortGqlFilters)
      : undefined;

    return caseFiltersArg
      ? mergeWithAndFilters(caseFiltersArg, id_filters)
      : id_filters;
  }, [idcData, cohortGqlFilters]);

  const sortByForApi = mapSortingToSortBy();

  // Use the standard query hook; skip the query until parquet is loaded.
  const {
    data: casesResponse,
    isFetching: casesLoading,
    isError: casesError,
  } = useGetCasesQuery({
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

  // combined visibility for the LoadingOverlay: parquet load or remote fetch
  const overlayVisible = parquetLoading || casesLoading;

  // surface API errors to the shared loadError state so the UI can render
  useEffect(() => {
    if (casesError) {
      setLoadError(true);
    }
  }, [casesError]);

  // When either the cases data or parquet idc data changes, rebuild mappings.
  useDeepCompareEffect(() => {
    const allHits = casesResponse?.hits || [];

    // build mappings from allHits and idc_data
    const mappings = allHits.map((gdcCase: any) => {
      const submitterId = gdcCase?.submitter_id;
      const matches = (
        (idcData?.idc_data ?? []) as ReadonlyArray<IDCParquetData>
      ).filter(
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
  }, [casesResponse, idcData]);

  // when cohort filters change (deep-compare), reset to first page
  useDeepCompareEffect(() => {
    setActivePage(1);
  }, [currentCohortFilterSet]);

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
        enableSorting: true,
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
              <IDCExpandRowComponent
                isRowExpanded={info.row.getIsExpanded()}
                value={arr ?? []}
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

  const apiPagination: Pagination = casesResponse?.pagination;

  const pagination: PaginationOptions = {
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
            <LoadingOverlay visible={overlayVisible} zIndex={50} />
            {!overlayVisible &&
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
                <VerticalTable
                  columns={columns}
                  data={tableData}
                  tableTitle={undefined}
                  getRowCanExpand={(_: any) => true}
                  expandableColumnIds={["matches"]}
                  expanded={expanded}
                  setExpanded={(row) => setTableExpanded(row)}
                  getRowId={(row) => row.caseId}
                  renderSubComponent={({ row }) => (
                    <IDCStudyRowsComponent row={row} />
                  )}
                  pagination={pagination}
                  handleChange={handleTableChange}
                  columnSorting="manual"
                  sorting={sorting}
                  setSorting={setSorting}
                />
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
