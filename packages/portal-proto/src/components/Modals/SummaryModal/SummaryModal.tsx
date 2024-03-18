import { CaseSummary } from "@/features/cases/CaseSummary";
import { ContextualFileView } from "@/features/files/FileSummary";
import { GeneSummary } from "@/features/GeneSummary/GeneSummary";
import { SSMSSummary } from "@/features/mutationSummary/SSMSSummary";
import { ProjectSummary } from "@/features/projects/ProjectSummary";
import { focusStyles } from "@/utils/index";
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

  useEffect(() => {
    setOpened(opened);
  }, [opened]);

  const { SummaryPage, title } =
    entity_type === "project"
      ? {
          SummaryPage: <ProjectSummary projectId={entity_id} isModal={true} />,
          title: "Project",
        }
      : entity_type === "case"
      ? {
          SummaryPage: <CaseSummary case_id={entity_id} isModal={true} />,
          title: "Case",
        }
      : entity_type === "file"
      ? {
          SummaryPage: (
            <ContextualFileView setCurrentFile={entity_id} isModal={true} />
          ),
          title: "File",
        }
      : entity_type === "ssms"
      ? {
          SummaryPage: <SSMSSummary ssm_id={entity_id} isModal={true} />,
          title: "Mutation",
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
          title: "Gene",
        };

  return (
    <Modal
      opened={modalOpened}
      onClose={onClose}
      size="calc(100vw - 100px)"
      withinPortal={false}
      title={`${title} summary modal`}
      zIndex={300}
      classNames={{
        header: "m-0 p-0 border-0",
        title: "sr-only",
        close: `absolute right-5 top-6 text-base-darkest [&_svg]:h-14 [&_svg]:w-14 float-right z-30 ${focusStyles}`,
      }}
      padding={0}
      overlayProps={{ opacity: 0.5 }}
    >
      {SummaryPage}
    </Modal>
  );
};
