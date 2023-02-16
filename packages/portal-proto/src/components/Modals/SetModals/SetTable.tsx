import React, { useMemo } from "react";
import { upperFirst } from "lodash";
import { Checkbox, Radio, Tooltip } from "@mantine/core";
import { useCoreSelector, selectSetsByType, SetTypes } from "@gff/core";
import {
  VerticalTable,
  HandleChangeInput,
} from "@/features/shared/VerticalTable";
import useStandardPagination from "@/hooks/useStandardPagination";
import { UseMutation } from "@reduxjs/toolkit/dist/query/react/buildHooks";

const CountCell = ({ countHook, setId }) => {
  const { data, isSuccess } = countHook({ setId });
  return isSuccess ? data.toLocaleString() : "";
};

const SelectCell = ({
  countHook,
  set,
  multiselect,
  disableEmpty,
  selectedSets,
  setSelectedSets,
}) => {
  const [setId, _] = set;
  const { data, isSuccess } = countHook({ setId });
  const empty = isSuccess && data === 0 && disableEmpty;
  const selected = selectedSets.map((s) => s[0]).includes(set[0]);

  return (
    <Tooltip label={"The set is empty"} disabled={!empty}>
      <span>
        {multiselect ? (
          <Checkbox
            value={setId}
            checked={selected}
            onChange={() =>
              selectedSets.includes(set)
                ? setSelectedSets(
                    selectedSets.filter((set) => set[0] !== setId),
                  )
                : setSelectedSets([...selectedSets, set])
            }
          />
        ) : (
          <Radio
            value={setId}
            disabled={empty}
            checked={selected}
            onChange={() => setSelectedSets([set])}
          />
        )}
      </span>
    </Tooltip>
  );
};

interface SetTable {
  readonly selectedSets: string[];
  readonly setSelectedSets: (sets: string[]) => void;
  readonly countHook: UseMutation<any>;
  readonly setType: SetTypes;
  readonly setTypeLabel: string;
  readonly multiSelect?: boolean;
  readonly disableEmpty?: boolean;
}

// TODO: disable empty tooltip
const SetTable = ({
  selectedSets,
  setSelectedSets,
  countHook,
  setType,
  setTypeLabel,
  multiselect = true,
  disableEmpty = false,
}) => {
  const sets = useCoreSelector((state) => selectSetsByType(state, setType));

  const tableData = useMemo(() => {
    return Object.entries(sets).map((set) => ({
      select: (
        <SelectCell
          countHook={countHook}
          set={set}
          multiselect={multiselect}
          disableEmpty={disableEmpty}
          selectedSets={selectedSets}
          setSelectedSets={setSelectedSets}
        />
      ),
      name: set[1],
      count: <CountCell countHook={countHook} setId={set[0]} />,
    }));
  }, [sets, selectedSets, countHook]);

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
