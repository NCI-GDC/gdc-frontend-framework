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
      <div className="font-montserrat py-5 pr-6 pl-2.5">
        <p className="font-medium text-[0.95rem] text-base-ink">{mainText}</p>
        <p className="text-sm pt-3 text-base-ink">{subText}</p>
      </div>
      <div className="bg-base-lightest p-4">
        <div className="flex justify-end gap-3">
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
      </div>
    </Modal>
  );
};

export default GenericCohortModal;
