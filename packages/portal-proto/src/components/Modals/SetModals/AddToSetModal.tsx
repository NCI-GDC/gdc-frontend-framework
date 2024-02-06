import React, { useEffect, useState } from "react";
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
  FilterSet,
  SetTypes,
  buildCohortGqlOperator,
  addSet,
  useCoreDispatch,
} from "@gff/core";
import ModalButtonContainer from "@/components/StyledComponents/ModalButtonContainer";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";
import FunctionButton from "@/components/FunctionButton";
import WarningMessage from "@/components/WarningMessage";
import ErrorMessage from "@/components/ErrorMessage";
import SetTable from "./SetTable";
import { SET_COUNT_LIMIT } from "./constants";
import AccessibleNotificationWrapper from "@/components/AccessibleNotificationWrapper";

interface AddToSetModalProps {
  readonly filters: FilterSet;
  readonly addToCount: number;
  readonly setType: SetTypes;
  readonly setTypeLabel: string;
  readonly field: string;
  readonly sort?: string;
  readonly closeModal: () => void;
  readonly singleCountHook: UseQuery<
    QueryDefinition<any, any, any, number, string>
  >;
  readonly countHook: UseQuery<
    QueryDefinition<any, any, any, Record<string, number>, string>
  >;
  readonly appendSetHook: UseMutation<
    MutationDefinition<any, any, any, string, string>
  >;
}

const AddToSetModal: React.FC<AddToSetModalProps> = ({
  filters,
  addToCount,
  setType,
  setTypeLabel,
  field,
  sort,
  closeModal,
  singleCountHook,
  countHook,
  appendSetHook,
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
  const [appendToSet, response] = appendSetHook();

  const nothingToAdd = isCountBothSuccess && addToCount === countInBoth;

  useEffect(() => {
    if (response.isSuccess) {
      const newSetId = response.data;
      if (newSetId === undefined) {
        showNotification({
          message: (
            <AccessibleNotificationWrapper>
              Problem modifiying set.
            </AccessibleNotificationWrapper>
          ),
          color: "red",
        });
      } else {
        dispatch(
          addSet({ setType, setName: selectedSets[0][1], setId: newSetId }),
        );
        showNotification({
          message: (
            <AccessibleNotificationWrapper>
              Set has been modified.
            </AccessibleNotificationWrapper>
          ),
          closeButtonProps: { "aria-label": "Close notification" },
        });

        closeModal();
      }
    } else if (response.isError) {
      showNotification({
        message: (
          <AccessibleNotificationWrapper>
            Problem modifiying set.
          </AccessibleNotificationWrapper>
        ),
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
      title={`Add ${addToCount.toLocaleString()} ${setTypeLabel}${
        addToCount > 1 ? "s" : ""
      } to an existing set`}
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
        <FunctionButton onClick={closeModal}>Cancel</FunctionButton>
        <DarkFunctionButton
          disabled={
            selectedSets.length === 0 || nothingToAdd || !isSuccessCount
          }
          onClick={() => {
            appendToSet({
              setId: selectedSets[0][0],
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
