import React, { useState, useMemo, useEffect } from "react";
import { UseQuery } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { QueryDefinition } from "@reduxjs/toolkit/dist/query";
import { upperFirst, flatten } from "lodash";
import { Checkbox } from "@mantine/core";
import { AiOutlineFileAdd as FileAddIcon } from "react-icons/ai";
import {
  useCoreSelector,
  selectSets,
  useCoreDispatch,
  hideModal,
  SetTypes,
  Operation,
} from "@gff/core";
import {
  VerticalTable,
  HandleChangeInput,
} from "@/features/shared/VerticalTable";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";
import useStandardPagination from "@/hooks/useStandardPagination";
import { ButtonContainer } from "./styles";
import DiscardChangesButton from "./DiscardChangesButton";

interface SavedSetsProps {
  readonly setType: SetTypes;
  readonly setTypeLabel: string;
  readonly createSetsInstructions: React.ReactNode;
  readonly selectSetInstructions: string;
  readonly getSetInfo: UseQuery<QueryDefinition<any, any, any, any, any>>;
  readonly updateFilters: (field: string, op: Operation) => void;
  readonly facetField: string;
  readonly userEnteredInput: boolean;
  readonly setUserEnteredInput: (entered: boolean) => void;
  readonly global?: boolean;
}

const SavedSets: React.FC<SavedSetsProps> = ({
  setType,
  setTypeLabel,
  createSetsInstructions,
  selectSetInstructions,
  getSetInfo,
  updateFilters,
  facetField,
  userEnteredInput,
  setUserEnteredInput,
  global,
}: SavedSetsProps) => {
  const [selectedSets, setSelectedSets] = useState<string[]>([]);
  const sets = useCoreSelector((state) => selectSets(state, setType));
  const dispatch = useCoreDispatch();

  const { data } = getSetInfo({ setIds: Object.keys(sets) });

  const tableData = useMemo(() => {
    return Object.entries(sets).map(([setId, name]) => ({
      select: (
        <Checkbox
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
      count: data?.[setId]?.count,
    }));
  }, [sets, selectedSets, data]);

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

  useEffect(() => {
    if (selectedSets.length === 0) {
      setUserEnteredInput(false);
    } else {
      setUserEnteredInput(true);
    }
  }, [selectedSets, setUserEnteredInput]);

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
        <DiscardChangesButton
          action={() => dispatch(hideModal())}
          label="Cancel"
          dark={false}
          userEnteredInput={userEnteredInput}
        />
        <DiscardChangesButton
          disabled={selectedSets.length === 0}
          action={() => setSelectedSets([])}
          label="Clear"
          userEnteredInput={userEnteredInput}
        />
        <DarkFunctionButton
          disabled={selectedSets.length === 0}
          onClick={() => {
            if (global) {
              updateFilters(facetField, {
                field: facetField,
                operator: "includes",
                operands: flatten(selectedSets.map((id) => data[id].ids)),
              });
            } else {
              updateFilters(facetField, {
                field: facetField,
                operator: "includes",
                operands: selectedSets.map((id) => `set_id:${id}`),
              });
            }
            dispatch(hideModal());
          }}
        >
          Submit
        </DarkFunctionButton>
      </ButtonContainer>
    </>
  );
};

export default SavedSets;
