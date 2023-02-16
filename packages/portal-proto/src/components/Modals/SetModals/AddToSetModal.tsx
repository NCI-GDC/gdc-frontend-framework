import React, { useEffect, useState } from "react";
import {
  UseMutation,
  UseQuery,
} from "@reduxjs/toolkit/dist/query/react/buildHooks";
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
import SetTable from "./SetTable";
import { modalStyles } from "../styles";
import { SET_COUNT_LIMIT } from "./constants";
import WarningMessage from "@/components/WarningMessage";

interface AddToSetModalProps {
  readonly filters: FilterSet;
  readonly addToCount: number;
  readonly setType: SetTypes;
  readonly setTypeLabel: string;
  readonly field: string;
  readonly index: string;
  readonly closeModal: () => void;
  readonly countHook: UseQuery<any>;
  readonly valuesHook: UseQuery<any>;
  readonly appendSetHook: UseMutation<any>;
}

const AddToSetModal: React.FC<AddToSetModalProps> = ({
  filters,
  addToCount,
  setType,
  setTypeLabel,
  field,
  index,
  closeModal,
  countHook,
  appendSetHook,
}: AddToSetModalProps) => {
  const [selectedSets, setSelectedSets] = useState<string[][]>([]);
  const dispatch = useCoreDispatch();
  const { data: setCount, isSuccess: isSuccessCount } = countHook({
    setId: selectedSets?.[0]?.[0],
    skip: selectedSets.length === 0,
  });
  const [appendToSet, response] = appendSetHook();

  // TODO - "All <entities> are already in the set." error
  /*
  const { data: setValues, isSuccess: isSuccessValues } = valuesHook({
    setId: selectedSets?.[0]?.[0],
    skip: selectedSets.length === 0,
  });
  */

  useEffect(() => {
    if (response.isSuccess) {
      const newSetId =
        response?.data?.data?.sets?.append?.explore?.[index]?.set_id;
      if (newSetId === undefined) {
        showNotification({
          message: "Problem modifiying set.",
          color: "red",
        });
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
  }, [response.isSuccess, response.isError, response.data, setType]);

  return (
    <Modal
      title={`Add ${addToCount.toLocaleString()} ${setTypeLabel}${
        addToCount > 1 ? "s" : ""
      } to an existing set`}
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
        />
        {isSuccessCount &&
          addToCount + (setCount as number) > SET_COUNT_LIMIT && (
            <WarningMessage
              message={`The set cannot exceed ${SET_COUNT_LIMIT.toLocaleString()} ${setTypeLabel}. Only the top ${(
                SET_COUNT_LIMIT - (setCount as number)
              ).toLocaleString()} ${setTypeLabel} will be added to the set.`}
            />
          )}
      </div>
      <ModalButtonContainer>
        <FunctionButton onClick={closeModal}>Cancel</FunctionButton>
        <DarkFunctionButton
          disabled={selectedSets.length === 0}
          onClick={() => {
            appendToSet({
              setId: selectedSets[0][0],
              filters: {
                content: [
                  buildCohortGqlOperator(filters),
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
              size: SET_COUNT_LIMIT,
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
