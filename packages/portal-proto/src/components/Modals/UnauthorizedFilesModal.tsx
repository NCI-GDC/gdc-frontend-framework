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
  console.log(user);
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
      <div>
        <p>
          You are attempting to download files that you are not authorized to
          access.
        </p>
        <p>
          <Badge color="green">{filesByCanAccess.true?.length || 0}</Badge>{" "}
          files that you are authorized to download.
        </p>
        <p>
          <Badge color="red">{filesByCanAccess.false?.length || 0}</Badge> files
          that you are not authorized to download.
        </p>
        {!user.username && <LoginButton />}
        <div className="flex justify-end mt-2.5">
          <Button
            onClick={() => dispatch(hideModal())}
            className="!bg-primary hover:!bg-primary-darker"
          >
            Cancel
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default UnauthorizedFileModal;
