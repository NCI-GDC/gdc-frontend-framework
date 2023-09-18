import { hideModal, useCoreDispatch } from "@gff/core";
import { Button, Modal } from "@mantine/core";
import { ReactNode } from "react";
import { theme } from "tailwind.config";

interface ButtonOptions {
  onClick?: () => void;
  hideModalOnClick?: boolean;
  title: string;
  dataTestId: string;
}

const isButtonOptions = (button): button is ButtonOptions => {
  return typeof button === "object" && button.title;
};

interface Props {
  openModal: boolean;
  title: ReactNode;
  closeButtonLabel: string;
  size?: string | number;
  children: ReactNode;
  buttons?: Array<ButtonOptions | JSX.Element>;
  withCloseButton?: boolean;
  onClose?: () => void;
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
}

export const BaseModal: React.FC<Props> = ({
  openModal,
  title,
  closeButtonLabel,
  size,
  children,
  buttons,
  withCloseButton,
  onClose,
  closeOnClickOutside,
  closeOnEscape,
}: Props) => {
  const dispatch = useCoreDispatch();
  return (
    <Modal
      opened={openModal}
      title={title}
      zIndex={400}
      onClose={() => {
        dispatch(hideModal());
        if (onClose) {
          onClose();
        }
      }}
      styles={() => ({
        header: {
          marginBottom: "5px",
        },
        close: {
          color: theme.extend.colors["gdc-grey"].darkest,
        },
      })}
      closeButtonProps={{ "aria-label": closeButtonLabel }}
      withinPortal={false}
      withCloseButton={withCloseButton ?? true}
      closeOnClickOutside={closeOnClickOutside ?? true}
      closeOnEscape={closeOnEscape ?? true}
      size={size && size}
    >
      {children}
      {buttons && (
        <div className="flex justify-end mt-2.5 gap-2">
          {buttons.map((button) => {
            if (isButtonOptions(button)) {
              const { onClick, title, hideModalOnClick, dataTestId } = button;

              return (
                <Button
                  data-testid={dataTestId}
                  key={title}
                  onClick={() => {
                    if (onClick) {
                      onClick();

                      if (hideModalOnClick) {
                        dispatch(hideModal());
                      }
                    } else {
                      dispatch(hideModal());
                    }
                  }}
                  className="!bg-primary hover:!bg-primary-darker"
                >
                  {title}
                </Button>
              );
            } else return button;
          })}
        </div>
      )}
    </Modal>
  );
};
