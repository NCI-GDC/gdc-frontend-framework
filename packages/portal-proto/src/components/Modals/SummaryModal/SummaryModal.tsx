import { SummaryHeaderProps } from "@/components/Summary/SummaryHeader";
import { TypeIcon } from "@/components/TypeIcon";
import { CaseSummary } from "@/features/cases/CaseSummary";
import { ContextualFileView } from "@/features/files/FileSummary";
import { entityMetadataType } from "@/features/layout/UserFlowVariedPages";
import { ProjectSummary } from "@/features/projects/ProjectSummary";
import { Modal } from "@mantine/core";
import React from "react";

export const SummaryModalHeader = ({
  iconText,
  headerTitle,
}: SummaryHeaderProps): JSX.Element => {
  return (
    <header className="flex justify-center items-center mb-2">
      <div className="rounded-full flex flex-row items-center p-1 px-2">
        <TypeIcon iconText={iconText} />
      </div>
      <span className="text-2xl text-accent uppercase tracking-wide font-medium">
        {headerTitle}
      </span>
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
  const renderChild =
    entityMetadata.entity_type === "project" ? (
      <ProjectSummary projectId={entityMetadata.entity_id} isModal={true} />
    ) : entityMetadata.entity_type === "case" ? (
      <CaseSummary
        case_id={entityMetadata.entity_id}
        bio_id=""
        isModal={true}
      />
    ) : (
      <ContextualFileView
        setCurrentFile={entityMetadata.entity_id}
        isModal={true}
      />
    );

  const HeaderTitle =
    entityMetadata.entity_type === "project" ? (
      <SummaryModalHeader
        iconText="pr"
        headerTitle={entityMetadata.entity_name}
      />
    ) : entityMetadata.entity_type === "case" ? (
      <SummaryModalHeader
        iconText="ca"
        headerTitle={entityMetadata.entity_name}
      />
    ) : (
      <SummaryModalHeader
        iconText="fl"
        headerTitle={entityMetadata.entity_name}
      />
    );

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="calc(100vw - 100px)"
      withinPortal={false}
      zIndex={300}
      overflow="inside"
      classNames={{
        modal: "mt-0 mx-0 px-4",
        header: "mb-0 bg-base-max shadow-lg",
        close: "text-base-darkest [&_svg]:h-12 [&_svg]:w-12 mr-2 mb-2",
      }}
      title={HeaderTitle}
      overlayOpacity={0.3}
    >
      {renderChild}
    </Modal>
  );
};
