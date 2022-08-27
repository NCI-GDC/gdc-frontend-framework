import { hideModal, useCoreDispatch } from "@gff/core";
import { Button, Text } from "@mantine/core";
import { BaseModal } from "../BaseModal";

export const BAMSlicingErrorModal = ({
  openModal,
}: {
  openModal: boolean;
}): JSX.Element => {
  const dispatch = useCoreDispatch();
  console.log("openModal: ", openModal);
  return (
    <BaseModal
      title={
        <Text size="lg" className="font-medium">
          Download Error
        </Text>
      }
      closeButtonLabel="Ok"
      openModal={openModal}
    >
      <div className="border-y border-y-nci-gray p-4">
        <Text size="md">
          You have entered invalid coordinates. Please try again.
        </Text>
      </div>
      <div className="flex justify-end mt-2.5">
        <Button
          onClick={() => dispatch(hideModal())}
          className="!bg-nci-blue hover:!bg-nci-blue-darker"
        >
          OK
        </Button>
      </div>
    </BaseModal>
  );
};
