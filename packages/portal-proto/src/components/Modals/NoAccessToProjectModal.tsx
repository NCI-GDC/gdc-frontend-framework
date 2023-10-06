import { Text } from "@mantine/core";
import { BaseModal } from "./BaseModal";

export const NoAccessToProjectModal = ({
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
      openModal={openModal}
      buttons={[
        {
          title: "Close",
          dataTestId: "button-no-access-to-project-access-alert-close",
        },
      ]}
    >
      <div className="border-y border-y-base-darker p-4">
        <Text size="sm"> You don&apos;t have access to this file.</Text>

        <Text size="sm">
          Please request dbGaP access to the project{" ("}
          <a
            href="https://gdc.cancer.gov/access-data/obtaining-access-controlled-data"
            target="_blank"
            rel="noreferrer"
            className="text-utility-link underline"
          >
            click here for more information
          </a>
          ).
        </Text>
      </div>
    </BaseModal>
  );
};
