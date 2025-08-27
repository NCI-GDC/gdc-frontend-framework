import React, { useState } from "react";
import { Loader, Modal } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import {
  buildCohortGqlOperator,
  FilterSet,
  SetTypes,
  useCoreDispatch,
  addSet,
  useGeneSetCountsQuery,
  useRemoveFromGeneSetMutation,
  showModal,
  Modals,
  useRemoveFromSsmSetMutation,
  useRemoveTopNSsmsSetFromFiltersMutation,
} from "@gff/core";
import ModalButtonContainer from "@/components/StyledComponents/ModalButtonContainer";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";
import FunctionButton from "@/components/FunctionButton";
import SetTable from "./SetTable";
import { SET_COUNT_LIMIT } from "./constants";

type RemoveFromSetMutationHook =
  | typeof useRemoveFromGeneSetMutation
  | typeof useRemoveFromSsmSetMutation
  | typeof useRemoveTopNSsmsSetFromFiltersMutation;

interface RemoveFromSetModalProps {
  readonly filters: FilterSet;
  readonly cohortFilters?: FilterSet;
  readonly removeFromCount: number;
  readonly setType: SetTypes;
  readonly setTypeLabel: string;
  readonly closeModal: () => void;
  readonly countHook: typeof useGeneSetCountsQuery;
  readonly removeFromSetHook: RemoveFromSetMutationHook;
  readonly opened: boolean;
  readonly sort?: string;
  readonly isManualSelection?: boolean;
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
  sort,
  isManualSelection,
}: RemoveFromSetModalProps) => {
  const [selectedSets, setSelectedSets] = useState<string[][]>([]);
  const dispatch = useCoreDispatch();
  const [removeFromSet, response] = removeFromSetHook();

  const max = Math.min(removeFromCount, SET_COUNT_LIMIT);

  const handleSave = () => {
    if (response.isLoading) return;
    if (!isManualSelection && setType === "ssms") {
      // we need to select top N items from the set in this case done by useRemoveTopNSsmsSetFromFiltersMutation
      // this currently being used only for ssm set
      removeFromSet({
        setId: selectedSets[0][0],
        filters: buildCohortGqlOperator(filters)
          ? {
              op: "and",
              content: [buildCohortGqlOperator(filters)],
            }
          : {},
        case_filters: buildCohortGqlOperator(cohortFilters) ?? {},
        size: max,
        score: sort,
      })
        .unwrap()
        .then((newSetId) => {
          if (newSetId === undefined) {
            dispatch(showModal({ modal: Modals.SaveSetErrorModal }));
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
          dispatch(showModal({ modal: Modals.SaveSetErrorModal }));
        });
    } else {
      removeFromSet({
        setId: selectedSets[0][0],
        filters: buildCohortGqlOperator(filters)
          ? {
              op: "and",
              content: [buildCohortGqlOperator(filters)],
            }
          : {},
      })
        .unwrap()
        .then((newSetId) => {
          if (newSetId === undefined) {
            dispatch(showModal({ modal: Modals.SaveSetErrorModal }));
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
          dispatch(showModal({ modal: Modals.SaveSetErrorModal }));
        });
    }
  };

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
        {removeFromCount > SET_COUNT_LIMIT && (
          <p className="mb-2">Only the top 50,000 mutations will be removed.</p>
        )}
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
        <FunctionButton data-testid="button-cancel" onClick={closeModal}>
          Cancel
        </FunctionButton>
        <DarkFunctionButton
          data-testid="button-save"
          onClick={handleSave}
          disabled={selectedSets.length === 0}
          leftSection={
            response?.isLoading ? <Loader size="sm" color="white" /> : undefined
          }
        >
          Save
        </DarkFunctionButton>
      </ModalButtonContainer>
    </Modal>
  );
};

export default RemoveFromSetModal;
