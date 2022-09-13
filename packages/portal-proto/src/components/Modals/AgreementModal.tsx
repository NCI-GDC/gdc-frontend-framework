import { GdcFile, hideModal, useCoreDispatch } from "@gff/core";
import { Anchor, Button, Checkbox, Text } from "@mantine/core";
import { useState } from "react";
import { DownloadButton, DownloadFile } from "../DownloadButtons";
import { BaseModal } from "./BaseModal";

export const AgreementModal = ({
  openModal,
  file,
  dbGapList,
}: {
  openModal: boolean;
  file: GdcFile;
  dbGapList?: readonly string[];
}): JSX.Element => {
  let dbGapLink =
    dbGapList.length === 1
      ? "https://www.ncbi.nlm.nih.gov/projects/gap/cgi-bin/study.cgi?study_id=" +
        dbGapList[0]
      : "https://www.ncbi.nlm.nih.gov/gap/?term=" +
        dbGapList.reduce((acc, d) => acc + "(" + d + "%5BStudy%5D)+OR+", "");
  if (dbGapLink.substring(dbGapLink.length - 4) === "+OR+") {
    dbGapLink = dbGapLink.slice(0, dbGapLink.length - 4);
  }
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
        <Text className="text-[15px] mb-3">
          You are attempting to download files that are controlled access:
        </Text>
        <Checkbox
          label={
            <Text className="text-[15px]">
              I agree to abide by the{" "}
              <Anchor
                size="sm"
                href="https://gdc.cancer.gov/about-data/data-analysis-policies"
                target="_blank"
                className="underline"
              >
                GDC Data Use Agreement
              </Anchor>{" "}
              and the study-specific Data Use Certification Agreement available
              in{" "}
              <Anchor
                size="sm"
                href={dbGapLink}
                target="_blank"
                className="underline"
              >
                dbGaP
              </Anchor>
              . This means:{" "}
            </Text>
          }
          className="mb-2"
          checked={checked}
          onChange={(event) => setChecked(event.currentTarget.checked)}
        />
        <ul className="text-[15px] pl-12 list-disc">
          <li>
            I agree not to attempt to reidentify any individual participant in
            any study represented by GDC data, for any purpose whatsoever.
          </li>
          <li>
            I agree to have read and understand study-specific Data Use
            Agreements and to comply with any additional restrictions therein.
          </li>
          <li>
            I agree to abide by the{" "}
            <a
              href="https://osp.od.nih.gov/scientific-sharing/policies/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-utility-link underline"
            >
              NIH Genomic Data Sharing Policy (GDS)
            </a>
            .
          </li>
        </ul>
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
          filename={file.fileName}
          extraParams={{ ids: file.fileId }}
          endpoint="data?annotations=true&related_files=true"
          activeText="Processing"
          inactiveText="Download"
          queryParams={file.fileId}
        />
      </div>
    </BaseModal>
  );
};
