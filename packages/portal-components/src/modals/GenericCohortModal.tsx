import React, { JSX } from "react";
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

const GenericCohortModal: React.FC<GenericCohortModalProps> = ({
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
      <div className="font-content p-4">
        <p className="font-medium text-md">{mainText}</p>
        <p className="text-sm pt-3">{subText}</p>
      </div>
      <div className="bg-base-lightest p-4 flex justify-end gap-3">
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
          variant="filled"
          color="secondary"
          onClick={() => {
            onActionClick();
            onClose();
          }}
        >
          {actionText}
        </Button>
      </div>
    </Modal>
  );
};

export default GenericCohortModal;
