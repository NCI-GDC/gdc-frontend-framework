import React, { useState } from "react";
import { hideModal, useCoreDispatch, UserInfo, CartFile } from "@gff/core";
import { Button, Text, Badge } from "@mantine/core";
import { LoginButton } from "../LoginButton";
import { BaseModal } from "./BaseModal";
import DownloadAccessAgreement from "./DownloadAccessAgreement";

const UnauthorizedFileModal = ({
  openModal,
  user,
  filesByCanAccess,
  dbGapList,
}: {
  openModal: boolean;
  user: UserInfo;
  filesByCanAccess: Record<string, CartFile[]>;
  dbGapList: string[];
}): JSX.Element => {
  const dispatch = useCoreDispatch();
  const [checked, setChecked] = useState(false);
  const numFilesCanAccess = filesByCanAccess.true?.length || 0;
  const numFilesCannotAccess = filesByCanAccess.false?.length || 0;

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
      {numFilesCannotAccess > 0 && (
        <>
          <p>
            You are attempting to download files that you are not authorized to
            access.
          </p>
          <div className="my-4">
            <div data-testid="cart-download-modal-auth-files">
              <Badge color="green">{numFilesCanAccess}</Badge> file
              {numFilesCanAccess !== 1 && "s"} that you are authorized to
              download.
            </div>
            <div data-testid="cart-download-modal-unauth-files">
              <Badge color="red">{numFilesCannotAccess}</Badge> file
              {numFilesCannotAccess !== 1 && "s"} that you are not authorized to
              download.
            </div>
          </div>
        </>
      )}
      {!user.username ? (
        <div className="flex items-center">
          Please <LoginButton />
        </div>
      ) : (
        <>
          {numFilesCannotAccess > 0 && (
            <p data-testid="cart-download-modal-project-access">
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
          )}
          {dbGapList.length > 0 && (
            <DownloadAccessAgreement
              checked={checked}
              setChecked={setChecked}
              dbGapList={dbGapList}
            />
          )}
        </>
      )}
      <div className="flex justify-end gap-2 mt-2">
        <Button onClick={() => dispatch(hideModal())} color="primary">
          Cancel
        </Button>
        <Button
          disabled={
            numFilesCanAccess === 0 ||
            (user.username && dbGapList.length > 0 && !checked)
          }
          color="primary"
        >
          Download {numFilesCanAccess} Authorized File
          {numFilesCanAccess !== 1 && "s"}
        </Button>
      </div>
    </BaseModal>
  );
};

export default UnauthorizedFileModal;
