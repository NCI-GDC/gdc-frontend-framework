import React, { useState, useEffect, useMemo } from "react";
import {
  // useGetProjectPrimarySitesQuery,
  useGetProjectsPrimarySitesAllQuery,
} from "@gff/core";
import { HeaderTitle } from "../shared/tailwindComponents";
import useStandardPagination from "@/hooks/useStandardPagination";
import { CohortCreationButtonWrapper } from "@/components/CohortCreationButton/";
import { useDeepCompareMemo } from "use-deep-compare";
import {
  ColumnOrderState,
  ExpandedState,
  Row,
  SortingState,
  VisibilityState,
  createColumnHelper,
} from "@tanstack/react-table";
import VerticalTable from "@/components/Table/VerticalTable";
import { HandleChangeInput } from "@/components/Table/types";
import SubrowPrimarySiteDiseaseType from "../shared/SubrowPrimarySiteDiseaseType";
import { generateSortingFn } from "@/utils/index";
import ExpandRowComponent from "@/components/Table/ExpandRowComponent";

interface PrimarySiteTableProps {
  readonly projectId: string;
  readonly primarySites: string[];
}

const PrimarySiteTable: React.FC<PrimarySiteTableProps> = ({
  projectId,
  primarySites,
}: PrimarySiteTableProps) => {
  const [filteredTableData, setFilteredTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { data, isLoading } = useGetProjectsPrimarySitesAllQuery({
    projectId,
    primary_sites: primarySites,
  });

  // console.log({ data, isLoading, isFetching });
  // const primarySiteData = primarySites.map((primary_site) => {
  //   // TODO: will come back to this when we have more time
  //   // this can be made better by looping inside rtk query instead of here
  //   // eslint-disable-next-line
  //   const { isError, isLoading, data } = useGetProjectPrimarySitesQuery({
  //     projectId,
  //     primary_site,
  //   });

  //   return {
  //     primary_site,
  //     data,
  //     isError,
  //     isLoading,
  //   };
  // });

  // const allQueriesLoaded = primarySiteData.every((query) => !query.isLoading);

  const formattedData = useDeepCompareMemo(
    () =>
      !isLoading
        ? data?.map((datum) => ({
            primary_site: datum.primary_site,
            disease_type: datum.data.disease_types,
            cases: datum.data.casesTotal,
            experimental_strategy: datum.data.files__experimental_strategy,
            files: datum.data.filesTotal,
          }))
        : [],
    [isLoading, data],
  );

  const primarySitesTableColumnHelper =
    createColumnHelper<typeof formattedData[0]>();

  const primarySitesTableColumns = useMemo(
    () => [
      primarySitesTableColumnHelper.accessor("primary_site", {
        id: "primary_site",
        header: "Primary Site",
      }),
      primarySitesTableColumnHelper.accessor("disease_type", {
        id: "disease_type",
        header: "Disease Type",
        cell: ({ row, getValue }) => (
          <ExpandRowComponent
            value={getValue()}
            title="Disease Types"
            isRowExpanded={row.getIsExpanded()}
          />
        ),
      }),
      primarySitesTableColumnHelper.accessor("cases", {
        id: "cases",
        header: "Cases",
        cell: ({ row }) => (
          <CohortCreationButtonWrapper
            label={row.original.cases?.toLocaleString()}
            numCases={row.original.cases}
            caseFilters={{
              mode: "and",
              root: {
                "cases.project.project_id": {
                  field: "cases.project.project_id",
                  operator: "includes",
                  operands: [projectId],
                },
                "cases.primary_site": {
                  field: "cases.primary_site",
                  operator: "includes",
                  operands: [row.original.primary_site.toLowerCase()],
                },
              },
            }}
          />
        ),
      }),
      primarySitesTableColumnHelper.accessor("experimental_strategy", {
        id: "experimental_strategy",
        header: "Experimental Strategy",
        enableSorting: false,
      }),
      primarySitesTableColumnHelper.accessor("files", {
        id: "files",
        header: "Files",
      }),
    ],
    [primarySitesTableColumnHelper, projectId],
  );

  useEffect(() => {
    if (searchTerm) {
      setFilteredTableData(
        formattedData.filter((obj) => {
          return obj.primary_site?.toLowerCase().indexOf(searchTerm) > -1;
        }),
      );
    } else {
      setFilteredTableData(formattedData);
    }
  }, [searchTerm, formattedData]);

  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    primarySitesTableColumns.map((column) => column.id as string), //must start out with populated columnOrder so we can splice
  );
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const [expandedRowId, setExpandedRowId] = useState(-1);
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "primary_site",
      desc: true,
    },
  ]);

  const customSortingFns = useMemo(
    () => ({
      cases: generateSortingFn("cases"),
    }),
    [],
  );

  const {
    handlePageChange,
    handlePageSizeChange,
    handleSortByChange,
    displayedData,
    ...paginationProps
  } = useStandardPagination(filteredTableData, customSortingFns);

  useEffect(() => handleSortByChange(sorting), [sorting, handleSortByChange]);

  const handleChange = (obj: HandleChangeInput) => {
    switch (Object.keys(obj)?.[0]) {
      case "newPageSize":
        handlePageSizeChange(obj.newPageSize);
        break;
      case "newPageNumber":
        handlePageChange(obj.newPageNumber);
        break;
      case "newSearch":
        setSearchTerm(obj.newSearch?.toLowerCase());
        break;
    }
  };

  const handleExpand = (
    row: Row<typeof formattedData[0]>,
    columnId: string,
  ) => {
    if (Object.keys(expanded).length > 0 && row.index === expandedRowId) {
      setExpanded({});
    } else if ((row.original[columnId] as string[]).length > 1) {
      setExpanded({ [row.index]: true });
      setExpandedRowId(row.index);
    }
  };

  return (
    <VerticalTable
      tableTitle={`Total of ${paginationProps?.total?.toLocaleString()} Primary Sites`}
      data={displayedData}
      columns={primarySitesTableColumns}
      additionalControls={
        <div className="self-end">
          <HeaderTitle>Primary Sites</HeaderTitle>
        </div>
      }
      columnSorting="manual"
      sorting={sorting}
      setSorting={setSorting}
      expanded={expanded}
      getRowCanExpand={() => true}
      setExpanded={handleExpand}
      expandableColumnIds={["disease_type"]}
      renderSubComponent={({ row, clickedColumnId }) => (
        <SubrowPrimarySiteDiseaseType row={row} columnId={clickedColumnId} />
      )}
      setColumnVisibility={setColumnVisibility}
      columnVisibility={columnVisibility}
      columnOrder={columnOrder}
      setColumnOrder={setColumnOrder}
      pagination={{
        ...paginationProps,
        label: "Primary Sites",
      }}
      status={isLoading ? "pending" : "fulfilled"}
      search={{
        enabled: true,
      }}
      showControls={true}
      handleChange={handleChange}
    />
  );
};

export default PrimarySiteTable;
