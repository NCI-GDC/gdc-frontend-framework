import { hideModal, useCoreDispatch } from "@gff/core";
import { Button, Text } from "@mantine/core";
import { LoginButton } from "../LoginButton";
import { BaseModal } from "./BaseModal";

export const NoAccessModal = ({
  openModal,
}: {
  openModal: boolean;
}): JSX.Element => {
  const dispatch = useCoreDispatch();
  return (
    <BaseModal
      title={
        <Text size="lg" className="font-medium">
          Access Alert
        </Text>
      }
      closeButtonLabel="Close"
      openModal={openModal}
    >
      <div className="border-y border-y-nci-gray p-4">
        <Text size="sm"> You don&apos;t have access to this file.</Text>

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
          Close
        </Button>
      </div>
    </BaseModal>
  );
};
