import { Text } from "@mantine/core";
import { LoginButton } from "../LoginButton";
import { BaseModal } from "./BaseModal";

export const SessionExpireModal = ({
  openModal,
}: {
  openModal: boolean;
}): JSX.Element => {
  return (
    <BaseModal
      title={
        <Text size="lg" className="font-medium">
          Session Expired
        </Text>
      }
      closeButtonLabel="Cancel"
      openModal={openModal}
      buttons={[
        { title: "Cancel", dataTestId: "button-session-expired-cancel" },
        <LoginButton fromSession />,
      ]}
    >
      <div className="border-y border-y-base p-4">
        <Text size="sm"> Your session has expired. Please login.</Text>
      </div>
    </BaseModal>
  );
};
