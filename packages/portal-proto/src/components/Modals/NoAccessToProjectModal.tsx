import { hideModal, useCoreDispatch } from "@gff/core";
import { Button, Text } from "@mantine/core";
import { BaseModal } from "./BaseModal";

export const NoAccessToProjectModal = ({
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

        <Text size="sm">
          Please request dbGaP access to the project{" ("}
          <a
            href="https://gdc.cancer.gov/access-data/obtaining-access-controlled-data"
            target="_blank"
            rel="noreferrer"
            className="text-nci-blue underline"
          >
            click here for more information
          </a>
          ).
        </Text>
      </div>
      <div className="flex justify-end mt-2.5">
        <Button
          onClick={() => dispatch(hideModal())}
          className="!bg-nci-blue hover:!bg-nci-blue-darker"
        >
          Close
        </Button>
      </div>
    </BaseModal>
  );
};
