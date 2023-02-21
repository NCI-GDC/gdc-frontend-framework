import React, { useState, useEffect } from "react";
import {
  UseMutation,
  UseQuery,
} from "@reduxjs/toolkit/dist/query/react/buildHooks";
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
import { modalStyles } from "../styles";

interface RemoveFromSetModalProps {
  readonly filters: FilterSet;
  readonly removeFromCount: number;
  readonly setType: SetTypes;
  readonly setTypeLabel: string;
  readonly index: string;
  readonly closeModal: () => void;
  readonly countHook: UseQuery<any>;
  readonly removeFromSetHook: UseMutation<any>;
}

const RemoveFromSetModal: React.FC<RemoveFromSetModalProps> = ({
  filters,
  removeFromCount,
  setType,
  setTypeLabel,
  index,
  closeModal,
  countHook,
  removeFromSetHook,
}: RemoveFromSetModalProps) => {
  const [selectedSets, setSelectedSets] = useState<string[][]>([]);
  const dispatch = useCoreDispatch();
  const [removeFromSet, response] = removeFromSetHook();

  useEffect(() => {
    if (response.isSuccess) {
      const newSetId =
        response?.data?.data?.sets?.remove_from?.explore?.[index]?.set_id;
      if (newSetId === undefined) {
        showNotification({ message: "Problem modifiying set.", color: "red" });
      } else {
        dispatch(
          addSet({ setType, setName: selectedSets[0][1], setId: newSetId }),
        );
        showNotification({ message: "Set has been modified." });
        closeModal();
      }
    } else if (response.isError) {
      showNotification({ message: "Problem modifiying set.", color: "red" });
    }
  }, [
    response.isSuccess,
    response.isError,
    response.data,
    setType,
    dispatch,
    index,
    closeModal,
    selectedSets,
  ]);

  return (
    <Modal
      title={`Remove ${removeFromCount} ${setTypeLabel}${
        removeFromCount > 1 ? "s" : ""
      } from an existing set`}
      closeButtonLabel="close"
      opened
      onClose={closeModal}
      size="lg"
      classNames={modalStyles}
      withinPortal={false}
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
        />
      </div>
      <ModalButtonContainer>
        <FunctionButton onClick={closeModal}>Cancel</FunctionButton>
        <DarkFunctionButton
          onClick={() =>
            removeFromSet({
              filters: {
                content: [buildCohortGqlOperator(filters)],
                op: "and",
              },
              setId: selectedSets[0][0],
            })
          }
        >
          Save
        </DarkFunctionButton>
      </ModalButtonContainer>
    </Modal>
  );
};

export default RemoveFromSetModal;
