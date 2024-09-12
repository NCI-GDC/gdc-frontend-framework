import { upperFirst } from "lodash";
import { Box, Button, Group, Modal, TextInput, Loader } from "@mantine/core";
import { useForm } from "@mantine/form";
import { RiErrorWarningFill as WarningIcon } from "react-icons/ri";
import ErrorMessage from "../ErrorMessage";

interface SaveOrCreateEntityModalProps {
  entity: string;
  action?: string;
  initialName?: string;
  opened: boolean;
  onClose: () => void;
  onActionClick: (name: string) => void;
  onNameChange?: (name: string) => boolean;
  descriptionMessage?: string;
  additionalDuplicateMessage?: string;
  disallowedNames?: string[];
}
export const SaveOrCreateEntityModal = ({
  entity,
  action = "Save",
  initialName = "",
  opened,
  onClose,
  onActionClick,
  onNameChange,
  descriptionMessage,
  additionalDuplicateMessage,
  disallowedNames = [],
}: SaveOrCreateEntityModalProps): JSX.Element => {
  return (
    <Modal
      title={`${upperFirst(action)} ${upperFirst(entity)}`}
      opened={opened}
      padding={0}
      radius="md"
      onClose={onClose}
    >
      <SaveOrCreateEntityBody
        entity={entity}
        action={action}
        initialName={initialName}
        onClose={onClose}
        onActionClick={onActionClick}
        onNameChange={onNameChange}
        descriptionMessage={descriptionMessage}
        additionalDuplicateMessage={additionalDuplicateMessage}
        disallowedNames={disallowedNames}
      />
    </Modal>
  );
};

interface SaveOrCreateEntityBodyProps {
  entity: string;
  action?: string;
  initialName?: string;
  onClose: () => void;
  onActionClick: (name: string) => void;
  onNameChange?: (name: string) => boolean;
  descriptionMessage?: string;
  additionalDuplicateMessage?: string;
  closeOnAction?: boolean;
  loading?: boolean;
  disallowedNames?: string[];
}

export const SaveOrCreateEntityBody = ({
  entity,
  action = "Save",
  initialName = "",
  onClose,
  onActionClick,
  onNameChange,
  descriptionMessage,
  additionalDuplicateMessage,
  closeOnAction = true,
  loading = false,
  disallowedNames = [],
}: SaveOrCreateEntityBodyProps): JSX.Element => {
  const validationMessages = {
    emptyField: "Please fill out this field.",
    invalidName: (value: string) =>
      `${value} is not a valid name for a saved ${entity}. Please try another name.`,
  };

  const form = useForm({
    initialValues: {
      name: initialName,
    },
    validate: {
      name: (value) => {
        if (value.length === 0) {
          return validationMessages.emptyField;
        } else if (disallowedNames.includes(value.trim().toLowerCase())) {
          return validationMessages.invalidName(value);
        }
        return null;
      },
    },
  });

  // ignoring this error object as new one is being defined below
  const { error: _, ...inputProps } = form.getInputProps("name");

  const validationError = form.errors.name;
  const error = validationError && (
    <ErrorMessage message={validationError as string} />
  );

  const description =
    Object.keys(form.errors).length === 0 &&
    (onNameChange && !onNameChange((form?.values?.name || "").trim()) ? (
      <span className="text-warningColorText">
        <WarningIcon className="text-warningColor inline mr-0.5" />A {entity}{" "}
        with the same name already exists.{" "}
        {additionalDuplicateMessage && additionalDuplicateMessage}
      </span>
    ) : (
      <span>Maximum 100 characters</span>
    ));

  const handleActionClick = () => {
    if (form.validate().hasErrors || loading) return;
    onActionClick((form?.values?.name || "").trim());
    if (closeOnAction) {
      onClose();
    }
  };

  return (
    <>
      <Box className="font-content mt-1 mr-6 mb-5 ml-3">
        <p className="mb-2 text-sm font-content">
          {descriptionMessage && descriptionMessage}
        </p>
        <TextInput
          withAsterisk
          label="Name"
          placeholder={`New ${upperFirst(entity)} Name`}
          description={description}
          classNames={{
            description: "mt-1",
            input:
              "font-content data-[invalid=true]:text-utility-error data-[invalid=true]:border-utility-error",
            error: "text-utility-error",
          }}
          data-autofocus
          maxLength={100}
          error={error}
          inputWrapperOrder={["label", "input", "error", "description"]}
          {...inputProps}
          aria-required
          data-testid="textbox-name-input-field"
        />
      </Box>
      <Box
        style={{
          backgroundColor: "var(--mantine-color-base-1)",
          padding: "var(--mantine-spacing-md)",
          borderRadius: "var(--mantine-radius-md)",
          borderTopRightRadius: 0,
          borderTopLeftRadius: 0,
        }}
      >
        <Group justify="flex-end">
          <Button
            data-testid="button-cancel-save"
            variant="outline"
            classNames={{ root: "bg-base-max" }}
            color="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="filled"
            color="secondary"
            onClick={handleActionClick}
            data-testid="button-save-name"
            leftSection={
              loading ? <Loader size={15} color="white" /> : undefined
            }
          >
            {upperFirst(action)}
          </Button>
        </Group>
      </Box>
    </>
  );
};
