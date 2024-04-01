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

interface DownloadFileProps {
  file: GdcFile;
  activeText?: string;
  inactiveText?: string;
  setfileToDownload?: React.Dispatch<React.SetStateAction<GdcFile>>;
  customStyle?: string;
  showLoading?: boolean;
  customDataTestID?: string;
}

export const DownloadFile: React.FC<DownloadFileProps> = ({
  file,
  activeText,
  inactiveText,
  setfileToDownload,
  customStyle,
  showLoading = true,
  customDataTestID,
}: DownloadFileProps) => {
  const dispatch = useCoreDispatch();
  const [fetchUserDetails] = useLazyFetchUserDetailsQuery();

  const [active, setActive] = useState(false);

  const customStyleFile = inactiveText
    ? "text-base-lightest bg-primary hover:bg-primary-darker"
    : `bg-base-max text-primary border border-primary rounded hover:bg-primary hover:text-base-max ${
        !inactiveText && !activeText ? "w-8 p-0 h-6" : "p-2"
      }`;

  const onClick = useDeepCompareCallback(async () => {
    fetchUserDetails()
      .unwrap()
      .then((userInfo) => {
        setfileToDownload && setfileToDownload(file);
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
        customStyle={customStyle || customStyleFile}
        showLoading={showLoading}
      />
    );
  }

  return (
    <DownloadButton
      data-testid={customDataTestID}
      customStyle={customStyle || customStyleFile}
      inactiveText={inactiveText}
      activeText={activeText}
      onClick={onClick}
      setActive={setActive}
      active={active}
      showLoading={showLoading}
    />
  );
};
