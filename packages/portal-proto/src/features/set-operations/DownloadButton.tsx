import React, { useEffect, useState } from "react";
import { UseMutation } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { ActionIcon, Loader, Tooltip } from "@mantine/core";
import { FiDownload as DownloadIcon } from "react-icons/fi";
import { MutationDefinition } from "@reduxjs/toolkit/query";
import { SetOperationEntityType } from "@/features/set-operations/types";
import { CreateSetFilterArgs, GqlOperation, useCoreDispatch } from "@gff/core";
import download from "@/utils/download";
import { convertDateToString } from "@/utils/date";

const ENTITY_TYPE_TO_TAR = {
  mutations: "ssm",
  genes: "gene",
  cohort: "case",
};

interface DownloadButtonProps {
  readonly createSetHook: UseMutation<
    MutationDefinition<CreateSetFilterArgs, any, any, any>
  >;
  readonly entityType: SetOperationEntityType;
  readonly filters: GqlOperation;
  readonly setKey: string;
  readonly disabled: boolean;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  createSetHook,
  entityType,
  filters,
  setKey,
  disabled,
}: DownloadButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [createSet, response] = createSetHook();
  const dispatch = useCoreDispatch();

  useEffect(() => {
    if (response.isLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [response.isLoading]);

  useEffect(() => {
    if (response.isSuccess) {
      download({
        params: {
          attachment: true,
          format: "tsv",
          sets: [
            {
              id: response.data,
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
    }
  }, [dispatch, entityType, response.data, response.isSuccess, setKey]);

  return (
    <Tooltip
      label={disabled ? "No items to export" : "Export as TSV"}
      withArrow
    >
      <div className="w-fit">
        <ActionIcon
          data-testid="button-download-tsv-set-operations"
          onClick={() =>
            createSet({ filters, set_type: "instant", intent: "portal" })
          }
          color="primary"
          variant="outline"
          className={`${
            disabled
              ? "bg-base-lighter"
              : "bg-base-max hover:bg-primary hover:text-base-max"
          }`}
          disabled={disabled}
          aria-label="download TSV"
        >
          {loading ? <Loader size={14} /> : <DownloadIcon aria-hidden="true" />}
        </ActionIcon>
      </div>
    </Tooltip>
  );
};

export default DownloadButton;
