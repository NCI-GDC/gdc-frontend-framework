import { Box, Button, Group, Modal, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { RiErrorWarningFill as WarningIcon } from "react-icons/ri";

export const SavingCohortModal = ({
  initialName,
  opened,
  onClose,
  onSaveClick,
  onSaveCohort,
}: {
  initialName: string;
  opened: boolean;
  onClose: () => void;
  onSaveClick: (name: string) => void;
  onSaveCohort: (name: string) => boolean;
}) => {
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
    (!onSaveCohort(form.values.name) ? (
      <span style={{ color: "#976F21" }}>
        <WarningIcon
          style={{
            color: "#FFAD0D",
            display: "inline",
            marginRight: "2px",
          }}
        />
        A cohort with the same name already exists.
      </span>
    ) : (
      <span>Maximum 100 characters</span>
    ));

  return (
    <Modal
      title="Save Cohort"
      opened={opened}
      padding={0}
      radius="md"
      onClose={onClose}
      styles={(theme) => ({
        header: {
          color: theme.colors.primary[8],
          fontFamily: '"Montserrat", "sans-serif"',
          fontSize: "1.65em",
          fontWeight: 500,
          letterSpacing: ".1rem",
          borderColor: theme.colors.base[1],
          borderStyle: "solid",
          borderWidth: "0px 0px 2px 0px",
          padding: "15px 20px 15px 15px",
          margin: "5px 5px 5px 5px",
        },
        modal: {
          backgroundColor: theme.colors.base[0],
        },
        close: {
          backgroundColor: theme.colors.base[1],
          color: theme.colors.primary[8],
        },
      })}
      withinPortal={false}
    >
      <Box
        sx={() => ({
          fontFamily: '"Noto", "sans-serif"',
          padding: "5px 25px 20px 10px",
        })}
      >
        <TextInput
          withAsterisk
          label="Name"
          placeholder="New Cohort Name"
          aria-label="Input field for new cohort name"
          description={description}
          styles={() => ({
            description: {
              marginTop: "5px",
            },
          })}
          data-autofocus
          maxLength={100}
          errorProps={{
            color: "#AD2B4A",
          }}
          inputWrapperOrder={["label", "input", "error", "description"]}
          {...form.getInputProps("name")}
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
            color="primary.5"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant={"filled"}
            color="primary.8"
            onClick={() => {
              if (form.validate().hasErrors) return;
              onSaveClick(form.values.name);
              onClose();
            }}
          >
            Save
          </Button>
        </Group>
      </Box>
    </Modal>
  );
};
