import React, { useContext, useEffect, useState } from "react";
import {
  useCoreSelector,
  selectCart,
  useCoreDispatch,
  useAllCases,
  SortBy,
  selectCurrentCohortFilters,
  buildCohortGqlOperator,
  GqlOperation,
  useCurrentCohortCounts,
} from "@gff/core";
import { Button, Divider, Loader } from "@mantine/core";
import { SummaryModalContext } from "src/utils/contexts";
import {
  ageDisplay,
  extractToArray,
  statusBooleansToDataStatus,
} from "src/utils";
import { CasesCohortButtonFromValues } from "./CasesCohortButton";
import { casesTableDataType, useGenerateCasesTableColumns } from "./utils";
import { DropdownWithIcon } from "@/components/DropdownWithIcon/DropdownWithIcon";
import { MdDownload as DownloadIcon } from "react-icons/md";
import { CountsIcon } from "@/components/tailwindComponents";
import { convertDateToString } from "@/utils/date";
import download from "@/utils/download";
import {
  ColumnOrderState,
  SortingState,
  VisibilityState,
  createColumnHelper,
} from "@tanstack/react-table";
import { HandleChangeInput } from "@/components/Table/types";
import VerticalTable from "@/components/Table/VerticalTable";
import { ButtonTooltip } from "@/components/ButtonTooltip";

const getSlideCountFromCaseSummary = (
  experimental_strategies: Array<{
    experimental_strategy: string;
    file_count: number;
  }>,
): number => {
  const slideTypes = ["Diagnostic Slide", "Tissue Slide"];
  return (experimental_strategies || []).reduce(
    (slideCount, { file_count, experimental_strategy }) =>
      slideTypes.includes(experimental_strategy)
        ? slideCount + file_count
        : slideCount,
    0,
  );
};

export const ContextualCasesView: React.FC = () => {
  const dispatch = useCoreDispatch();
  const { setEntityMetadata } = useContext(SummaryModalContext);
  const [pageSize, setPageSize] = useState(10);
  const [offset, setOffset] = useState(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortBy[]>([]);
  const cohortFilters = useCoreSelector((state) =>
    selectCurrentCohortFilters(state),
  );
  const currentCart = useCoreSelector((state) => selectCart(state));
  const cohortCounts = useCurrentCohortCounts();

  /* download active */
  const [biospecimenDownloadActive, setBiospecimenDownloadActive] =
    useState(false);
  const [clinicalDownloadActive, setClinicalDownloadActive] = useState(false);
  const [cohortTableDownloadActive, setCohortTableDownloadActive] =
    useState(false);
  /* download active end */

  const { data, isFetching, isSuccess, isError, pagination } = useAllCases({
    fields: [
      "case_id",
      "submitter_id",
      "primary_site",
      "disease_type",
      "project.project_id",
      "project.program.name",
      "demographic.gender",
      "demographic.race",
      "demographic.ethnicity",
      "demographic.days_to_death",
      "demographic.vital_status",
      "diagnoses.primary_diagnosis",
      "diagnoses.age_at_diagnosis",
      "summary.file_count",
      "summary.data_categories.data_category",
      "summary.data_categories.file_count",
      "summary.experimental_strategies.experimental_strategy",
      "summary.experimental_strategies.file_count",
      "files.file_id",
      "files.access",
      "files.acl",
      "files.file_name",
      "files.file_size",
      "files.state",
      "files.data_type",
    ],
    size: pageSize,
    filters: cohortFilters,
    from: offset * pageSize,
    sortBy: sortBy,
    searchTerm,
  });

  useEffect(() => {
    setRowSelection({});
    setOffset(0);
  }, [cohortFilters]);

  const casesData: casesTableDataType[] =
    data?.map((datum) => ({
      case_uuid: datum.case_uuid,
      case_id: datum.case_id,
      project: datum.project_id,
      program: datum.program,
      primary_site: datum.primary_site,
      disease_type: datum.disease_type ?? "--",
      primary_diagnosis: datum?.primary_diagnosis ?? "--",
      age_at_diagnosis: ageDisplay(datum?.age_at_diagnosis),
      vital_status: datum?.vital_status ?? "--",
      days_to_death: ageDisplay(datum?.days_to_death),
      gender: datum?.gender ?? "--",
      race: datum?.race ?? "--",
      ethnicity: datum?.ethnicity ?? "--",
      slide_count: getSlideCountFromCaseSummary(datum.experimental_strategies),
      files_count: datum?.filesCount,
      files: datum.files,
      experimental_strategies: datum?.experimental_strategies
        ? [
            ...((extractToArray(
              datum?.experimental_strategies,
              "experimental_strategy",
            ) as string[]) ?? []),
          ].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
        : "--",

      annotations: datum.annotations,
    })) ?? [];

  const casesDataColumnHelper = createColumnHelper<casesTableDataType>();

  const casesTableDefaultColumns = useGenerateCasesTableColumns({
    casesDataColumnHelper,
    currentCart,
    setEntityMetadata,
  });

  const getRowId = (originalRow: casesTableDataType) => {
    return originalRow.case_uuid;
  };
  const [rowSelection, setRowSelection] = useState({});
  const pickedCases = Object.entries(rowSelection)?.map(
    ([case_uuid]) => case_uuid,
  );
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    casesTableDefaultColumns.map((column) => column.id as string), //must start out with populated columnOrder so we can splice
  );
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    case_uuid: false,
    program: false,
    disease_type: false,
    primary_diagnosis: false,
    vital_status: false,
    days_to_death: false,
    race: false,
    ethnicity: false,
    age_at_diagnosis: false,
    experimental_strategy: false,
  });

  const sortByActions = (sortByObj: SortingState) => {
    const COLUMN_ID_TO_FIELD = {
      case_id: "submitter_id",
      case_uuid: "case_id",
      project: "project.project_id",
      program: "project.program.name",
      primary_site: "primary_site",
      disease_type: "disease_type",
      vital_status: "demographic.vital_status",
      days_to_death: "demographic.days_to_death",
      gender: "demographic.gender",
      race: "demographic.race",
      ethnicity: "demographic.ethnicity",
      files: "summary.file_count",
    };
    const tempSortBy: SortBy[] = sortByObj.map((sortObj) => {
      return {
        field: COLUMN_ID_TO_FIELD[sortObj.id],
        direction: sortObj.desc ? "desc" : "asc",
      };
    });
    setSortBy(tempSortBy);
  };

  useEffect(() => {
    setRowSelection({});
    sortByActions(sorting);
  }, [sorting]);

  const handleChange = (obj: HandleChangeInput) => {
    switch (Object.keys(obj)?.[0]) {
      case "sortBy":
        sortByActions(obj.sortBy);
        break;
      case "newPageSize":
        setOffset(0);
        setPageSize(parseInt(obj.newPageSize));
        break;
      case "newPageNumber":
        setOffset(obj.newPageNumber - 1);
        break;
      case "newSearch":
        setOffset(0);
        setSearchTerm(obj.newSearch);
        break;
    }
  };

  const caseCounts =
    pickedCases.length > 0 ? pickedCases.length : cohortCounts?.data?.caseCount;

  const downloadFilter: GqlOperation =
    pickedCases.length > 0
      ? {
          op: "in",
          content: {
            field: "cases.case_id",
            value: pickedCases,
          },
        }
      : buildCohortGqlOperator(cohortFilters) ?? ({} as GqlOperation);

  const handleJSONDownload = () => {
    setCohortTableDownloadActive(true);
    download({
      endpoint: "cases",
      method: "POST",
      dispatch,
      params: {
        filename: `cohort.${convertDateToString(new Date())}.json`,
        filters: buildCohortGqlOperator(cohortFilters) ?? ({} as GqlOperation),
        attachment: true,
        pretty: true,
        format: "JSON",
        fields: [
          "submitter_slide_ids",
          "submitter_id",
          "case_id",
          "project.project_id",
          "project.program.name",
          "primary_site",
          "disease_type",
          "diagnoses.age_at_diagnosis",
          "demographic.vital_status",
          "demographic.days_to_death",
          "demographic.race",
          "demographic.gender",
          "demographic.ethnicity",
          "summary.file_count",
          "summary.experimental_strategies.experimental_strategy",
        ].join(","),
        size: caseCounts,
      },
      done: () => setCohortTableDownloadActive(false),
    });
  };

  const handleClinicalTSVDownload = () => {
    setClinicalDownloadActive(true);
    download({
      endpoint: "clinical_tar",
      method: "POST",
      dispatch,
      params: {
        filename: `clinical.${
          pickedCases.length > 0 ? "cases_selection" : "cohort"
        }.${new Date().toISOString().slice(0, 10)}.tar.gz`,
        filters: downloadFilter,
        size: caseCounts,
      },
      done: () => setClinicalDownloadActive(false),
    });
  };

  const handleClinicalJSONDownload = () => {
    setClinicalDownloadActive(true);
    download({
      endpoint: "clinical_tar",
      method: "POST",
      dispatch,
      params: {
        format: "JSON",
        pretty: true,
        filename: `clinical.${
          pickedCases.length > 0 ? "cases_selection" : "cohort"
        }.${new Date().toISOString().slice(0, 10)}.json`,
        filters: downloadFilter,
        size: caseCounts,
      },
      done: () => setClinicalDownloadActive(false),
    });
  };

  const handleBiospeciemenTSVDownload = () => {
    setBiospecimenDownloadActive(true);
    download({
      endpoint: "biospecimen_tar",
      method: "POST",
      dispatch,
      params: {
        filename: `biospecimen.${
          pickedCases.length > 0 ? "cases_selection" : "cohort"
        }.${new Date().toISOString().slice(0, 10)}.tar.gz`,
        filters: downloadFilter,
        size: caseCounts,
      },
      done: () => setBiospecimenDownloadActive(false),
    });
  };

  const handleBiospeciemenJSONDownload = () => {
    setBiospecimenDownloadActive(true);
    download({
      endpoint: "biospecimen_tar",
      method: "POST",
      dispatch,
      params: {
        format: "JSON",
        pretty: true,
        filename: `biospecimen.${
          pickedCases.length > 0 ? "cases_selection" : "cohort"
        }.${new Date().toISOString().slice(0, 10)}.json`,
        filters: downloadFilter,
        size: caseCounts,
      },
      done: () => setBiospecimenDownloadActive(false),
    });
  };

  return (
    <div className="flex flex-col mx-1" data-testid="cases-table">
      <Divider color="#C5C5C5" className="mb-3 mr-4" />

      <VerticalTable
        data={casesData}
        columns={casesTableDefaultColumns}
        pagination={{ ...pagination, label: "cases" }}
        handleChange={handleChange}
        additionalControls={
          <div className="flex gap-2">
            <CasesCohortButtonFromValues pickedCases={pickedCases} />

            <DropdownWithIcon
              dropdownElements={[
                {
                  title: "JSON",
                  onClick: handleBiospeciemenJSONDownload,
                  icon: <DownloadIcon aria-label="Download" />,
                },
                {
                  title: "TSV",
                  onClick: handleBiospeciemenTSVDownload,
                  icon: <DownloadIcon aria-label="Download" />,
                },
              ]}
              TargetButtonChildren={
                biospecimenDownloadActive ? "Processing" : "Biospecimen"
              }
              LeftIcon={
                biospecimenDownloadActive ? (
                  <Loader size={20} />
                ) : pickedCases.length ? (
                  <CountsIcon $count={pickedCases.length}>
                    {pickedCases.length}
                  </CountsIcon>
                ) : (
                  <DownloadIcon size="1rem" aria-label="Biospecimen dropdown" />
                )
              }
            />

            <DropdownWithIcon
              dropdownElements={[
                {
                  title: "JSON",
                  onClick: handleClinicalJSONDownload,
                  icon: <DownloadIcon aria-label="Download" />,
                },
                {
                  title: "TSV",
                  onClick: handleClinicalTSVDownload,
                  icon: <DownloadIcon aria-label="Download" />,
                },
              ]}
              TargetButtonChildren={
                clinicalDownloadActive ? "Processing" : "Clinical"
              }
              LeftIcon={
                clinicalDownloadActive ? (
                  <Loader size={20} />
                ) : pickedCases.length ? (
                  <CountsIcon $count={pickedCases.length}>
                    {pickedCases.length}
                  </CountsIcon>
                ) : (
                  <DownloadIcon size="1rem" aria-label="Biospecimen dropdown" />
                )
              }
            />

            <Button
              onClick={handleJSONDownload}
              variant="outline"
              color="primary"
              className="bg-base-max"
            >
              {cohortTableDownloadActive ? <Loader /> : "JSON"}
            </Button>
            <ButtonTooltip label=" " comingSoon={true}>
              <Button variant="outline" color="primary" className="bg-base-max">
                TSV
              </Button>
            </ButtonTooltip>
          </div>
        }
        tableTitle={`Total of ${pagination?.total?.toLocaleString() ?? "..."} ${
          pagination?.total > 1 ? "Cases" : "Case"
        }`}
        columnSorting="manual"
        enableRowSelection={true}
        showControls={true}
        setRowSelection={setRowSelection}
        rowSelection={rowSelection}
        status={statusBooleansToDataStatus(isFetching, isSuccess, isError)}
        search={{
          enabled: true,
        }}
        sorting={sorting}
        setSorting={setSorting}
        setColumnVisibility={setColumnVisibility}
        columnVisibility={columnVisibility}
        columnOrder={columnOrder}
        setColumnOrder={setColumnOrder}
        getRowId={getRowId}
      />
    </div>
  );
};
