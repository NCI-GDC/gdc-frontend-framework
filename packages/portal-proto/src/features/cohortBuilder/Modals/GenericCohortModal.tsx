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
    >
      <Box
        style={{
          fontFamily: '"Montserrat", "sans-serif"',
          padding: "20px 25px 20px 10px",
        }}
      >
        <Text
          style={{
            fontFamily: '"Montserrat", "sans-serif"',
            fontSize: "0.95em",
            fontWeight: 500,
            color: "var(--mantine-color-base-8)", //ink
          }}
        >
          {mainText}
        </Text>
        <Text
          style={{
            fontFamily: '"Montserrat", "sans-serif"',
            fontSize: "0.85em",
            color: "var(--mantine-color-base-8)",
            paddingTop: "1em",
          }}
        >
          {subText}
        </Text>
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
            variant="outline"
            styles={{
              root: {
                backgroundColor: "white",
              },
            }}
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
