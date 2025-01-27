import React from "react";
import { Modal, Button } from "@mantine/core";

interface GenericCohortModalProps {
  opened: boolean;
  title: string;
  onClose: () => void;
  actionText: string;
  mainText: JSX.Element;
  subText: JSX.Element;
  onActionClick: () => void;
}

export const GenericCohortModal: React.FC<GenericCohortModalProps> = ({
  opened,
  title,
  onClose,
  actionText,
  onActionClick,
  mainText,
  subText,
}) => {
  return (
    <Modal
      title={title}
      opened={opened}
      padding={0}
      radius="md"
      onClose={onClose}
    >
      <div
        style={{
          fontFamily: '"Montserrat", "sans-serif"',
          padding: "20px 25px 20px 10px",
        }}
      >
        <p
          style={{
            fontFamily: '"Montserrat", "sans-serif"',
            fontSize: "0.95em",
            fontWeight: 500,
            color: "var(--mantine-color-base-8)", //ink
          }}
        >
          {mainText}
        </p>
        <p
          style={{
            fontFamily: '"Montserrat", "sans-serif"',
            fontSize: "0.85em",
            color: "var(--mantine-color-base-8)",
            paddingTop: "1em",
          }}
        >
          {subText}
        </p>
      </div>
      <div
        style={{
          backgroundColor: "var(--mantine-color-base-1)",
          padding: "var(--mantine-spacing-md)",
          borderRadius: "var(--mantine-radius-md)",
          borderTopRightRadius: 0,
          borderTopLeftRadius: 0,
        }}
      >
        <div className="flex-end">
          <Button variant="outline" color="secondary" onClick={onClose}>
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
        </div>
      </div>
    </Modal>
  );
};
