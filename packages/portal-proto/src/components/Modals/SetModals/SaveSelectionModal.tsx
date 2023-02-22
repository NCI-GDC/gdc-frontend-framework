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
  FilterSet,
  buildCohortGqlOperator,
} from "@gff/core";
import FunctionButton from "@/components/FunctionButton";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";
import ModalButtonContainer from "@/components/StyledComponents/ModalButtonContainer";
import WarningMessage from "@/components/WarningMessage";
import ErrorMessage from "@/components/ErrorMessage";
import { modalStyles } from "../styles";
import { SET_COUNT_LIMIT } from "./constants";

interface SaveSelectionAsSetModalProps {
  readonly filters: FilterSet;
  readonly initialSetName: string;
  readonly saveCount: number;
  readonly setType: SetTypes;
  readonly setTypeLabel: string;
  readonly createSetHook: UseMutation<any>;
  readonly closeModal: () => void;
}

const SaveSelectionAsSetModal: React.FC<SaveSelectionAsSetModalProps> = ({
  filters,
  initialSetName,
  saveCount,
  setType,
  setTypeLabel,
  createSetHook,
  closeModal,
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
          setName: form.values.name,
          setId: response.data as string,
        }),
      );
      showNotification({ message: "Set has been saved." });
      closeModal();
    } else if (response.isError) {
      showNotification({ message: "Problem saving set.", color: "red" });
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
      closeButtonLabel="close"
      opened
      onClose={closeModal}
      size="lg"
      classNames={modalStyles}
      withinPortal={false}
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
        <TextInput required label="Name" {...form.getInputProps("name")} />
        {form.errors?.name === undefined &&
        Object.values(sets).includes(form.values.name) ? (
          <WarningMessage message="A set with the same name already exists." />
        ) : (
          <p className="text-sm pt-1">Maximum 100 characters</p>
        )}
      </div>
      <ModalButtonContainer>
        <FunctionButton onClick={closeModal}>Cancel</FunctionButton>
        <DarkFunctionButton
          onClick={() =>
            createSet({
              filters: buildCohortGqlOperator(filters),
              size: form.values.top,
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
