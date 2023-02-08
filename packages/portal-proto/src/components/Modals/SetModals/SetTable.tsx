import React, { useMemo } from "react";
import { upperFirst } from "lodash";
import { Checkbox, Radio } from "@mantine/core";
import { useCoreSelector, selectSetsByType, SetTypes } from "@gff/core";
import {
  VerticalTable,
  HandleChangeInput,
} from "@/features/shared/VerticalTable";
import useStandardPagination from "@/hooks/useStandardPagination";
import { UseMutation } from "@reduxjs/toolkit/dist/query/react/buildHooks";

const CountCell = ({ countHook, setId }) => {
  const { data, isSuccess } = countHook({ setId });
  return isSuccess ? data : "";
};

interface SetTable {
  readonly selectedSets: string[];
  readonly setSelectedSets: (sets: string[]) => void;
  readonly countHook: UseMutation<any>;
  readonly setType: SetTypes;
  readonly setTypeLabel: string;
}

const SetTable = ({
  selectedSets,
  setSelectedSets,
  countHook,
  setType,
  setTypeLabel,
}) => {
  const sets = useCoreSelector((state) => selectSetsByType(state, setType));

  const tableData = useMemo(() => {
    return Object.entries(sets).map(([setId, name]) => ({
      select: (
        <Radio
          value={setId}
          checked={selectedSets.includes(setId)}
          onChange={() =>
            selectedSets.includes(setId)
              ? setSelectedSets(selectedSets.filter((id) => id !== setId))
              : setSelectedSets([...selectedSets, setId])
          }
        />
      ),
      name,
      count: <CountCell countHook={countHook} setId={setId} />,
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
