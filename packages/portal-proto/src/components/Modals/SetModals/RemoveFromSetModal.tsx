import React, { useState } from "react";
import { Modal } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import {
  buildCohortGqlOperator,
  FilterSet,
  SetTypes,
  useCoreDispatch,
  addSet,
  useGeneSetCountsQuery,
  useRemoveFromGeneSetMutation,
} from "@gff/core";
import ModalButtonContainer from "@/components/StyledComponents/ModalButtonContainer";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";
import FunctionButton from "@/components/FunctionButton";
import SetTable from "./SetTable";

interface RemoveFromSetModalProps {
  readonly filters: FilterSet;
  readonly cohortFilters?: FilterSet;
  readonly removeFromCount: number;
  readonly setType: SetTypes;
  readonly setTypeLabel: string;
  readonly closeModal: () => void;
  readonly countHook: typeof useGeneSetCountsQuery;
  readonly removeFromSetHook: typeof useRemoveFromGeneSetMutation;
  readonly opened: boolean;
}

const RemoveFromSetModal: React.FC<RemoveFromSetModalProps> = ({
  filters,
  cohortFilters,
  removeFromCount,
  setType,
  setTypeLabel,
  closeModal,
  countHook,
  removeFromSetHook,
  opened,
}: RemoveFromSetModalProps) => {
  const [selectedSets, setSelectedSets] = useState<string[][]>([]);
  const dispatch = useCoreDispatch();
  const [removeFromSet] = removeFromSetHook();

  return (
    <Modal
      title={`Remove ${removeFromCount?.toLocaleString()} ${setTypeLabel}${
        removeFromCount > 1 ? "s" : ""
      } from an existing set`}
      opened={opened}
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
              case_filters: buildCohortGqlOperator(cohortFilters) ?? {},
              setId: selectedSets[0][0],
            })
              .unwrap()
              .then((response) => {
                const newSetId = response;
                if (newSetId === undefined) {
                  showNotification({
                    message: "Problem modifiying set.",
                    color: "red",
                    closeButtonProps: { "aria-label": "Close notification" },
                  });
                } else {
                  dispatch(
                    addSet({
                      setType,
                      setName: selectedSets[0][1],
                      setId: newSetId,
                    }),
                  );
                  showNotification({
                    message: "Set has been modified.",
                    closeButtonProps: { "aria-label": "Close notification" },
                  });
                  closeModal();
                }
              })
              .catch(() => {
                showNotification({
                  message: "Problem modifiying set.",
                  color: "red",
                  closeButtonProps: { "aria-label": "Close notification" },
                });
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
