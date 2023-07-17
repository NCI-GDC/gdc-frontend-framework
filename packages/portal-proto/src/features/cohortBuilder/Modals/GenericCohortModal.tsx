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
      zIndex={400}
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
            color: theme.colors.base[8], //ink
          })}
        >
          {mainText}
        </Text>
        <Text
          sx={(theme) => ({
            fontFamily: '"Montserrat", "sans-serif"',
            fontSize: "0.85em",
            color: theme.colors.base[8],
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
            color="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant={"filled"}
            color="secondary"
            onClick={() => {
              onActionClick();
              onClose();
            }}
          >
            {actionText}
          </Button>
        </Group>
      </Box>
    </Modal>
  );
};
