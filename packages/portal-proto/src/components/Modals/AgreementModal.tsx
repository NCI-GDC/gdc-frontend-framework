import { GdcFile, hideModal, useCoreDispatch } from "@gff/core";
import { Button, Text } from "@mantine/core";
import { SetStateAction, useState } from "react";
import { DownloadButton } from "../DownloadButtons";
import { BaseModal } from "./BaseModal";
import DownloadAccessAgreement from "./DownloadAccessAgreement";

export const AgreementModal = ({
  openModal,
  file,
  dbGapList,
  active,
  setActive,
}: {
  openModal: boolean;
  file: GdcFile;
  dbGapList?: readonly string[];
  setActive?: React.Dispatch<SetStateAction<boolean>>;
  active?: boolean;
}): JSX.Element => {
  const dispatch = useCoreDispatch();
  const [checked, setChecked] = useState(false);
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
      <div className="border-y border-y-base-darker py-4">
        <DownloadAccessAgreement
          checked={checked}
          setChecked={setChecked}
          dbGapList={dbGapList}
        />
      </div>
      <div className="flex justify-end mt-2.5 gap-2">
        <Button
          onClick={() => dispatch(hideModal())}
          className="!bg-primary hover:!bg-primary-darker"
        >
          Cancel
        </Button>

        <DownloadButton
          disabled={!checked}
          filename={file.file_name}
          extraParams={{
            ids: file.file_id,
            annotations: true,
            related_files: true,
          }}
          endpoint={`data/${file.file_id}`}
          activeText="Processing"
          inactiveText="Download"
          method="GET"
          setActive={setActive}
          active={active}
        />
      </div>
    </BaseModal>
  );
};
