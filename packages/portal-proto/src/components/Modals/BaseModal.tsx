import { hideModal, useCoreDispatch } from "@gff/core";
import { Modal, Text } from "@mantine/core";
import { ReactNode } from "react";
import { theme } from "tailwind.config";

interface Props {
  openModal: boolean;
  title: ReactNode;
  closeButtonLabel: string;
  size?: string | number;
}

export const BaseModal: React.FC<Props> = ({
  openModal,
  title,
  closeButtonLabel,
  size,
  children,
}) => {
  const dispatch = useCoreDispatch();
  return (
    <Modal
      opened={openModal}
      title={title}
      onClose={() => {
        dispatch(hideModal());
      }}
      styles={() => ({
        header: {
          marginBottom: "5px",
        },
        close: {
          color: theme.extend.colors["gdc-grey"].darkest,
        },
      })}
      closeButtonLabel={closeButtonLabel}
      withinPortal={false}
      size={size && size}
    >
      {children}
    </Modal>
  );
};
