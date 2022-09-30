import { hideModal, useCoreDispatch } from "@gff/core";
import { Button, Modal } from "@mantine/core";
import { ReactNode } from "react";
import { theme } from "tailwind.config";

interface Props {
  openModal: boolean;
  title: ReactNode;
  closeButtonLabel: string;
  size?: string | number;
  children: ReactNode;
  buttons?: Array<{
    onClick?: () => void;
    title: string;
  }>;
}

export const BaseModal: React.FC<Props> = ({
  openModal,
  title,
  closeButtonLabel,
  size,
  children,
  buttons,
}: Props) => {
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
      {buttons && (
        <div className="flex justify-end mt-2.5 gap-2">
          {buttons.map(({ onClick, title }) => (
            <Button
              key={title}
              onClick={() => {
                onClick ? onClick() : dispatch(hideModal());
              }}
              className="!bg-primary hover:!bg-primary-darker"
            >
              {title}
            </Button>
          ))}
        </div>
      )}
    </Modal>
  );
};
