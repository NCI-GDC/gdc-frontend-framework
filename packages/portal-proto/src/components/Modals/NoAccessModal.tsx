import { Text } from "@mantine/core";
import { LoginButton } from "../LoginButton";
import { BaseModal } from "./BaseModal";

export const NoAccessModal = ({
  openModal,
}: {
  openModal: boolean;
}): JSX.Element => {
  return (
    <BaseModal
      title={
        <Text size="lg" className="font-medium">
          Access Alert
        </Text>
      }
      closeButtonLabel="Close"
      openModal={openModal}
      buttons={[
        {
          title: "Close",
          dataTestId: "button-no-access-modal-access-alert-close",
        },
      ]}
    >
      <div className="border-y border-y-base p-4">
        <Text size="sm"> You don&apos;t have access to this file.</Text>

        <div className="flex content-center">
          <Text size="sm" className="mt-1">
            Please
          </Text>{" "}
          <LoginButton fromSession />
        </div>
      </div>
    </BaseModal>
  );
};
