import { hideModal, useCoreDispatch, UserInfo, CartFile } from "@gff/core";
import { Button, Text, Badge } from "@mantine/core";
import { LoginButton } from "../LoginButton";
import { BaseModal } from "./BaseModal";

const UnauthorizedFileModal = ({
  openModal,
  user,
  filesByCanAccess,
}: {
  openModal: boolean;
  user: UserInfo;
  filesByCanAccess: Record<string, CartFile[]>;
}): JSX.Element => {
  const dispatch = useCoreDispatch();
  const numFilesCanAccess = filesByCanAccess.true?.length || 0;

  return (
    <BaseModal
      title={
        <Text size="lg" className="font-medium">
          Access Alert
        </Text>
      }
      closeButtonLabel="Close"
      openModal={openModal}
      size="xl"
    >
      <p>
        You are attempting to download files that you are not authorized to
        access.
      </p>
      <div className="my-4">
        <p>
          <Badge color="green">{numFilesCanAccess}</Badge> files that you are
          authorized to download.
        </p>
        <p>
          <Badge color="red">{filesByCanAccess.false?.length || 0}</Badge> files
          that you are not authorized to download.
        </p>
      </div>
      {!user.username ? (
        <div className="flex items-center">
          Please <LoginButton />
        </div>
      ) : (
        !filesByCanAccess.true && (
          <p>
            Please request dbGaP Access to the project (
            <a
              href="https://gdc.cancer.gov/access-data/obtaining-access-controlled-data"
              target="_blank"
              rel="noopener noreferrer"
              className="text-utility-link"
            >
              click here for more information
            </a>
            ).
          </p>
        )
      )}
      <div className="flex justify-end gap-2 mt-2">
        <Button
          onClick={() => dispatch(hideModal())}
          className="!bg-primary hover:!bg-primary-darker"
        >
          Cancel
        </Button>
        <Button
          disabled={numFilesCanAccess === 0}
          className="!bg-primary hover:!bg-primary-darker"
        >
          Download {numFilesCanAccess} Authorized Files
        </Button>
      </div>
    </BaseModal>
  );
};

export default UnauthorizedFileModal;
