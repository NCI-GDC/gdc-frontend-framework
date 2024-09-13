import React, { useState, useMemo, useEffect, useContext } from "react";
import { upperFirst } from "lodash";
import { Checkbox, Tooltip } from "@mantine/core";
import { AiOutlineFileAdd as FileAddIcon } from "react-icons/ai";
import {
  useCoreSelector,
  selectSetsByType,
  useCoreDispatch,
  hideModal,
  SetTypes,
  Operation,
  FilterSet,
  isIncludes,
  useGeneSetCountsQuery,
} from "@gff/core";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";
import ButtonContainer from "@/components/StyledComponents/ModalButtonContainer";
import useStandardPagination from "@/hooks/useStandardPagination";
import DiscardChangesButton from "../DiscardChangesButton";
import { UserInputContext } from "../UserInputModal";
import { createColumnHelper } from "@tanstack/react-table";
import { HandleChangeInput } from "@/components/Table/types";
import VerticalTable from "@/components/Table/VerticalTable";
import { useDeepCompareMemo } from "use-deep-compare";

interface SavedSetsProps {
  readonly setType: SetTypes;
  readonly setTypeLabel: string;
  readonly createSetsInstructions: React.ReactNode;
  readonly selectSetInstructions: string;
  readonly countHook: typeof useGeneSetCountsQuery;
  readonly updateFilters: (field: string, op: Operation) => void;
  readonly facetField: string;
  readonly existingFiltersHook: () => FilterSet;
}

interface TableData {
  setId: string;
  name: string;
  count: number;
}

const savedSetsTableColumnHelper = createColumnHelper<TableData>();

const SavedSets: React.FC<SavedSetsProps> = ({
  setType,
  setTypeLabel,
  createSetsInstructions,
  selectSetInstructions,
  countHook,
  updateFilters,
  facetField,
  existingFiltersHook,
}: SavedSetsProps) => {
  const [, setUserEnteredInput] = useContext(UserInputContext);
  const sets = useCoreSelector((state) => selectSetsByType(state, setType));
  const { data: counts, isSuccess } = countHook({
    setIds: Object.keys(sets),
  });

  const dispatch = useCoreDispatch();
  const existingFilters = existingFiltersHook();
  const existingOperation = existingFilters?.root?.[facetField];

  const tableData = useMemo(() => {
    return Object.entries(sets).map(([setId, name]) => ({
      setId,
      name,
      count: counts?.[setId] || 0,
    }));
  }, [sets, counts]);

  const getRowId = (originalRow: TableData) => {
    return originalRow.setId;
  };
  const [rowSelection, setRowSelection] = useState({});
  const selectedSets = Object.entries(rowSelection)?.map(([setId]) => setId);

  const savedSetsColumns = useDeepCompareMemo(
    () => [
      savedSetsTableColumnHelper.display({
        id: "select",
        header: "Select",
        cell: ({ row }) => (
          <Tooltip
            label="Set is either empty or deprecated"
            disabled={row.original.count !== 0}
            zIndex={400}
            position="right"
          >
            <Checkbox
              data-testid={`checkbox-${row.original.name}`}
              size="xs"
              classNames={{
                input: "checked:bg-accent checked:border-accent",
              }}
              aria-label={`${row.original.setId}`}
              {...{
                checked: row.getIsSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
              disabled={row.original.count === 0}
            />
          </Tooltip>
        ),
      }),
      savedSetsTableColumnHelper.accessor("name", {
        id: "name",
        header: "Name",
        cell: ({ row }) => (
          <div data-testid={`text-${row.original.name}-set-name`}>
            {row.original.name}
          </div>
        ),
      }),
      savedSetsTableColumnHelper.accessor("count", {
        id: "count",
        header: `# ${upperFirst(setTypeLabel)}s`,
        cell: ({ row }) => (
          <div data-testid={`text-${row.original.name}-set-count`}>
            {isSuccess ? row.original.count.toLocaleString() : "..."}
          </div>
        ),
      }),
    ],
    [isSuccess, setTypeLabel],
  );

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
            <div className="h-[100px] w-[100px] rounded-[50%] bg-emptyIconLighterColor flex justify-center items-center">
              <FileAddIcon className="text-primary-darkest" size={40} />
            </div>
            <p
              data-testid="text-no-saved-sets-available"
              className="uppercase mt-2 mb-4 text-primary-darkest"
            >
              No Saved Sets Available
            </p>
            <div className="w-80 text-center">{createSetsInstructions}</div>
          </div>
        ) : (
          <>
            <p className="text-sm mb-2">{selectSetInstructions}</p>
            <VerticalTable
              customDataTestID="table-sets"
              data={displayedData}
              columns={savedSetsColumns}
              handleChange={handleTableChange}
              status={isSuccess ? "fulfilled" : "pending"}
              enableRowSelection={true}
              pagination={{ ...paginationProps, label: `${setTypeLabel} set` }}
              setRowSelection={setRowSelection}
              rowSelection={rowSelection}
              getRowId={getRowId}
            />
          </>
        )}
      </div>
      <ButtonContainer data-testid="modal-button-container">
        <DarkFunctionButton
          data-testid="button-save-set"
          className="mr-auto"
          disabled
        >
          Save Set
        </DarkFunctionButton>
        <DiscardChangesButton
          customDataTestID="button-cancel"
          action={() => dispatch(hideModal())}
          label="Cancel"
          dark={false}
        />
        <DiscardChangesButton
          customDataTestID="button-clear"
          disabled={selectedSets.length === 0}
          action={() => setRowSelection({})}
          label="Clear"
        />
        <DarkFunctionButton
          data-testid="button-submit"
          disabled={selectedSets.length === 0}
          onClick={() => {
            updateFilters(facetField, {
              field: facetField,
              operator: "includes",
              operands: [
                ...(existingOperation && isIncludes(existingOperation)
                  ? existingOperation?.operands ?? []
                  : []),
                ...selectedSets.map((id) => `set_id:${id}`),
              ],
            });
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
