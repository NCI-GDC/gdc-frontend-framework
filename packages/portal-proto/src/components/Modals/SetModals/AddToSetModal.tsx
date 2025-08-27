import React, { useState } from "react";
import { Modal } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import {
  FilterSet,
  SetTypes,
  buildCohortGqlOperator,
  addSet,
  useCoreDispatch,
  useGeneSetCountQuery,
  useGeneSetCountsQuery,
  useAppendToGeneSetMutation,
  showModal,
  Modals,
} from "@gff/core";
import ModalButtonContainer from "@/components/StyledComponents/ModalButtonContainer";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";
import FunctionButton from "@/components/FunctionButton";
import WarningMessage from "@/components/WarningMessage";
import ErrorMessage from "@/components/ErrorMessage";
import SetTable from "./SetTable";
import { SET_COUNT_LIMIT } from "./constants";

interface AddToSetModalProps {
  readonly filters: FilterSet;
  readonly cohortFilters?: FilterSet;
  readonly addToCount: number;
  readonly setType: SetTypes;
  readonly setTypeLabel: string;
  readonly field: string;
  readonly sort?: string;
  readonly closeModal: () => void;
  readonly singleCountHook: typeof useGeneSetCountQuery;
  readonly countHook: typeof useGeneSetCountsQuery;
  readonly appendSetHook: typeof useAppendToGeneSetMutation;
  readonly opened: boolean;
}

const AddToSetModal: React.FC<AddToSetModalProps> = ({
  filters,
  cohortFilters,
  addToCount,
  setType,
  setTypeLabel,
  field,
  sort,
  closeModal,
  singleCountHook,
  countHook,
  appendSetHook,
  opened,
}: AddToSetModalProps) => {
  const [selectedSets, setSelectedSets] = useState<string[][]>([]);
  const dispatch = useCoreDispatch();
  const { data: setCount, isSuccess: isSuccessCount } = singleCountHook(
    {
      setId: selectedSets?.[0]?.[0],
    },
    { skip: selectedSets.length === 0 },
  );
  const { data: countInBoth, isSuccess: isCountBothSuccess } = singleCountHook(
    {
      setId: selectedSets?.[0]?.[0],
      additionalFilters: buildCohortGqlOperator(filters),
    },
    { skip: selectedSets.length === 0 },
  );
  const [appendToSet] = appendSetHook();

  const nothingToAdd = isCountBothSuccess && addToCount === countInBoth;

  return (
    <Modal
      title={`Add ${addToCount?.toLocaleString()} ${setTypeLabel}${
        addToCount > 1 ? "s" : ""
      } to an existing set`}
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
            value >= SET_COUNT_LIMIT
              ? `The set cannot exceed ${SET_COUNT_LIMIT.toLocaleString()} ${setTypeLabel}s.`
              : undefined
          }
          sortByName
        />
        {isSuccessCount &&
          selectedSets.length > 0 &&
          addToCount + setCount > SET_COUNT_LIMIT && (
            <WarningMessage
              message={`The set cannot exceed ${SET_COUNT_LIMIT.toLocaleString()} ${setTypeLabel}s. Only the top ${(
                SET_COUNT_LIMIT - setCount
              ).toLocaleString()} ${setTypeLabel} will be added to the set.`}
            />
          )}
        {nothingToAdd && (
          <ErrorMessage
            message={`All ${setTypeLabel}s are already in the set.`}
          />
        )}
      </div>
      <ModalButtonContainer data-testid="modal-button-container">
        <FunctionButton data-testid="button-cancel" onClick={closeModal}>
          Cancel
        </FunctionButton>
        <DarkFunctionButton
          data-testid="button-save"
          disabled={
            selectedSets.length === 0 || nothingToAdd || !isSuccessCount
          }
          onClick={() => {
            appendToSet({
              setId: selectedSets[0][0],
              case_filters: buildCohortGqlOperator(cohortFilters) ?? {},
              filters: {
                content: buildCohortGqlOperator(filters)
                  ? [
                      buildCohortGqlOperator(filters),
                      {
                        op: "excludeifany",
                        content: {
                          field,
                          value: [`set_id:${selectedSets[0][0]}`],
                        },
                      },
                    ]
                  : [
                      {
                        op: "excludeifany",
                        content: {
                          field,
                          value: [`set_id:${selectedSets[0][0]}`],
                        },
                      },
                    ],
                op: "and",
              },
              size: SET_COUNT_LIMIT - setCount,
              score: sort,
            })
              .unwrap()
              .then((response) => {
                const newSetId = response;
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
          }}
        >
          Save
        </DarkFunctionButton>
      </ModalButtonContainer>
    </Modal>
  );
};

export default AddToSetModal;
