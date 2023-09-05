import React, { useEffect, useMemo, useState } from "react";
import { flatten, uniq, upperFirst } from "lodash";
import { createColumnHelper, SortingState } from "@tanstack/react-table";
import { useDeepCompareMemo } from "use-deep-compare";
import useStandardPagination from "@/hooks/useStandardPagination";
import VerticalTable from "../Table/VerticalTable";
import { HandleChangeInput } from "../Table/types";
import { MatchResults } from "./utils";

const MatchedTable = ({
  matched,
  entityLabel,
  numMatched,
  fieldDisplay,
}: {
  readonly matched: MatchResults[];
  readonly entityLabel: string;
  readonly numMatched: number;
  readonly fieldDisplay: Record<string, string>;
}): JSX.Element => {
  const uniqueMappedToFields = useMemo(
    () => uniq(flatten(matched.map((m) => m.mappedTo.map((v) => v.field)))),
    [matched],
  );
  const uniqueGivenIdentifierFields = useMemo(
    () =>
      uniq(flatten(matched.map((m) => m.givenIdentifiers.map((v) => v.field)))),
    [matched],
  );

  const [matchTableSorting, setMatchTableSorting] = useState<SortingState>([]);

  const matchedTableColumnHelper = useMemo(
    () => createColumnHelper<typeof formattedMatchData[0]>(),
    [],
  );

  const matchedTableColumns = useDeepCompareMemo(
    () => [
      matchedTableColumnHelper.group({
        id: "mapped_to",
        header: "Mapped To",
        meta: {
          highlighted: true,
        },
        enableSorting: false,
        columns: uniqueMappedToFields.map((id) => {
          return matchedTableColumnHelper.accessor(
            `mapped_${id.replaceAll(".", "_")}`,
            {
              id: `mapped_${id.replaceAll(".", "_")}`,
              header: fieldDisplay[id],
              cell: ({ row }) =>
                row.original[`mapped_${id.replaceAll(".", "_")}`],
              meta: {
                highlighted: true,
                sortingFn: (rowA, rowB) => {
                  const property = `mapped_${id.replaceAll(".", "_")}`;
                  if (rowA[property] > rowB[property]) {
                    return 1;
                  }
                  if (rowA[property] < rowB[property]) {
                    return -1;
                  }
                  return 0;
                },
              },
            },
          );
        }),
      }),
      matchedTableColumnHelper.group({
        id: "submitted_id",
        header: `Submitted ${upperFirst(entityLabel)} Identifier`,
        enableSorting: false,
        columns: uniqueGivenIdentifierFields.map((id) => {
          return matchedTableColumnHelper.accessor(
            `given_${id.replaceAll(".", "_")}`,
            {
              id: `given_${id.replaceAll(".", "_")}`,
              header: fieldDisplay[id],
              cell: ({ row }) =>
                row.original[`given_${id.replaceAll(".", "_")}`],
              meta: {
                sortingFn: (rowA, rowB) => {
                  const property = `given_${id.replaceAll(".", "_")}`;
                  if (rowA[property] > rowB[property]) {
                    return 1;
                  }
                  if (rowA[property] < rowB[property]) {
                    return -1;
                  }
                  return 0;
                },
              },
            },
          );
        }),
      }),
    ],
    [
      matchedTableColumnHelper,
      fieldDisplay,
      uniqueGivenIdentifierFields,
      uniqueMappedToFields,
      entityLabel,
    ],
  );

  const formattedMatchData = useMemo(() => {
    return matched.map((d) => ({
      ...Object.fromEntries(
        uniqueMappedToFields.map((id) => [
          `mapped_${id.replaceAll(".", "_")}`,
          "--",
        ]),
      ),
      ...Object.fromEntries(
        d.mappedTo.map((v) => [
          `mapped_${v.field.replaceAll(".", "_")}`,
          v.value,
        ]),
      ),
      ...Object.fromEntries(
        uniqueGivenIdentifierFields.map((id) => [
          `given_${id.replaceAll(".", "_")}`,
          "--",
        ]),
      ),
      ...Object.fromEntries(
        d.givenIdentifiers.map((v) => [
          `given_${v.field.replaceAll(".", "_")}`,
          v.value,
        ]),
      ),
    }));
  }, [matched, uniqueMappedToFields, uniqueGivenIdentifierFields]);

  const {
    displayedData: displayedMatchData,
    handlePageChange: handleMatchedPageChange,
    handlePageSizeChange: handleMatchedPageSizeChange,
    handleSortByChange,
    ...matchPaginationProps
  } = useStandardPagination(formattedMatchData, matchedTableColumns);

  useEffect(
    () => handleSortByChange(matchTableSorting),
    [matchTableSorting, handleSortByChange],
  );

  const handleMatchedTableChange = (obj: HandleChangeInput) => {
    switch (Object.keys(obj)?.[0]) {
      case "newPageSize":
        handleMatchedPageSizeChange(obj.newPageSize);
        break;
      case "newPageNumber":
        handleMatchedPageChange(obj.newPageNumber);
        break;
    }
  };

  return (
    <div className="m-4">
      <p className="text-sm mb-2">
        {numMatched} submitted {entityLabel} identifier
        {numMatched !== 1 && "s"} mapped to {matched.length} unique GDC{" "}
        {entityLabel}
        {matched.length !== 1 && "s"}{" "}
      </p>
      {matched.length > 0 && (
        <VerticalTable
          data={displayedMatchData}
          columns={matchedTableColumns}
          status="fulfilled"
          pagination={{
            ...matchPaginationProps,
            label: `${entityLabel}s`,
          }}
          handleChange={handleMatchedTableChange}
          columnSorting="enable" //TODO Fix this will not work with multiple pages
          sorting={matchTableSorting}
          setSorting={setMatchTableSorting}
        />
      )}
    </div>
  );
};

export default MatchedTable;
