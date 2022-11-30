import { Box, Modal, Text, Group, Button } from "@mantine/core";

export const GenericCohortModal = ({
  opened,
  title,
  onClose,
  actionText,
  onActionClick,
  mainText,
  subText,
}: {
  opened: boolean;
  title: string;
  onClose: () => void;
  actionText: string;
  mainText: JSX.Element;
  subText: JSX.Element;
  onActionClick: () => void;
}): JSX.Element => {
  return (
    <Modal
      title={title}
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
    >
      <Box
        sx={() => ({
          fontFamily: '"Montserrat", "sans-serif"',
          padding: "20px 25px 20px 10px",
        })}
      >
        <Text
          sx={(theme) => ({
            fontFamily: '"Montserrat", "sans-serif"',
            fontSize: "0.95em",
            fontWeight: 500,
            color: theme.colors.base[8],
          })}
        >
          {mainText}
        </Text>
        <Text
          sx={(theme) => ({
            fontFamily: '"Montserrat", "sans-serif"',
            fontSize: "0.85em",
            color: theme.colors.base[9],
            paddingTop: "1em",
          })}
        >
          {subText}
        </Text>
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
            // aria
            color="primary.5"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button variant={"filled"} color="primary.8" onClick={onActionClick}>
            {actionText}
          </Button>
        </Group>
      </Box>
    </Modal>
  );
};
