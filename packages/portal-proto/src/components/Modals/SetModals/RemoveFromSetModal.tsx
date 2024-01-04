import React, { useState, useEffect } from "react";
import {
  UseMutation,
  UseQuery,
} from "@reduxjs/toolkit/dist/query/react/buildHooks";
import {
  QueryDefinition,
  MutationDefinition,
} from "@reduxjs/toolkit/dist/query";
import { Modal } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import {
  buildCohortGqlOperator,
  FilterSet,
  SetTypes,
  useCoreDispatch,
  addSet,
} from "@gff/core";
import ModalButtonContainer from "@/components/StyledComponents/ModalButtonContainer";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";
import FunctionButton from "@/components/FunctionButton";
import SetTable from "./SetTable";

interface RemoveFromSetModalProps {
  readonly filters: FilterSet;
  readonly removeFromCount: number;
  readonly setType: SetTypes;
  readonly setTypeLabel: string;
  readonly closeModal: () => void;
  readonly countHook: UseQuery<
    QueryDefinition<any, any, any, Record<string, number>, string>
  >;
  readonly removeFromSetHook: UseMutation<
    MutationDefinition<any, any, any, string, string>
  >;
}

const RemoveFromSetModal: React.FC<RemoveFromSetModalProps> = ({
  filters,
  removeFromCount,
  setType,
  setTypeLabel,
  closeModal,
  countHook,
  removeFromSetHook,
}: RemoveFromSetModalProps) => {
  const [selectedSets, setSelectedSets] = useState<string[][]>([]);
  const dispatch = useCoreDispatch();
  const [removeFromSet, response] = removeFromSetHook();

  useEffect(() => {
    if (response.isSuccess) {
      const newSetId = response?.data;
      if (newSetId === undefined) {
        showNotification({
          message: "Problem modifiying set.",
          color: "red",
          closeButtonProps: { "aria-label": "Close notification" },
        });
      } else {
        dispatch(
          addSet({ setType, setName: selectedSets[0][1], setId: newSetId }),
        );
        showNotification({
          message: "Set has been modified.",
          closeButtonProps: { "aria-label": "Close notification" },
        });
        closeModal();
      }
    } else if (response.isError) {
      showNotification({
        message: "Problem modifiying set.",
        color: "red",
        closeButtonProps: { "aria-label": "Close notification" },
      });
    }
  }, [
    response.isSuccess,
    response.isError,
    response.data,
    setType,
    dispatch,
    closeModal,
    selectedSets,
  ]);

  return (
    <Modal
      title={`Remove ${removeFromCount.toLocaleString()} ${setTypeLabel}${
        removeFromCount > 1 ? "s" : ""
      } from an existing set`}
      opened
      onClose={closeModal}
      size="lg"
      classNames={{
        content: "p-0 drop-shadow-lg",
      }}
    >
      <div className="p-4">
        <SetTable
          selectedSets={selectedSets}
          setSelectedSets={setSelectedSets}
          countHook={countHook}
          setType={setType}
          setTypeLabel={setTypeLabel}
          multiselect={false}
          shouldDisable={(value: number) =>
            value === 0 ? "Set is empty." : undefined
          }
          sortByName
        />
      </div>
      <ModalButtonContainer data-testid="modal-button-container">
        <FunctionButton onClick={closeModal}>Cancel</FunctionButton>
        <DarkFunctionButton
          onClick={() =>
            removeFromSet({
              filters: buildCohortGqlOperator(filters)
                ? {
                    content: [buildCohortGqlOperator(filters)],
                    op: "and",
                  }
                : {},
              setId: selectedSets[0][0],
            })
          }
          disabled={selectedSets.length === 0}
        >
          Save
        </DarkFunctionButton>
      </ModalButtonContainer>
    </Modal>
  );
};

export default RemoveFromSetModal;
