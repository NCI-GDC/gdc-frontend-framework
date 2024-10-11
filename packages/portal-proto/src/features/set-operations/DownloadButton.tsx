import React, { useEffect, useState } from "react";
import { ActionIcon, Loader, Tooltip, Modal } from "@mantine/core";
import { MdDownload as DownloadIcon } from "react-icons/md";
import { SetOperationEntityType } from "@/features/set-operations/types";
import {
  useCreateCaseSetFromFiltersMutation,
  useCreateGeneSetFromFiltersMutation,
  useCreateSsmsSetFromFiltersMutation,
  GqlOperation,
  useCoreDispatch,
} from "@gff/core";
import download from "@/utils/download";
import { getFormattedTimestamp } from "@/utils/date";
import ModalButtonContainer from "@/components/StyledComponents/ModalButtonContainer";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";

const ENTITY_TYPE_TO_TAR = {
  mutations: "ssm",
  genes: "gene",
  cohort: "case",
};

interface DownloadButtonProps {
  readonly createSetHook:
    | typeof useCreateCaseSetFromFiltersMutation
    | typeof useCreateGeneSetFromFiltersMutation
    | typeof useCreateSsmsSetFromFiltersMutation;
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
  const [showErrorModal, setShowErrorModal] = useState(false);
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
                .replace(
                  /∪/g,
                  "union",
                )}-set-ids.${getFormattedTimestamp()}.tsv`,
            },
          ],
        },
        endpoint: "tar_sets",
        method: "POST",
        dispatch,
        hideNotification: true,
      });
    } else if (response.isError) {
      setShowErrorModal(true);
    }
  }, [
    dispatch,
    entityType,
    response.data,
    response.isSuccess,
    response.isError,
    setKey,
  ]);

  return (
    <>
      <Modal
        opened={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Export Set Error"
      >
        <p className="py-2 px-4">There was a problem exporting the set.</p>
        <ModalButtonContainer data-testid="modal-button-container">
          <DarkFunctionButton onClick={() => setShowErrorModal(false)}>
            OK
          </DarkFunctionButton>
        </ModalButtonContainer>
      </Modal>
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
            {loading ? (
              <Loader size={14} />
            ) : (
              <DownloadIcon aria-hidden="true" />
            )}
          </ActionIcon>
        </div>
      </Tooltip>
    </>
  );
};

export default DownloadButton;
