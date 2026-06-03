import { FC, useCallback, useEffect, useMemo, useState } from "react";
import {
  Row,
  createColumnHelper,
  ColumnDef,
  SortingState,
  ExpandedState,
} from "@tanstack/react-table";
import {
  convertFilterToGqlFilter,
  useGetCasesQuery,
  filterSetToOperation,
  appendFilterToOperation,
  SortBy,
  useCurrentCohortFilters,
  Pagination,
  Includes,
  Intersection,
  Union,
} from "@gff/core";
import { useDeepCompareMemo, useDeepCompareEffect } from "use-deep-compare";
import VerticalTable from "@/components/Table/VerticalTable";
import IDCExpandRowComponent from "./IDCExpandRowComponent";
import { LoadingOverlay } from "@mantine/core";
import IDCStudyRowsComponent from "@/features/proteinpaint/idc/IDCStudyRowsComponent";
import {
  IDCParquetData,
  IDCStudy,
  IDCViewerRow,
} from "@/features/proteinpaint/idc/types";
import {
  IDC_CURRENT_VERSION_LABEL,
  loadIDCParquetWithFallback,
} from "@/features/proteinpaint/idc/utils";
import { PaginationOptions } from "@/components/Table/types";
import TotalItems from "@/components/Table/TotalItem";
import { buildCasesTableSearchFilters } from "@/features/cases/CasesView/utils";

const IDCViewerWrapper: FC = () => {
  // Global loading state for parquet download/parsing + GDC fetch
  const [parquetLoading, setParquetLoading] = useState<boolean>(false);
  // mappings is now derived via useDeepCompareMemo (no local state)
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
  // search term for submitter_id / GDC Case ID
  const [searchTerm, setSearchTerm] = useState<string>("");

  const currentCohortFilterSet = useCurrentCohortFilters();
  // Parquet data loaded once on mount
  const [idcData, setIdcData] = useState<
    | {
        idc_data: ReadonlyArray<IDCParquetData>;
        case_ids: readonly string[];
      }
    | undefined
  >(undefined);
  // Version label from the bucket XML listing used to load the IDC parquet
  // file. The default value is "current"; if that artifact is unavailable,
  // an archived version from https://storage.googleapis.com/idc-index-data-artifacts/
  // is selected instead.
  const [idcUrlVersion, setIdcUrlVersion] = useState<string | undefined>(
    undefined,
  );
  // Data version embedded in the parquet footer metadata
  // (idc_index_data_version), e.g. "24.2.1-0-g119c0c7".
  const [idcMetadataVersion, setIdcMetadataVersion] = useState<
    string | undefined
  >(undefined);

  // Map sorting (table) -> API SortBy
  const mapSortingToSortBy = useCallback((): ReadonlyArray<SortBy> => {
    const COLUMN_ID_TO_FIELD: Record<string, string> = {
      caseId: "submitter_id",
      program: "project.program.name",
      project: "project.project_id",
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

      // Try the "current" artifact first, then traverse archived versions
      // (newest -> oldest) until a valid, accessible, readable file is found.
      const parquetData = await loadIDCParquetWithFallback();

      if (!mounted) return;
      if (parquetData) {
        setIdcData({
          idc_data: parquetData.idc_data,
          case_ids: parquetData.case_ids,
        });
        setIdcUrlVersion(parquetData.urlVersion);
        setIdcMetadataVersion(parquetData.metadataVersion);
      } else {
        setLoadError(true);
      }
      setParquetLoading(false);
    };

    loadIdc();

    return () => {
      mounted = false;
    };
  }, []);

  const extendedFilters = useDeepCompareMemo(() => {
    if (!idcData) return undefined;

    const idFilters: Intersection = {
      operator: "and",
      operands: [
        {
          operator: "includes",
          field: "case_id",
          operands: idcData.case_ids,
        } as Includes,
      ],
    };

    const cohortOp = currentCohortFilterSet
      ? (filterSetToOperation(currentCohortFilterSet) as
          | Union
          | Intersection
          | undefined)
      : undefined;

    const searchFilters = buildCasesTableSearchFilters(searchTerm);

    return convertFilterToGqlFilter(
      appendFilterToOperation(
        appendFilterToOperation(cohortOp, idFilters),
        searchFilters,
      ),
    );
  }, [idcData, currentCohortFilterSet, searchTerm]);

  const sortByForApi = mapSortingToSortBy();

  // Use the standard query hook; skip the query until parquet is loaded.
  const {
    data: casesResponse,
    isFetching: casesLoading,
    isError: casesError,
  } = useGetCasesQuery({
    request: {
      fields: [
        "submitter_id",
        "disease_type",
        "primary_site",
        "project.project_id",
        "project",
      ],
      size: pageSize,
      from: (activePage - 1) * pageSize,
      case_filters: extendedFilters,
      expand: ["samples.portions.slides", "project", "project.program"],
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

  // Build a fast lookup map: PatientID -> IDCParquetData[]
  const idcDataByPatientId = useDeepCompareMemo(() => {
    const map: Record<string, IDCParquetData[]> = {};
    if (!idcData?.idc_data) return map;

    idcData.idc_data.forEach((row) => {
      const pid = row?.PatientID?.toString();
      if (!pid) return;
      if (!map[pid]) map[pid] = [];
      map[pid].push(row);
    });

    return map;
  }, [idcData?.idc_data]);

  // Build mappings via lookup
  const mappings = useDeepCompareMemo(() => {
    const allHits = casesResponse?.hits || [];
    return allHits.map((gdcCase: any) => {
      const submitterId = gdcCase?.submitter_id?.toString();
      // IDC PatientId and GDC submitter_id represent the same value, so we can use submitter_id to lookup for IDC data
      const matches = submitterId ? idcDataByPatientId[submitterId] || [] : [];
      return { gdcCase, matches };
    });
  }, [casesResponse?.hits, idcDataByPatientId]);

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
      const studiesMap = new Map<string, IDCStudy>();
      (m.matches || []).forEach((r: IDCParquetData) => {
        const studyId = r?.StudyInstanceUID ?? "n/a";
        if (!studiesMap.has(studyId)) {
          studiesMap.set(studyId, {
            StudyInstanceUID: r?.StudyInstanceUID ?? null,
            collectionId: r?.collection_id ?? null,
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
        project: m.gdcCase.project.project_id,
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
      idcTableColumnHelper.accessor("project", {
        id: "project",
        header: "Project",
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
          const wsiLabel = `${wsiCount} Histopathology`;
          const radioLabel = `${radiologyCount} Radiology`;
          const titleLabel = `${idcNoun} (${wsiLabel} + ${radioLabel})`;

          if (count === 0) {
            return <span className="text-gdc-grey">-</span>;
          }

          return (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setTableExpanded(info.row);
              }}
              title={`${count} ${titleLabel}`}
              aria-expanded={info.row.getIsExpanded()}
              aria-label={`${count} ${titleLabel}. Press Enter or Space to expand.`}
              className="inline-block"
            >
              <IDCExpandRowComponent
                isRowExpanded={info.row.getIsExpanded()}
                value={arr ?? []}
                title={titleLabel}
              />
            </button>
          );
        },
        enableSorting: false,
      }),
    ],
    [setTableExpanded, idcTableColumnHelper],
  );

  // map VerticalTable handleChange to server-side pagination + search handlers
  const handleTableChange = useCallback(
    (obj: {
      newPageNumber?: number;
      newPageSize?: string | number;
      newSearch?: string;
    }) => {
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
      if (obj.newSearch !== undefined) {
        setActivePage(1);
        setSearchTerm(obj.newSearch ?? "");
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
    label: "case",
    customPluralLabel: "cases",
  };

  return (
    <div className="idc-viewer-wrapper-root p-3 bg-base-max">
      <div style={{ marginTop: 12 }}>
        <div style={{ maxHeight: 460, overflow: "auto" }}>
          <div style={{ position: "relative", minHeight: 120 }}>
            <LoadingOverlay visible={overlayVisible} zIndex={50} />
            {!parquetLoading &&
              (loadError ? (
                <div
                  data-testid="idc-error-message"
                  className="p-4 text-utility-error text-sm"
                >
                  There was an error rendering IDC table, please try again
                  later.
                </div>
              ) : tableData.length === 0 && !casesLoading && !searchTerm ? (
                <div
                  data-testid="no-idc-message"
                  className="p-4 text-gdc-grey-dark text-sm"
                >
                  No IDC images for selected cohort.
                </div>
              ) : (
                <VerticalTable
                  columns={columns}
                  data={tableData}
                  tableTitle="IDC Image Viewer"
                  tableTotalDetail={
                    <TotalItems total={pagination?.total} itemName="case" />
                  }
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
                  search={{
                    enabled: true,
                    tooltip:
                      "e.g. TCGA-GM-A2DA, c07b122e-ac50-4db2-add2-5617a5d0e976",
                  }}
                />
              ))}
          </div>
        </div>
        {!parquetLoading && !loadError && idcUrlVersion && (
          <div
            data-testid="idc-version-info"
            className="mt-2 text-right text-xs text-gdc-grey-dark"
          >
            {idcUrlVersion === IDC_CURRENT_VERSION_LABEL
              ? "IDC URL version: current"
              : `IDC URL version: ${idcUrlVersion} (fallback — current version unavailable)`}
            {idcMetadataVersion && ` - IDC file version: ${idcMetadataVersion}`}
          </div>
        )}
      </div>
    </div>
  );
};

export default IDCViewerWrapper;
