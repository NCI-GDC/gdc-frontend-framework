import {
  hideModal,
  selectUserDetailsInfo,
  useCoreDispatch,
  useCoreSelector,
} from "@gff/core";
import { Button, Text } from "@mantine/core";
import { LoginButton } from "../LoginButton";
import { BaseModal } from "./BaseModal";

export const NoAccessModal = ({
  openModal,
}: {
  openModal: boolean;
}): JSX.Element => {
  const dispatch = useCoreDispatch();
  const userInfo = useCoreSelector((state) => selectUserDetailsInfo(state));
  const { username } = userInfo?.data || {};
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
        <Text size="sm"> You don't have access to this file.</Text>
        {username ? (
          <Text size="sm">
            Please request dbGaP Access to the project{" "}
            <a
              href="https://gdc.cancer.gov/access-data/obtaining-access-controlled-data"
              target="_blank"
              rel="noreferrer"
              className="text-nci-blue underline"
            >
              {" "}
              (click here for more information).
            </a>
          </Text>
        ) : (
          <div className="flex content-center">
            <Text size="sm" className="mt-1">
              Please
            </Text>{" "}
            <LoginButton fromSession />
          </div>
        )}
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
