import { CaseSummary } from "@/features/cases/CaseSummary";
import { ContextualFileView } from "@/features/files/FileSummary";
import { GeneSummary } from "@/features/GeneSummary/GeneSummary";
import { SSMSSummary } from "@/features/mutationSummary/SSMSSummary";
import { ProjectSummary } from "@/features/projects/ProjectSummary";
import { Modal } from "@mantine/core";
import React, { useContext, useEffect, useState } from "react";
import { entityMetadataType, URLContext } from "src/utils/contexts";

export const SummaryModal = ({
  opened,
  entityMetadata,
  onClose,
}: {
  opened: boolean;
  entityMetadata: entityMetadataType;
  onClose: () => void;
}): JSX.Element => {
  const { prevPath, currentPath } = useContext(URLContext);
  const [modalOpened, setOpened] = useState(opened);
  const {
    entity_type,
    entity_id,
    contextSensitive = false,
    contextFilters = undefined,
  } = entityMetadata;
  useEffect(() => {
    if (prevPath !== currentPath) {
      setOpened(false);
      onClose();
    }
  }, [prevPath, currentPath, onClose]);

  const { SummaryPage } =
    entity_type === "project"
      ? {
          SummaryPage: <ProjectSummary projectId={entity_id} isModal={true} />,
        }
      : entity_type === "case"
      ? {
          SummaryPage: (
            <CaseSummary case_id={entity_id} bio_id="" isModal={true} />
          ),
        }
      : entity_type === "file"
      ? {
          SummaryPage: (
            <ContextualFileView setCurrentFile={entity_id} isModal={true} />
          ),
        }
      : entity_type === "ssms"
      ? {
          SummaryPage: <SSMSSummary ssm_id={entity_id} isModal={true} />,
        }
      : {
          SummaryPage: (
            <GeneSummary
              gene_id={entity_id}
              isModal={true}
              contextSensitive={contextSensitive}
              contextFilters={contextFilters}
            />
          ),
        };
  return (
    <Modal
      opened={modalOpened}
      onClose={onClose}
      size="calc(100vw - 100px)"
      withinPortal={false}
      zIndex={300}
      classNames={{
        header: "relative m-0 p-0 border-0",
        body: "relative",
        close:
          "absolute right-5 top-5 text-base-darkest [&_svg]:h-12 [&_svg]:w-12 mr-2 float-right z-30",
      }}
      padding={0}
      overlayProps={{ opacity: 0.5 }}
      closeButtonProps={{ "aria-label": "button-close-modal" }}
    >
      {SummaryPage}
    </Modal>
  );
};
