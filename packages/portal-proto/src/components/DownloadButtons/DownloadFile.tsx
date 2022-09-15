import { userCanDownloadFile } from "@/features/files/BAMSlicingButton/util";
import {
  GdcFile,
  useCoreSelector,
  selectUserDetailsInfo,
  useCoreDispatch,
  showModal,
  Modals,
} from "@gff/core";
import { Button } from "@mantine/core";
import { FaDownload } from "react-icons/fa";
import { DownloadButton } from "./DownloadButton";

interface DownloadFileProps {
  file: GdcFile;
  activeText?: string;
  inactiveText?: string;
  setfileToDownload: React.Dispatch<React.SetStateAction<GdcFile>>;
}

export const DownloadFile: React.FC<DownloadFileProps> = ({
  file,
  activeText,
  inactiveText,
  setfileToDownload,
}: DownloadFileProps) => {
  const dispatch = useCoreDispatch();
  const userInfo = useCoreSelector((state) => selectUserDetailsInfo(state));
  const { username } = userInfo?.data || {};
  if (file.access === "open") {
    return (
      <DownloadButton
        extraParams={{ ids: file.fileId }}
        filename={file.fileName}
        endpoint="data?annotations=true&related_files=true"
        activeText={activeText}
        inactiveText={inactiveText}
      />
    );
  }
  return (
    <>
      <Button
        className={`${
          inactiveText
            ? "text-base-lightest bg-primary hover:bg-primary-darker"
            : "bg-base-lightest text-base-min border border-base-darkest rounded p-2 hover:bg-base-darkest hover:text-base-contrast-min"
        }`}
        leftIcon={inactiveText && <FaDownload />}
        onClick={() => {
          setfileToDownload(file);
          if (username && userCanDownloadFile({ user: userInfo.data, file })) {
            dispatch(showModal(Modals.AgreementModal));
          } else if (
            username &&
            !userCanDownloadFile({ user: userInfo.data, file })
          ) {
            dispatch(showModal(Modals.NoAccessToProjectModal));
          } else {
            dispatch(showModal(Modals.NoAccessModal));
          }
        }}
      >
        {inactiveText || <FaDownload title="download" />}
      </Button>
    </>
  );
};
