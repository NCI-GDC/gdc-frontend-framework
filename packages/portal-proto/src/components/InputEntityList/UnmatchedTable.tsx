import { useMemo, useState } from "react";
import { upperFirst } from "lodash";
import { createColumnHelper, SortingState } from "@tanstack/react-table";
import saveAs from "file-saver";
import useStandardPagination from "@/hooks/useStandardPagination";
import FunctionButton from "@/components/FunctionButton";
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

  const downloadTSV = () => {
    const header = ["submitted"];
    const body = unmatchedTableData.map((d) => d.id);
    const tsv = [header.join("\t"), body.join("\n")].join("\n");

    saveAs(
      new Blob([tsv], {
        type: "text/tsv",
      }),
      `unmatched-${entityLabel}-list.tsv`,
    );
  };

  return (
    <div className="m-4">
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm">
          {unmatched.length} submitted {entityLabel} identifier
          {unmatched.length !== 1 && "s"} not recognized
        </p>
        <FunctionButton onClick={downloadTSV}>TSV</FunctionButton>
      </div>
      {unmatched.length > 0 && (
        <VerticalTable
          data={displayedUnmatchedData}
          columns={unmatchedTableColumns}
          status="fulfilled"
          pagination={{
            ...unmatchedPaginationProps,
            label: `${entityLabel}`,
          }}
          handleChange={handleUnmatchedTableChange}
          columnSorting="enable"
          sorting={unmatchedTablesorting}
          setSorting={setUnmatchedTableSorting}
        />
      )}
    </div>
  );
};

export default UnmatchedTable;
