import { hideModal, useCoreDispatch } from "@gff/core";
import { Button, Modal, Text } from "@mantine/core";
import { theme } from "tailwind.config";
import { LoginButton } from "../LoginButton";

export const SessionExpireModal = ({
  openModal,
}: {
  openModal: boolean;
}): JSX.Element => {
  const dispatch = useCoreDispatch();
  return (
    <Modal
      opened={openModal}
      title={
        <Text size="lg" className="bold">
          Session Expired
        </Text>
      }
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
      closeButtonLabel="Cancel"
      withinPortal={false}
      data-testid="sessionmodal"
    >
      <div className="border-y border-y-base p-4">
        <Text size="sm"> Your session has expired.</Text>
        <div className="flex content-center">
          <Text size="sm" className="mt-1">
            Please
          </Text>{" "}
          <LoginButton fromSession />
        </div>
      </div>
      <div className="flex justify-end mt-2.5">
        <Button
          onClick={() => dispatch(hideModal())}
          className="!bg-primary hover:!bg-primary-darker"
        >
          Cancel
        </Button>
      </div>
    </Modal>
  );
};
