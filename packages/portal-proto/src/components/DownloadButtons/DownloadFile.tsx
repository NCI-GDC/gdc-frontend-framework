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

interface DownloadFileProps {
  file: GdcFile;
  activeText?: string;
  inactiveText?: string;
  setfileToDownload: React.Dispatch<React.SetStateAction<GdcFile>>;
  active?: boolean;
  setActive?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DownloadFile: React.FC<DownloadFileProps> = ({
  file,
  activeText,
  inactiveText,
  setfileToDownload,
  active,
  setActive,
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
        queryParams={`data/${file.fileId}`}
        options={{
          method: "GET",
          headers: {
            Range: "bytes=0-0",
          },
        }}
        setActive={setActive}
        active={active}
      />
    );
  }

  const customStyle = inactiveText
    ? "text-base-lightest bg-primary hover:bg-primary-darker"
    : "bg-base-lightest text-base-min border border-base-darkest rounded p-2 hover:bg-base-darkest hover:text-base-contrast-min";

  const onClick = () => {
    setfileToDownload(file);
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
  return (
    <DownloadButton
      customStyle={customStyle}
      inactiveText={inactiveText}
      activeText={activeText}
      onClick={onClick}
      setActive={setActive}
      active={active}
    />
  );
};
