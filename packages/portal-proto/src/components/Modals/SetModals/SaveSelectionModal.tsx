import { useEffect } from "react";
import { UseMutation } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { TextInput, NumberInput, Modal } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { RiErrorWarningFill as WarningIcon } from "react-icons/ri";
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
import { modalStyles } from "../styles";

const EmptyMessage = () => (
  <span className="flex items-center mt-2">
    <WarningIcon className="mr-1" />
    Please fill out this field.
  </span>
);

const SetNameMessage = () => (
  <span className="flex items-center mt-2 text-[#976F21]">
    <WarningIcon className="mr-1 " />A set with the same name already exists.
  </span>
);

interface SaveSelectionAsSetModalProps {
  readonly selection: string[];
  readonly setType: SetTypes;
  readonly createSetHook: UseMutation<any>;
  readonly closeModal: () => void;
}

const SaveSelectionAsSetModal: React.FC<SaveSelectionAsSetModalProps> = ({
  selection,
  setType,
  createSetHook,
  closeModal,
}: SaveSelectionAsSetModalProps) => {
  const dispatch = useCoreDispatch();
  const sets = useCoreSelector((state) => selectSetsByType(state, setType));
  const [createSet, response] = createSetHook();

  const max = selection.length > 50000 ? 50000 : selection.length;
  const form = useForm({
    initialValues: {
      top: max,
      name: `Custom ${setType} Selection`,
    },
    validate: {
      top: (value) => (value === undefined ? <EmptyMessage /> : null),
      name: (value) =>
        value === "" ? (
          <EmptyMessage />
        ) : Object.values(sets).includes(value) ? (
          <SetNameMessage />
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
  }, [response.isSuccess, response.isError, response.data, dispatch, setType]);

  return (
    <Modal
      title={`Save ${selection.length} ${setType} as a new set`}
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
          Up to the top {max} {setType} can be saved.
        </p>
        <TextInput required label="Name" {...form.getInputProps("name")} />
        {form.errors?.name === undefined && (
          <p className="text-sm pt-1">Maximum 100 characters</p>
        )}
      </div>
      <ModalButtonContainer>
        <FunctionButton onClick={closeModal}>Cancel</FunctionButton>
        <DarkFunctionButton
          onClick={() =>
            createSet({ values: selection.slice(0, form.values.top) })
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
