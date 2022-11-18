import { userCanDownloadFile } from "src/utils/userProjectUtils";
import {
  GdcFile,
  useCoreSelector,
  selectUserDetailsInfo,
  useCoreDispatch,
  showModal,
  Modals,
} from "@gff/core";
import { DownloadButton } from "./DownloadButton";
import { useState } from "react";

interface DownloadFileProps {
  file: GdcFile;
  activeText?: string;
  inactiveText?: string;
  setfileToDownload?: React.Dispatch<React.SetStateAction<GdcFile>>;
  customStyle?: string;
  showLoading?: boolean;
}

export const DownloadFile: React.FC<DownloadFileProps> = ({
  file,
  activeText,
  inactiveText,
  setfileToDownload,
  customStyle,
  showLoading = true,
}: DownloadFileProps) => {
  const dispatch = useCoreDispatch();
  const userInfo = useCoreSelector((state) => selectUserDetailsInfo(state));

  const [active, setActive] = useState(false);

  const customStyleFile = inactiveText
    ? "text-base-lightest bg-primary hover:bg-primary-darker"
    : `bg-base-lightest text-base-min border border-base-darkest rounded hover:bg-base-darkest hover:text-base-contrast-min ${
        !inactiveText && !activeText ? "w-8 p-0" : "p-2"
      }`;

  const { username } = userInfo?.data || {};
  if (file.access === "open") {
    return (
      <DownloadButton
        extraParams={{
          ids: file.file_id,
          annotations: true,
          related_files: true,
        }}
        filename={file.file_name}
        endpoint={`data/${file.file_id}`}
        activeText={activeText}
        inactiveText={inactiveText}
        queryParams={""}
        options={{
          method: "GET",
          headers: {
            Range: "bytes=0-0",
          },
        }}
        setActive={setActive}
        active={active}
        customStyle={customStyle || customStyleFile}
        showLoading={showLoading}
      />
    );
  }

  const onClick = () => {
    setfileToDownload && setfileToDownload(file);
    if (username && userCanDownloadFile({ user: userInfo.data, file })) {
      dispatch(showModal({ modal: Modals.AgreementModal }));
    } else if (
      username &&
      !userCanDownloadFile({ user: userInfo.data, file })
    ) {
      dispatch(showModal({ modal: Modals.NoAccessToProjectModal }));
    } else {
      dispatch(showModal({ modal: Modals.NoAccessModal }));
    }
  };

  // TODO: need to send set active to agreement modal in a better way
  // TODO: rethink of a better architecture for it
  return (
    <DownloadButton
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
