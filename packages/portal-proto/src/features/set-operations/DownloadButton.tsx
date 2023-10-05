import React from "react";
import { ActionIcon, Tooltip } from "@mantine/core";
import { FiDownload as DownloadIcon } from "react-icons/fi";
import { SetOperationEntityType } from "@/features/set-operations/types";
import { useCoreDispatch } from "@gff/core";
import download from "@/utils/download";
import { convertDateToString } from "@/utils/date";

const ENTITY_TYPE_TO_TAR = {
  mutations: "ssm",
  genes: "gene",
  cohort: "case",
};

interface DownloadButtonProps {
  readonly entityType: SetOperationEntityType;
  readonly setKey: string;
  readonly disabled: boolean;
  readonly caseSetId: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  entityType,
  caseSetId,
  setKey,
  disabled,
}: DownloadButtonProps) => {
  const dispatch = useCoreDispatch();

  return (
    <Tooltip
      label={disabled ? "No items to export" : "Export as TSV"}
      withArrow
    >
      <div className="w-fit">
        <ActionIcon
          onClick={() => {
            download({
              params: {
                attachment: true,
                format: "tsv",
                sets: [
                  {
                    id: caseSetId,
                    type: ENTITY_TYPE_TO_TAR[entityType],
                    filename: `${setKey
                      .replace(/∩/g, "intersection")
                      .replace(/∪/g, "union")}-set-ids.${convertDateToString(
                      new Date(),
                    )}.tsv`,
                  },
                ],
              },
              endpoint: "tar_sets",
              method: "POST",
              dispatch,
              hideNotification: true,
            });
          }}
          color="primary"
          variant="outline"
          className={`${
            disabled
              ? "bg-base-lighter"
              : "bg-base-max hover:bg-primary hover:text-base-max"
          }`}
          disabled={disabled}
          aria-label="download button"
        >
          <DownloadIcon />
        </ActionIcon>
      </div>
    </Tooltip>
  );
};

export default DownloadButton;
