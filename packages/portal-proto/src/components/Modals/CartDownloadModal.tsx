import React, { useState } from "react";
import { Button, Text, Badge } from "@mantine/core";
import { hideModal, useCoreDispatch, UserInfo, CartFile } from "@gff/core";
import { LoginButton } from "@/components/LoginButton";
import { DownloadButton } from "@/components/DownloadButtons";
import { BaseModal } from "./BaseModal";
import DownloadAccessAgreement from "./DownloadAccessAgreement";

const CartDownloadModal = ({
  openModal,
  user,
  filesByCanAccess,
  dbGapList,
  setActive,
}: {
  openModal: boolean;
  user: UserInfo;
  filesByCanAccess: Record<string, CartFile[]>;
  dbGapList: string[];
  setActive: (active: boolean) => void;
}): JSX.Element => {
  const dispatch = useCoreDispatch();
  const [checked, setChecked] = useState(false);
  const numFilesCanAccess = filesByCanAccess.true?.length || 0;
  const numFilesCannotAccess = filesByCanAccess.false?.length || 0;

  return (
    <BaseModal
      title={<Text size="xl">Access Alert</Text>}
      openModal={openModal}
      size="xl"
      onClose={() => setActive(false)}
    >
      <hr />
      {numFilesCannotAccess > 0 && (
        <div className="mt-2 text-[15px]">
          <p>
            You are attempting to download files that you are not authorized to
            access.
          </p>
          <div className="my-4">
            <div data-testid="cart-download-modal-auth-files">
              <Badge color="green.9">{numFilesCanAccess}</Badge> file
              {numFilesCanAccess !== 1 && "s"} that you are authorized to
              download.
            </div>
            <div data-testid="cart-download-modal-unauth-files">
              <Badge color="red.9">{numFilesCannotAccess}</Badge> file
              {numFilesCannotAccess !== 1 && "s"} that you are not authorized to
              download.
            </div>
          </div>
        </div>
      )}
      {numFilesCannotAccess > 0 && (
        <p
          data-testid="cart-download-modal-project-access"
          className="text-[15px] my-4"
        >
          Please request dbGaP Access to the project (
          <a
            href="https://gdc.cancer.gov/access-data/obtaining-access-controlled-data"
            target="_blank"
            rel="noopener noreferrer"
            className="text-utility-link underline"
          >
            click here for more information
          </a>
          ).
        </p>
      )}
      {dbGapList.length > 0 && (
        <div className="my-4">
          <DownloadAccessAgreement
            checked={checked}
            setChecked={setChecked}
            dbGapList={dbGapList}
          />
        </div>
      )}
      <hr />
      <div className="flex justify-end gap-2 mt-4">
        <Button
          onClick={() => {
            dispatch(hideModal());
            setActive(false);
          }}
          color="primary"
        >
          Cancel
        </Button>
        <DownloadButton
          inactiveText={`Download ${numFilesCanAccess} Authorized File${
            numFilesCanAccess !== 1 ? "s" : ""
          }`}
          activeText=""
          disabled={
            numFilesCanAccess === 0 ||
            (user.username && dbGapList.length > 0 && !checked)
          }
          endpoint="data"
          extraParams={{
            ids: (filesByCanAccess?.true || []).map((file) => file.file_id),
            annotations: true,
            related_files: true,
          }}
          method="POST"
          setActive={setActive}
        />
        {!user.username && <LoginButton />}
      </div>
    </BaseModal>
  );
};

export default CartDownloadModal;
