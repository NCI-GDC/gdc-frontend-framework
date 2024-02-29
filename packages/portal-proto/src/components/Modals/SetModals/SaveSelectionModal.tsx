import { useEffect } from "react";
import { UseMutation } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { TextInput, NumberInput, Modal } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import {
  addSet,
  useCoreDispatch,
  SetTypes,
  useCoreSelector,
  selectSetsByType,
} from "@gff/core";
import FunctionButton from "@/components/FunctionButton";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";
import ModalButtonContainer from "@/components/StyledComponents/ModalButtonContainer";
import WarningMessage from "@/components/WarningMessage";
import ErrorMessage from "@/components/ErrorMessage";
import { SET_COUNT_LIMIT } from "./constants";

interface SaveSelectionAsSetModalProps {
  readonly cohortFilters?: Record<string, any>;
  readonly filters: Record<string, any>;
  readonly initialSetName: string;
  readonly saveCount: number;
  readonly setType: SetTypes;
  readonly setTypeLabel: string;
  readonly createSetHook: UseMutation<any>;
  readonly closeModal: () => void;
  readonly sort?: string;
}

const SaveSelectionAsSetModal: React.FC<SaveSelectionAsSetModalProps> = ({
  cohortFilters,
  filters,
  initialSetName,
  saveCount,
  setType,
  setTypeLabel,
  createSetHook,
  closeModal,
  sort,
}: SaveSelectionAsSetModalProps) => {
  const dispatch = useCoreDispatch();
  const sets = useCoreSelector((state) => selectSetsByType(state, setType));
  const [createSet, response] = createSetHook();

  const max = saveCount > SET_COUNT_LIMIT ? SET_COUNT_LIMIT : saveCount;
  const form = useForm({
    initialValues: {
      top: max,
      name: initialSetName,
    },
    validate: {
      top: (value) =>
        value === undefined ? (
          <ErrorMessage message="Please fill out this field." />
        ) : null,
      name: (value) =>
        value === "" ? (
          <ErrorMessage message="Please fill out this field." />
        ) : null,
    },
    validateInputOnChange: true,
  });

  useEffect(() => {
    if (response.isSuccess) {
      dispatch(
        addSet({
          setType,
          setName: form.values.name.trim(),
          setId: response.data as string,
        }),
      );
      showNotification({
        message: "Set has been saved.",
        closeButtonProps: { "aria-label": "Close notification" },
      });
      closeModal();
    } else if (response.isError) {
      showNotification({
        message: "Problem saving set.",
        color: "red",
        closeButtonProps: { "aria-label": "Close notification" },
      });
    }
  }, [
    response.isSuccess,
    response.isError,
    response.data,
    dispatch,
    setType,
    closeModal,
    form.values.name,
  ]);

  return (
    <Modal
      title={`Save ${max.toLocaleString()} ${setTypeLabel}${
        max > 1 ? "s" : ""
      } as a new set`}
      opened
      onClose={closeModal}
      size="lg"
      classNames={{
        close: "p-0 drop-shadow-lg",
      }}
    >
      <div className="p-4">
        <NumberInput
          required
          label="Save top:"
          min={1}
          max={max}
          {...form.getInputProps("top")}
        />
        <p className="text-sm pb-2 pt-1">
          Up to the top {max.toLocaleString()} {setTypeLabel}
          {max > 1 ? "s" : ""} can be saved.
        </p>
        <TextInput
          required
          label="Name"
          {...form.getInputProps("name")}
          maxLength={100}
        />
        {form.errors?.name === undefined &&
        Object.values(sets).includes(form.values.name.trim()) ? (
          <WarningMessage message="A set with the same name already exists. This will overwrite it." />
        ) : (
          <p className="text-sm pt-1">Maximum 100 characters</p>
        )}
      </div>
      <ModalButtonContainer data-testid="modal-button-container">
        <FunctionButton onClick={closeModal}>Cancel</FunctionButton>
        <DarkFunctionButton
          onClick={() =>
            createSet({
              case_filters: cohortFilters ?? {},
              filters: filters ?? {},
              size: form.values.top,
              score: sort,
            })
          }
          disabled={!form.isValid() || response.isLoading}
        >
          Save
        </DarkFunctionButton>
      </ModalButtonContainer>
    </Modal>
  );
};

export default SaveSelectionAsSetModal;
