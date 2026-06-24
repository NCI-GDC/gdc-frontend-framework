import React, { JSX } from "react";
import { Text } from "@mantine/core";
import { v4 as uuidv4 } from "uuid";
import { LoginButton } from "../LoginButton";
import { BaseModal } from "./BaseModal";
import { MODAL_Z_INDEX } from "src/styles/zIndex";

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
      openModal={openModal}
      buttons={[
        {
          title: "Close",
          dataTestId: "button-no-access-modal-access-alert-close",
        },
        <LoginButton fromSession key={uuidv4()} />,
      ]}
      zIndex={MODAL_Z_INDEX + 1}
    >
      <div className="border-y border-y-base p-4">
        <Text size="sm">
          You don&apos;t have access to this file. Please login.
        </Text>
      </div>
    </BaseModal>
  );
};
