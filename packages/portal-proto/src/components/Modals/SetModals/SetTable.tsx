import React, { useMemo } from "react";
import { UseQuery } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { QueryDefinition } from "@reduxjs/toolkit/dist/query";
import { upperFirst } from "lodash";
import { Checkbox, Radio, Tooltip } from "@mantine/core";
import { useCoreSelector, selectSetsByType, SetTypes } from "@gff/core";
import {
  VerticalTable,
  HandleChangeInput,
} from "@/features/shared/VerticalTable";
import useStandardPagination from "@/hooks/useStandardPagination";

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
    <Tooltip label={disabledMessage} disabled={!disabledMessage}>
      <span>
        {multiselect ? (
          <Checkbox
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
            aria-labelledby={`set-table-${set[0]}`}
          />
        ) : (
          <Radio
            value={setId}
            checked={selected}
            disabled={disabledMessage !== undefined}
            onChange={() => setSelectedSets([set])}
            aria-labelledby={`set-table-${set[0]}`}
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
        select: (
          <SelectCell
            count={counts?.[set[0]] || 0}
            set={set}
            multiselect={multiselect}
            shouldDisable={shouldDisable}
            selectedSets={selectedSets}
            setSelectedSets={setSelectedSets}
          />
        ),
        name: <label id={`set-table-${set[0]}`}>{set[1]}</label>,
        count: isSuccess ? (counts?.[set[0]] || 0).toLocaleString() : "...",
      }));
  }, [
    sets,
    selectedSets,
    multiselect,
    setSelectedSets,
    shouldDisable,
    sortByName,
    counts,
    isSuccess,
  ]);

  const columns = useMemo(() => {
    return [
      { columnName: "Select", id: "select", visible: true },
      { columnName: "Name", id: "name", visible: true },
      {
        columnName: `# ${upperFirst(setTypeLabel)}s`,
        id: "count",
        visible: true,
      },
    ];
  }, [setTypeLabel]);

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
      tableData={displayedData}
      columns={columns}
      selectableRow={false}
      showControls={false}
      handleChange={handleTableChange}
      pagination={{ ...paginationProps, label: `${setTypeLabel} sets` }}
    />
  );
};

export default SetTable;
