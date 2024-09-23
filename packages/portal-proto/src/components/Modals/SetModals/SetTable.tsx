import React, { useMemo, useId } from "react";
import { upperFirst } from "lodash";
import { Checkbox, Radio, Tooltip } from "@mantine/core";
import {
  useCoreSelector,
  selectSetsByType,
  SetTypes,
  useGeneSetCountsQuery,
} from "@gff/core";
import useStandardPagination from "@/hooks/useStandardPagination";
import { createColumnHelper } from "@tanstack/react-table";
import { HandleChangeInput } from "@/components/Table/types";
import VerticalTable from "@/components/Table/VerticalTable";
import { statusBooleansToDataStatus } from "src/utils";

interface SelectCellProps {
  readonly count: number;
  readonly set: string[];
  readonly multiselect: boolean;
  readonly selectedSets: string[][];
  readonly setSelectedSets: (sets: string[][]) => void;
  readonly shouldDisable?: (value: number) => string;
  readonly componentId: string;
}

const SelectCell: React.FC<SelectCellProps> = ({
  count,
  set,
  multiselect,
  selectedSets,
  setSelectedSets,
  shouldDisable,
  componentId,
}: SelectCellProps) => {
  const [setId, setName] = set;
  const disabledMessage = shouldDisable(count);
  const selected = selectedSets.map((s) => s[0]).includes(set[0]);

  return (
    <Tooltip label={disabledMessage} disabled={!disabledMessage} zIndex={400}>
      <span>
        {multiselect ? (
          <Checkbox
            data-testid={`checkbox-${setName}`}
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
            aria-labelledby={`${componentId}-set-table-${set[0]}`}
          />
        ) : (
          <Radio
            data-testid={`radio-${setName}`}
            value={setId}
            checked={selected}
            disabled={disabledMessage !== undefined}
            onChange={() => setSelectedSets([set])}
            aria-labelledby={`${componentId}-set-table-${set[0]}`}
          />
        )}
      </span>
    </Tooltip>
  );
};

interface SetTableProps {
  readonly selectedSets: string[][];
  readonly setSelectedSets: (sets: string[][]) => void;
  readonly countHook: typeof useGeneSetCountsQuery;
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
  const componentId = useId();
  const sets = useCoreSelector((state) => selectSetsByType(state, setType));
  const {
    data: counts,
    isSuccess,
    isFetching,
    isError,
  } = countHook({
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
            componentId={componentId}
          />
        ),
      }),
      setTableColumnHelper.accessor("name", {
        id: "Name",
        header: "Name",
        cell: ({ getValue, row }) => (
          <span
            data-testid={`text-${row.original.name}-set-name`}
            id={`${componentId}-set-table-${row.original.set[0]}`}
          >
            {getValue()}
          </span>
        ),
      }),
      setTableColumnHelper.accessor("count", {
        id: "count",
        header: `# ${upperFirst(setTypeLabel)}s`,
        cell: ({ row }) => (
          <div data-testid={`text-${row.original.name}-set-count`}>
            {isSuccess ? row.original.count.toLocaleString() : "..."}
          </div>
        ),
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
      componentId,
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
      customDataTestID="table-select-set"
      data={displayedData}
      columns={setTableColumns}
      handleChange={handleTableChange}
      status={statusBooleansToDataStatus(isFetching, isSuccess, isError)}
      pagination={{ ...paginationProps, label: `${setTypeLabel} set` }}
    />
  );
};

export default SetTable;
