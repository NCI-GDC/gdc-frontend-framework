import React, { useEffect, useMemo, useState } from "react";
import { flatten, uniq, upperFirst } from "lodash";
import { createColumnHelper, SortingState } from "@tanstack/react-table";
import saveAs from "file-saver";
import { useDeepCompareMemo } from "use-deep-compare";
import useStandardPagination from "@/hooks/useStandardPagination";
import VerticalTable from "../Table/VerticalTable";
import { HandleChangeInput } from "../Table/types";
import { MatchResults } from "./utils";
import FunctionButton from "../FunctionButton";

// check for HGNC
const isHGNC = (value: string) => value.startsWith("HGNC:");

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
  const uniqueSubmittedIdentifierFields = useMemo(
    () =>
      uniq(
        flatten(matched.map((m) => m.submittedIdentifiers.map((v) => v.field))),
      ),
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
          scope: "colgroup",
        },
        enableSorting: false,
        columns: uniqueMappedToFields.map((id) => {
          return matchedTableColumnHelper.accessor(
            `mapped_${id.replaceAll(".", "_")}`,
            {
              id: `mapped_${id.replaceAll(".", "_")}`,
              header: fieldDisplay[id],
              cell: ({ row }) =>
                row?.original[`mapped_${id.replaceAll(".", "_")}`] ?? "--",
              meta: {
                highlighted: true,
              },
            },
          );
        }),
      }),
      matchedTableColumnHelper.group({
        id: "submitted_id",
        header: `Submitted ${upperFirst(entityLabel)} Identifier`,
        meta: {
          scope: "colgroup",
        },
        enableSorting: false,
        columns: uniqueSubmittedIdentifierFields.map((id) => {
          return matchedTableColumnHelper.accessor(
            `submitted_${id.replaceAll(".", "_")}`,
            {
              id: `submitted_${id.replaceAll(".", "_")}`,
              header: fieldDisplay[id],
              cell: ({ row }) =>
                row?.original[`submitted_${id.replaceAll(".", "_")}`] ?? "--",
              meta: {
                sortingFn: (rowA, rowB) => {
                  const property = `submitted_${id.replaceAll(".", "_")}`;

                  const valueA = rowA[property];
                  const valueB = rowB[property];

                  // if values are undefined i.e., "--"
                  if (!valueA && !valueB) return 0;
                  if (!valueA) return 1;
                  if (!valueB) return -1;

                  if (isHGNC(valueA) && isHGNC(valueB)) {
                    return (
                      Number(valueA.split(":")[1]) -
                      Number(valueB.split(":")[1])
                    );
                  }

                  const numA = Number(valueA);
                  const numB = Number(valueB);

                  // Check if both values are numbers
                  if (!Number.isNaN(numA) && !Number.isNaN(numB)) {
                    return numA - numB;
                  }

                  // if values are strings
                  return valueA.localeCompare(valueB);
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
      uniqueSubmittedIdentifierFields,
      uniqueMappedToFields,
      entityLabel,
    ],
  );

  const formattedMatchData = useMemo(() => {
    return matched.map((d) => ({
      ...Object.fromEntries(
        uniqueMappedToFields.map((id) => [
          `mapped_${id.replaceAll(".", "_")}`,
          undefined,
        ]),
      ),
      ...Object.fromEntries(
        d.mappedTo.map((v) => [
          `mapped_${v.field.replaceAll(".", "_")}`,
          v.value,
        ]),
      ),
      ...Object.fromEntries(
        uniqueSubmittedIdentifierFields.map((id) => [
          `submitted_${id.replaceAll(".", "_")}`,
          undefined,
        ]),
      ),
      ...Object.fromEntries(
        d.submittedIdentifiers.map((v) => [
          `submitted_${v.field.replaceAll(".", "_")}`,
          v.value,
        ]),
      ),
    }));
  }, [matched, uniqueMappedToFields, uniqueSubmittedIdentifierFields]);

  const downloadTSV = () => {
    const header = [
      ...uniqueMappedToFields.map((field) => `mapped${fieldDisplay[field]}`),
      ...uniqueSubmittedIdentifierFields.map(
        (field) => `submitted${fieldDisplay[field]}`,
      ),
    ];
    const body = formattedMatchData.map((d) => Object.values(d).join("\t"));
    const tsv = [header.join("\t"), body.join("\n")].join("\n");

    saveAs(
      new Blob([tsv], {
        type: "text/tsv",
      }),
      `matched-${entityLabel}-list.tsv`,
    );
  };

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
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm">
          {numMatched} submitted {entityLabel} identifier
          {numMatched !== 1 && "s"} mapped to {matched.length} unique GDC{" "}
          {entityLabel}
          {matched.length !== 1 && "s"}{" "}
        </p>
        <FunctionButton onClick={downloadTSV}>TSV</FunctionButton>
      </div>
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
          columnSorting="manual"
          sorting={matchTableSorting}
          setSorting={setMatchTableSorting}
        />
      )}
    </div>
  );
};

export default MatchedTable;
