import { hideModal, useCoreDispatch } from "@gff/core";
import { Button, Text } from "@mantine/core";
import { LoginButton } from "../LoginButton";
import { BaseModal } from "./BaseModal";

export const SessionExpireModal = ({
  openModal,
}: {
  openModal: boolean;
}): JSX.Element => {
  const dispatch = useCoreDispatch();
  return (
    <BaseModal
      title={
        <Text size="lg" className="font-medium">
          Session Expired
        </Text>
      }
      closeButtonLabel="Cancel"
      openModal={openModal}
    >
      <div className="border-y border-y-nci-gray p-4">
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
          className="!bg-nci-blue hover:!bg-nci-blue-darker"
        >
          Cancel
        </Button>
      </div>
    </BaseModal>
  );
};
