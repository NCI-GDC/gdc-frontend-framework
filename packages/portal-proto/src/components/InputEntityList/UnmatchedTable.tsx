import useStandardPagination from "@/hooks/useStandardPagination";
import { createColumnHelper, SortingState } from "@tanstack/react-table";
import { upperFirst } from "lodash";
import { useMemo, useState } from "react";
import { HandleChangeInput } from "../Table/types";
import VerticalTable from "../Table/VerticalTable";

const UnmatchedTable = ({
  unmatched,
  entityLabel,
}: {
  readonly unmatched: string[];
  readonly entityLabel: string;
}): JSX.Element => {
  const [unmatchedTablesorting, setUnmatchedTableSorting] =
    useState<SortingState>([]);

  const unmatchedTableData = useMemo(
    () => unmatched.map((id) => ({ id })),
    [unmatched],
  );

  const {
    displayedData: displayedUnmatchedData,
    handlePageChange: handleUnmatchedPageChange,
    handlePageSizeChange: handleUnmatchedPageSizeChange,
    ...unmatchedPaginationProps
  } = useStandardPagination(unmatchedTableData);

  const unmatchedTableColumnHelper =
    createColumnHelper<typeof unmatchedTableData[0]>();

  const unmatchedTableColumns = useMemo(
    () => [
      unmatchedTableColumnHelper.accessor("id", {
        id: "id",
        header: `Submitted ${upperFirst(entityLabel)} Identifier`,
      }),
    ],
    [unmatchedTableColumnHelper, entityLabel],
  );

  const handleUnmatchedTableChange = (obj: HandleChangeInput) => {
    switch (Object.keys(obj)?.[0]) {
      case "newPageSize":
        handleUnmatchedPageSizeChange(obj.newPageSize);
        break;
      case "newPageNumber":
        handleUnmatchedPageChange(obj.newPageNumber);
        break;
    }
  };

  return (
    <div className="m-4">
      <p className="text-sm mb-2">
        {unmatched.length} submitted {entityLabel} identifier
        {unmatched.length !== 1 && "s"} not recognized
      </p>
      {unmatched.length > 0 && (
        <VerticalTable
          data={displayedUnmatchedData}
          columns={unmatchedTableColumns}
          status="fulfilled"
          pagination={{
            ...unmatchedPaginationProps,
            label: `${entityLabel}s`,
          }}
          handleChange={handleUnmatchedTableChange}
          columnSorting="enable" //TODO Fix this will not work with multiple pages
          sorting={unmatchedTablesorting}
          setSorting={setUnmatchedTableSorting}
        />
      )}
    </div>
  );
};

export default UnmatchedTable;
