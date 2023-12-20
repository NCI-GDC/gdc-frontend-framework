import React, { useMemo } from "react";
import { UseQuery } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { QueryDefinition } from "@reduxjs/toolkit/dist/query";
import { upperFirst } from "lodash";
import { Checkbox, Radio, Tooltip } from "@mantine/core";
import { useCoreSelector, selectSetsByType, SetTypes } from "@gff/core";
import useStandardPagination from "@/hooks/useStandardPagination";
import { createColumnHelper } from "@tanstack/react-table";
import { HandleChangeInput } from "@/components/Table/types";
import VerticalTable from "@/components/Table/VerticalTable";

interface SelectCellProps {
  readonly count: number;
  readonly set: string[];
  readonly multiselect: boolean;
  readonly selectedSets: string[][];
  readonly setSelectedSets: (sets: string[][]) => void;
  readonly shouldDisable?: (value: number) => string;
}

const SelectCell: React.FC<SelectCellProps> = ({
  count,
  set,
  multiselect,
  selectedSets,
  setSelectedSets,
  shouldDisable,
}: SelectCellProps) => {
  const [setId] = set;
  const disabledMessage = shouldDisable(count);
  const selected = selectedSets.map((s) => s[0]).includes(set[0]);
  return (
    <Tooltip label={disabledMessage} disabled={!disabledMessage} zIndex={400}>
      <span>
        {multiselect ? (
          <Checkbox
            aria-label={setId}
            value={setId}
            checked={selected}
            disabled={disabledMessage !== undefined}
            onChange={() =>
              selected
                ? setSelectedSets(
                    selectedSets.filter((set) => set[0] !== setId),
                  )
                : setSelectedSets([...selectedSets, set])
            }
          />
        ) : (
          <Radio
            aria-label={`Select ${setId}`}
            value={setId}
            checked={selected}
            disabled={disabledMessage !== undefined}
            onChange={() => setSelectedSets([set])}
          />
        )}
      </span>
    </Tooltip>
  );
};

interface SetTableProps {
  readonly selectedSets: string[][];
  readonly setSelectedSets: (sets: string[][]) => void;
  readonly countHook: UseQuery<
    QueryDefinition<any, any, any, Record<string, number>, string>
  >;
  readonly setType: SetTypes;
  readonly setTypeLabel: string;
  readonly multiselect?: boolean;
  readonly sortByName?: boolean;
  readonly shouldDisable?: (value: number) => string;
}

const SetTable: React.FC<SetTableProps> = ({
  selectedSets,
  setSelectedSets,
  countHook,
  setType,
  setTypeLabel,
  multiselect = true,
  sortByName = false,
  shouldDisable,
}: SetTableProps) => {
  const sets = useCoreSelector((state) => selectSetsByType(state, setType));
  const { data: counts, isSuccess } = countHook({
    setIds: Object.keys(sets),
  });

  const tableData = useMemo(() => {
    return Object.entries(sets)
      .sort((setA, setB) => (sortByName ? setA[1].localeCompare(setB[1]) : 0))
      .map((set) => ({
        set,
        name: set[1],
        count: isSuccess ? (counts?.[set[0]] || 0).toLocaleString() : "...",
      }));
  }, [sets, sortByName, counts, isSuccess]);

  const setTableColumnHelper = createColumnHelper<typeof tableData[0]>();

  const setTableColumns = useMemo(
    () => [
      setTableColumnHelper.display({
        id: "select",
        header: "Select",
        cell: ({ row }) => (
          <SelectCell
            count={counts?.[row.original.set[0]] || 0}
            set={row.original.set}
            multiselect={multiselect}
            shouldDisable={shouldDisable}
            selectedSets={selectedSets}
            setSelectedSets={setSelectedSets}
          />
        ),
      }),
      setTableColumnHelper.accessor("name", {
        id: "Name",
        header: "Name",
        cell: ({ getValue, row }) => (
          <label id={`set-table-${row.original.set[0]}`}>{getValue()}</label>
        ),
      }),
      setTableColumnHelper.accessor("count", {
        id: "count",
        header: `# ${upperFirst(setTypeLabel)}s`,
      }),
    ],
    [
      setTableColumnHelper,
      setTypeLabel,
      selectedSets,
      counts,
      multiselect,
      setSelectedSets,
      shouldDisable,
    ],
  );

  const {
    displayedData,
    handlePageChange,
    handlePageSizeChange,
    ...paginationProps
  } = useStandardPagination(tableData);

  const handleTableChange = (obj: HandleChangeInput) => {
    switch (Object.keys(obj)?.[0]) {
      case "newPageSize":
        handlePageSizeChange(obj.newPageSize);
        break;
      case "newPageNumber":
        handlePageChange(obj.newPageNumber);
        break;
    }
  };

  return (
    <VerticalTable
      data={displayedData}
      columns={setTableColumns}
      handleChange={handleTableChange}
      status={isSuccess ? "fulfilled" : "pending"}
      pagination={{ ...paginationProps, label: `${setTypeLabel} sets` }}
    />
  );
};

export default SetTable;
