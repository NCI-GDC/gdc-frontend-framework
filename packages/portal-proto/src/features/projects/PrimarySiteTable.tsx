import React, { useState, useEffect } from "react";
import { useGetProjectPrimarySitesQuery } from "@gff/core";
import { Row } from "react-table";
import {
  VerticalTable,
  HandleChangeInput,
  Columns,
} from "@/features/shared/VerticalTable";
import { HeaderTitle } from "../shared/tailwindComponents";
import CollapsibleRow from "@/features/shared/CollapsibleRow";
import useStandardPagination from "@/hooks/useStandardPagination";
import { CohortCreationButtonWrapper } from "@/components/CohortCreationButton/";

interface CellProps {
  value: string[];
  row: Row;
}
const columnListOrderStart: Columns[] = [
  {
    id: "primary_site",
    columnName: "Primary Site",
    visible: true,
  },
  {
    id: "disease_type",
    columnName: "Disease Type",
    visible: true,
    disableSortBy: true,
    Cell: ({ value, row }: CellProps) => {
      return <CollapsibleRow value={value} row={row} label="Disease Types" />;
    },
  },
  {
    id: "cases",
    columnName: "Cases",
    visible: true,
    sortingFn: (rowA, rowB) => rowA.caseNum - rowB.caseNum,
  },
  {
    id: "experimental_strategy",
    columnName: "Experimental Strategy",
    visible: true,
    disableSortBy: true,
  },
  {
    id: "files",
    columnName: "Files",
    visible: true,
    Cell: ({ value }: CellProps) => <>{value?.toLocaleString()}</>,
  },
];

interface PrimarySiteTableProps {
  readonly projectId: string;
  readonly primarySites: string[];
}

const PrimarySiteTable: React.FC<PrimarySiteTableProps> = ({
  projectId,
  primarySites,
}: PrimarySiteTableProps) => {
  const [tableData, setTableData] = useState([]);
  const [filteredTableData, setFilteredTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [columnListOrder, setColumnListOrder] = useState(columnListOrderStart);

  //get details for each item in primarySites
  const primarySiteDetailsPromises = primarySites.map((primary_site: string) =>
    //eslint-disable-next-line
    useGetProjectPrimarySitesQuery({ projectId, primary_site }),
  );
  let loadingData = true;
  if (primarySiteDetailsPromises.every((obj) => obj.isSuccess)) {
    loadingData = false;
  }

  useEffect(() => {
    //Check if all data is loaded before showing
    setTableData(
      primarySiteDetailsPromises.map((obj) => {
        if (obj.data) {
          return {
            primary_site: obj.originalArgs.primary_site,
            disease_type: obj.data.disease_types,
            cases: (
              <CohortCreationButtonWrapper
                label={obj.data.casesTotal?.toLocaleString()}
                numCases={obj.data.casesTotal}
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
                      operands: [obj.originalArgs.primary_site.toLowerCase()],
                    },
                  },
                }}
              />
            ),
            caseNum: obj.data.casesTotal,
            experimental_strategy:
              obj.data.files__experimental_strategy.join(", "),
            files: obj.data.filesTotal,
          };
        } else {
          return {
            primary_site: obj?.originalArgs?.primary_site,
          };
        }
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingData]);

  useEffect(() => {
    if (searchTerm?.trim()) {
      setFilteredTableData(
        tableData.filter((obj) => {
          return obj.primary_site?.toLowerCase().indexOf(searchTerm) > -1;
        }),
      );
    } else {
      setFilteredTableData(tableData);
    }
  }, [searchTerm, tableData]);

  const {
    handlePageChange,
    handlePageSizeChange,
    handleSortByChange,
    displayedData,
    ...paginationProps
  } = useStandardPagination(filteredTableData, columnListOrder);

  useEffect(() => {
    // set default on load to be sorted by primary site
    handleSortByChange([
      {
        id: "primary_site",
        desc: true,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingData]);

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
      case "sortBy":
        handleSortByChange(obj.sortBy);
        break;
      case "newHeadings":
        setColumnListOrder(obj.newHeadings);
        break;
    }
  };

  return (
    <VerticalTable
      tableTitle={`Total of ${paginationProps?.total?.toLocaleString()} Primary Sites`}
      tableData={displayedData}
      columns={columnListOrder}
      selectableRow={false}
      additionalControls={
        <div className="self-end">
          <HeaderTitle>Primary Sites</HeaderTitle>
        </div>
      }
      columnSorting="manual"
      pagination={{
        ...paginationProps,
        label: "Primary Sites",
      }}
      status={loadingData ? "pending" : "fulfilled"}
      search={{
        enabled: true,
      }}
      handleChange={handleChange}
      initialSort={[
        {
          id: "primary_site",
          desc: true,
        },
      ]}
    />
  );
};

export default PrimarySiteTable;
