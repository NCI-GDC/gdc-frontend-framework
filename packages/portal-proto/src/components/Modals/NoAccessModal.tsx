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
        <LoginButton fromSession />,
      ]}
    >
      <div className="border-y border-y-base p-4">
        <Text size="sm">
          {" "}
          You don&apos;t have access to this file. Please login.
        </Text>
      </div>
    </BaseModal>
  );
};
