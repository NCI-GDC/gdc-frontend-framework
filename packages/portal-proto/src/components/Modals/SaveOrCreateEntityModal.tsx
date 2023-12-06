import { upperFirst } from "lodash";
import { Box, Button, Group, Modal, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { RiErrorWarningFill as WarningIcon } from "react-icons/ri";

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
}: SaveOrCreateEntityBodyProps): JSX.Element => {
  const validationMessages = {
    emptyField: "Please fill out this field.",
    invalidName: (value: string) =>
      `${value} is not a valid name for a saved cohort. Please try another name.`,
  };

  const form = useForm({
    initialValues: {
      name: initialName,
    },
    validate: {
      name: (value) => {
        if (value.length === 0) {
          return validationMessages.emptyField;
        } else if (value.toLowerCase() === "unsaved_cohort") {
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
    <span className="mt-1">
      <WarningIcon className="inline mr-0.5" />
      {validationError}
    </span>
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
    if (form.validate().hasErrors) return;
    onActionClick((form?.values?.name || "").trim());
    if (closeOnAction) {
      onClose();
    }
  };

  return (
    <>
      <Box
        sx={() => ({
          fontFamily: '"Noto", "sans-serif"',
          padding: "5px 25px 20px 10px",
        })}
      >
        <p className="mb-2 text-sm font-content">
          {descriptionMessage && descriptionMessage}
        </p>
        <TextInput
          withAsterisk
          label="Name"
          placeholder={`New ${upperFirst(entity)} Name`}
          aria-label={`Input field for new ${entity} name`}
          description={description}
          styles={() => ({
            description: {
              marginTop: "5px",
            },
            input: {
              fontFamily: "Noto Sans, sans-serif",
            },
          })}
          data-autofocus
          maxLength={100}
          errorProps={{
            color: "#AD2B4A",
          }}
          error={error}
          inputWrapperOrder={["label", "input", "error", "description"]}
          {...inputProps}
          aria-required
          data-testid="input-field"
        />
      </Box>
      <Box
        sx={(theme) => ({
          backgroundColor: theme.colors.base[1],
          padding: theme.spacing.md,
          borderRadius: theme.radius.md,
          borderTopRightRadius: 0,
          borderTopLeftRadius: 0,
        })}
      >
        <Group position="right">
          <Button
            variant="outline"
            styles={() => ({
              root: {
                backgroundColor: "white",
              },
            })}
            color="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="filled"
            color="secondary"
            aria-label={`Save button to add a ${entity}`}
            onClick={handleActionClick}
            data-testid="action-button"
            loading={loading}
          >
            {upperFirst(action)}
          </Button>
        </Group>
      </Box>
    </>
  );
};
