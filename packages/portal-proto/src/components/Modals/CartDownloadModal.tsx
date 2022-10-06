import React, { useState } from "react";
import { Text, Badge } from "@mantine/core";
import qs from "querystring";
import { UserInfo, CartFile } from "@gff/core";
import { LoginButton } from "@/components/LoginButton";
import { DownloadButton } from "@/components/DownloadButtons";
import { BaseModal } from "./BaseModal";
import DownloadAccessAgreement from "./DownloadAccessAgreement";

const CartDownloadModal = ({
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
  const [checked, setChecked] = useState(false);
  const numFilesCanAccess = filesByCanAccess.true?.length || 0;
  const numFilesCannotAccess = filesByCanAccess.false?.length || 0;

  return (
    <BaseModal
      title={<Text size="xl">Access Alert</Text>}
      closeButtonLabel="Close"
      openModal={openModal}
      size="xl"
      buttons={[{ title: "Cancel" }]}
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
      {!user.username ? (
        <div className="flex items-center">
          Please <LoginButton />
        </div>
      ) : (
        <>
          {numFilesCannotAccess > 0 && (
            <p
              data-testid="cart-download-modal-project-access"
              className="text-[15px]"
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
        </>
      )}
      <hr />
      <div className="flex justify-end items-center ml-2 mt-2.5 float-right">
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
          method="POST"
          queryParams={`?${qs.stringify({
            ids: (filesByCanAccess?.true || []).map((file) => file.fileId),
            annotations: true,
            related_files: true,
          })}`}
          extraParams={{
            ids: (filesByCanAccess?.true || []).map((file) => file.fileId),
            annotations: true,
            related_files: true,
          }}
          options={{
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Range: "bytes=0-0",
            },
            method: "POST",
          }}
        />
      </div>
    </BaseModal>
  );
};

export default CartDownloadModal;
