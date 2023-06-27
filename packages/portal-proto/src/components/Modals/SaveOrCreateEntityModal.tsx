import { upperFirst } from "lodash";
import { Box, Button, Group, Modal, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { RiErrorWarningFill as WarningIcon } from "react-icons/ri";

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
}: {
  entity: string;
  action?: string;
  initialName?: string;
  opened: boolean;
  onClose: () => void;
  onActionClick: (name: string) => void;
  onNameChange: (name: string) => boolean;
  descriptionMessage?: string;
  additionalDuplicateMessage?: string;
}): JSX.Element => {
  const form = useForm({
    initialValues: {
      name: initialName,
    },

    validate: {
      name: (value) =>
        value.length === 0 ? (
          <span style={{ marginTop: "5px" }}>
            <WarningIcon style={{ display: "inline", marginRight: "2px" }} />
            Please fill out this field.
          </span>
        ) : null,
    },
  });

  const description =
    Object.keys(form.errors).length === 0 &&
    (!onNameChange((form?.values?.name || "").trim()) ? (
      <span className="text-warningColorText">
        <WarningIcon className="text-warningColor inline mr-0.5" />A {entity}{" "}
        with the same name already exists.{" "}
        {additionalDuplicateMessage && additionalDuplicateMessage}
      </span>
    ) : (
      <span>Maximum 100 characters</span>
    ));

  return (
    <Modal
      title={`${upperFirst(action)} ${upperFirst(entity)}`}
      opened={opened}
      padding={0}
      radius="md"
      zIndex={400}
      onClose={onClose}
      withinPortal={false}
      centered
    >
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
          inputWrapperOrder={["label", "input", "error", "description"]}
          {...form.getInputProps("name")}
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
            variant={"filled"}
            color="secondary"
            aria-label={`Save button to add a ${entity}`}
            onClick={() => {
              if (form.validate().hasErrors) return;
              onActionClick((form?.values?.name || "").trim());
              form.reset();
              onClose();
            }}
            data-testid="action-button"
          >
            {upperFirst(action)}
          </Button>
        </Group>
      </Box>
    </Modal>
  );
};
