import React, { useState, useMemo } from "react";
import { UseQuery } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { QueryDefinition } from "@reduxjs/toolkit/dist/query";
import { upperFirst } from "lodash";
import { AiOutlineFileAdd as FileAddIcon } from "react-icons/ai";
import {
  useCoreSelector,
  selectSets,
  useCoreDispatch,
  hideModal,
  SetTypes,
} from "@gff/core";
import {
  VerticalTable,
  HandleChangeInput,
} from "@/features/shared/VerticalTable";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";
import FunctionButton from "@/components/FunctionButton";
import useStandardPagination from "@/hooks/useStandardPagination";
import { ButtonContainer } from "./styles";

const CountCell = ({ countHook, setId }) => {
  const { data, isSuccess } = countHook({ setId });
  return isSuccess ? data : "";
};

interface SavedSetsProps {
  readonly setType: SetTypes;
  readonly setTypeLabel: string;
  readonly createSetsInstructions: React.ReactNode;
  readonly selectSetInstructions: string;
  readonly countHook: UseQuery<QueryDefinition<any, any, any, any, any>>;
}

const SavedSets: React.FC<SavedSetsProps> = ({
  setType,
  setTypeLabel,
  createSetsInstructions,
  selectSetInstructions,
  countHook,
}: SavedSetsProps) => {
  const [selectedSets, setSelectedSets] = useState([]);
  const sets = useCoreSelector((state) => selectSets(state, setType));
  const dispatch = useCoreDispatch();

  const tableData = useMemo(() => {
    return Object.entries(sets).map(([name, setId]) => ({
      name,
      count: <CountCell countHook={countHook} setId={setId} />,
    }));
  }, [sets, countHook]);

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
    <>
      <div className="p-4">
        {Object.keys(sets).length === 0 ? (
          <div className="flex flex-col items-center">
            <div className="h-[100px] w-[100px] rounded-[50%] bg-[#e0e9f0] flex justify-center items-center">
              <FileAddIcon className="text-primary-darkest" size={40} />
            </div>
            <p className="uppercase mt-2 mb-4 text-primary-darkest">
              No Saved Sets Available
            </p>
            <div className="w-80 text-center">{createSetsInstructions}</div>
          </div>
        ) : (
          <>
            <p className="text-sm mb-2">{selectSetInstructions}</p>
            <VerticalTable
              tableData={displayedData}
              columns={columns}
              selectableRow={false}
              showControls={false}
              handleChange={handleTableChange}
              pagination={{ ...paginationProps, label: `${setTypeLabel} sets` }}
            />
          </>
        )}
      </div>
      <ButtonContainer>
        <DarkFunctionButton className="mr-auto" disabled>
          Save Set
        </DarkFunctionButton>
        <FunctionButton onClick={() => dispatch(hideModal())}>
          Cancel
        </FunctionButton>
        <DarkFunctionButton
          disabled={selectedSets.length === 0}
          onClick={() => setSelectedSets([])}
        >
          Clear
        </DarkFunctionButton>
        <DarkFunctionButton disabled>Submit</DarkFunctionButton>
      </ButtonContainer>
    </>
  );
};

export default SavedSets;
