import { useEffect } from "react";
import { UseMutation } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { MutationDefinition } from "@reduxjs/toolkit/dist/query";
import { TextInput, NumberInput, Modal, Loader } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import {
  addSet,
  useCoreDispatch,
  SetTypes,
  useCoreSelector,
  selectSetsByType,
  CreateSetFilterArgs,
  GqlOperation,
} from "@gff/core";
import FunctionButton from "@/components/FunctionButton";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";
import ModalButtonContainer from "@/components/StyledComponents/ModalButtonContainer";
import WarningMessage from "@/components/WarningMessage";
import ErrorMessage from "@/components/ErrorMessage";
import { SET_COUNT_LIMIT } from "./constants";
import { useDeepCompareCallback } from "use-deep-compare";

interface SaveSelectionAsSetModalProps {
  readonly cohortFilters?: GqlOperation;
  readonly filters: GqlOperation;
  readonly initialSetName: string;
  readonly saveCount: number;
  readonly setType: SetTypes;
  readonly setTypeLabel: string;
  readonly createSetHook: UseMutation<
    MutationDefinition<CreateSetFilterArgs, any, any, any>
  >;
  readonly closeModal: () => void;
  readonly sort?: string;
  readonly opened: boolean;
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
  opened,
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

  const setValues = useDeepCompareCallback(
    () =>
      form.setValues((prev) => ({ ...prev, name: initialSetName, top: max })),
    [form.setValues, initialSetName, max],
  );

  useEffect(() => {
    if (opened) {
      setValues();
    }
  }, [opened, setValues]);

  return (
    <Modal
      title={`Save ${max?.toLocaleString()} ${setTypeLabel}${
        max > 1 ? "s" : ""
      } as a new set`}
      opened={opened}
      onClose={() => {
        closeModal();
        form.reset();
      }}
      size="lg"
      classNames={{
        close: "p-0 drop-shadow-lg",
      }}
    >
      <div className="p-4">
        <NumberInput
          data-testid="textbox-number-of-top-items"
          required
          label="Save top:"
          min={1}
          max={max}
          {...form.getInputProps("top")}
        />
        <p
          data-testid="text-up-to-top-items-can-be-saved"
          className="text-sm pb-2 pt-1"
        >
          Up to the top {max?.toLocaleString()} {setTypeLabel}
          {max > 1 ? "s" : ""} can be saved.
        </p>
        <TextInput
          data-testid="textbox-set-name"
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
        <FunctionButton data-testid="button-cancel" onClick={closeModal}>
          Cancel
        </FunctionButton>
        <DarkFunctionButton
          data-testid="button-save"
          onClick={() => {
            if (response.isLoading) return;
            createSet({
              case_filters: cohortFilters ?? {},
              filters: filters ?? {},
              size: form.values.top,
              score: sort,
              set_type: "mutable",
              intent: "user",
            })
              .unwrap()
              .then((response: string) => {
                dispatch(
                  addSet({
                    setType,
                    setName: form.values.name.trim(),
                    setId: response,
                  }),
                );
                showNotification({
                  message: "Set has been saved.",
                  closeButtonProps: { "aria-label": "Close notification" },
                });
                closeModal();
                form.reset();
              })
              .catch(() => {
                showNotification({
                  message: "Problem saving set.",
                  color: "red",
                  closeButtonProps: { "aria-label": "Close notification" },
                });
              });
          }}
          disabled={!form.isValid()}
        >
          {response?.isLoading ? <Loader size="sm" color="white" /> : "Save"}
        </DarkFunctionButton>
      </ModalButtonContainer>
    </Modal>
  );
};

export default SaveSelectionAsSetModal;
