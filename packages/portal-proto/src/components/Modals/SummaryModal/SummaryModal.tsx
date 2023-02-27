import {
  SummaryHeaderIcon,
  SummaryHeaderProps,
} from "@/components/Summary/SummaryHeader";
import { TypeIcon } from "@/components/TypeIcon";
import { CaseSummary } from "@/features/cases/CaseSummary";
import { ContextualFileView } from "@/features/files/FileSummary";
import { SSMSSummary } from "@/features/mutationSummary/SSMSSummary";
import { ProjectSummary } from "@/features/projects/ProjectSummary";
import { SummaryHeaderTitle } from "@/features/shared/tailwindComponents";
import { Modal } from "@mantine/core";
import React, { useContext, useEffect, useState } from "react";
import { entityMetadataType, URLContext } from "src/utils/contexts";

export const SummaryModalHeader = ({
  iconText,
  headerTitle,
}: SummaryHeaderProps): JSX.Element => {
  return (
    <header className="flex items-center gap-4">
      <SummaryHeaderIcon iconText={iconText} />
      <SummaryHeaderTitle>{headerTitle}</SummaryHeaderTitle>
    </header>
  );
};

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
  const { entity_type, entity_id, entity_name } = entityMetadata;
  useEffect(() => {
    if (prevPath !== currentPath) {
      setOpened(false);
      onClose();
    }
  }, [prevPath, currentPath, onClose]);

  const { SummaryPage, HeaderTitle } =
    entity_type === "project"
      ? {
          SummaryPage: <ProjectSummary projectId={entity_id} isModal={true} />,
          HeaderTitle: (
            <SummaryModalHeader iconText="pr" headerTitle={entity_name} />
          ),
        }
      : entity_type === "case"
      ? {
          SummaryPage: (
            <CaseSummary case_id={entity_id} bio_id="" isModal={true} />
          ),
          HeaderTitle: (
            <SummaryModalHeader iconText="ca" headerTitle={entity_name} />
          ),
        }
      : entity_type === "file"
      ? {
          SummaryPage: (
            <ContextualFileView setCurrentFile={entity_id} isModal={true} />
          ),
          HeaderTitle: (
            <SummaryModalHeader iconText="fl" headerTitle={entity_name} />
          ),
        }
      : {
          SummaryPage: <SSMSSummary ssm_id={entity_id} isModal={true} />,
          HeaderTitle: (
            <SummaryModalHeader iconText="mu" headerTitle={entity_name} />
          ),
        };
  return (
    <Modal
      opened={modalOpened}
      onClose={onClose}
      size="calc(100vw - 100px)"
      withinPortal={false}
      zIndex={300}
      overflow="inside"
      classNames={{
        modal: "mt-0 mx-0 px-4",
        header:
          "mb-0 mx-0 bg-primary-vivid shadow-lg border-0 font-bold rounded-sm",
        close: "text-base-darkest [&_svg]:h-12 [&_svg]:w-12 mr-2 mb-2",
      }}
      padding={0}
      title={HeaderTitle}
      overlayOpacity={0.3}
    >
      {SummaryPage}
    </Modal>
  );
};
