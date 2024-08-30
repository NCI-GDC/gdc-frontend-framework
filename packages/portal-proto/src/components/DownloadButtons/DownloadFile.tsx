import { userCanDownloadFile } from "src/utils/userProjectUtils";
import {
  GdcFile,
  useCoreDispatch,
  showModal,
  Modals,
  useLazyFetchUserDetailsQuery,
} from "@gff/core";
import { DownloadButton } from "./DownloadButton";
import { useState } from "react";
import { useDeepCompareCallback } from "use-deep-compare";
import { FunctionButtonVariants } from "../FunctionButton";

interface DownloadFileProps {
  file: GdcFile;
  activeText?: string;
  inactiveText?: string;
  setfileToDownload?: React.Dispatch<React.SetStateAction<GdcFile>>;
  showLoading?: boolean;
  customDataTestID?: string;
  displayVariant?: FunctionButtonVariants;
}

export const DownloadFile: React.FC<DownloadFileProps> = ({
  file,
  activeText,
  inactiveText,
  setfileToDownload,
  showLoading = true,
  customDataTestID,
  displayVariant,
}: DownloadFileProps) => {
  const dispatch = useCoreDispatch();
  const [fetchUserDetails] = useLazyFetchUserDetailsQuery();

  const [active, setActive] = useState(false);

  const onClick = useDeepCompareCallback(async () => {
    fetchUserDetails()
      .unwrap()
      .then((userInfo) => {
        if (setfileToDownload) {
          setfileToDownload(file);
        }
        if (
          userInfo?.data?.username &&
          userCanDownloadFile({ user: userInfo?.data, file })
        ) {
          dispatch(showModal({ modal: Modals.AgreementModal }));
        } else if (
          userInfo?.data?.username &&
          !userCanDownloadFile({ user: userInfo?.data, file })
        ) {
          dispatch(showModal({ modal: Modals.NoAccessToProjectModal }));
        } else {
          dispatch(showModal({ modal: Modals.NoAccessModal }));
        }
      });
  }, [fetchUserDetails, file, dispatch, setfileToDownload]);

  // TODO: need to send set active to agreement modal in a better way
  // TODO: rethink of a better architecture for it
  if (file.access === "open") {
    return (
      <DownloadButton
        data-testid={customDataTestID}
        extraParams={{
          ids: file.file_id,
          annotations: true,
          related_files: true,
        }}
        filename={file.file_name}
        endpoint={`data/${file.file_id}`}
        activeText={activeText}
        inactiveText={inactiveText}
        method="GET"
        setActive={setActive}
        active={active}
        showLoading={showLoading}
        displayVariant={displayVariant}
      />
    );
  }

  return (
    <DownloadButton
      data-testid={customDataTestID}
      inactiveText={inactiveText}
      activeText={activeText}
      onClick={onClick}
      setActive={setActive}
      active={active}
      showLoading={showLoading}
      displayVariant={displayVariant}
    />
  );
};
