import { userCanDownloadFile } from "@/features/files/BAMSlicingButton/util";
import {
  GdcFile,
  useCoreSelector,
  UserInfo,
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
}

export const DownloadFile: React.FC<DownloadFileProps> = ({
  file,
  activeText,
  inactiveText,
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
    <Button
      className="text-base-lightest bg-primary hover:bg-primary-darker"
      leftIcon={inactiveText && <FaDownload />}
      onClick={() => {
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
  );
};
