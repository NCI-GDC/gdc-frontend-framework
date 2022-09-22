import { useCoreSelector, selectCurrentMessage } from "@gff/core";
import { Text } from "@mantine/core";
import { BaseModal } from "./BaseModal";

export const GeneralErrorModal = ({
  openModal,
}: {
  openModal: boolean;
}): JSX.Element => {
  const message = useCoreSelector((state) => selectCurrentMessage(state));
  return (
    <BaseModal
      title={
        <Text size="lg" className="font-medium">
          Error
        </Text>
      }
      closeButtonLabel="Close"
      openModal={openModal}
      buttons={[{ title: "Close" }]}
    >
      <div className="border-y border-y-base p-4">
        <Text size="md"> {message}</Text>
      </div>
    </BaseModal>
  );
};
