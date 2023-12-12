import React from "react";
import {
  useGetProjectsQuery,
  useAnnotations,
  useFilesFacetsByNameFilter,
} from "@gff/core";
import { LoadingOverlay } from "@mantine/core";
import { SummaryErrorHeader } from "@/components/Summary/SummaryErrorHeader";
import { ProjectView } from "./ProjectView";

export interface ContextualProjectViewProps {
  readonly projectId: string;
  readonly isModal?: boolean;
}

export const ProjectSummary: React.FC<ContextualProjectViewProps> = ({
  projectId,
  isModal = false,
}: ContextualProjectViewProps) => {
  const { data: projectsData, isFetching: isProjectFetching } =
    useGetProjectsQuery({
      filters: {
        op: "=",
        content: {
          field: "project_id",
          value: projectId,
        },
      },
      expand: [
        "summary",
        "summary.data_categories",
        "summary.experimental_strategies",
        "program",
      ],
    });
  const { data: annotationCountData, isFetching: isAnnotationFetching } =
    useAnnotations({
      filters: {
        op: "=",
        content: {
          field: "project.project_id",
          value: projectId,
        },
      },
    });

  const { data: filesFacetData, isFetching: isFileFetching } =
    useFilesFacetsByNameFilter({
      facetName: "access",
      filters: {
        op: "and",
        content: [
          {
            op: "=",
            content: {
              field: "files.cases.project.project_id",
              value: projectId,
            },
          },
        ],
      },
      filterType: "files",
    });

  const hasControlledAccess =
    Object.keys(filesFacetData).length > 0 &&
    Object.keys(filesFacetData?.access).some(
      (bucket) => bucket === "controlled" && filesFacetData?.access[bucket] > 0,
    );

  const projectData =
    projectsData?.projectData && projectsData?.projectData.length > 0
      ? projectsData?.projectData[0]
      : undefined;
  const projectWithAnnotation = {
    ...projectData,
    annotation: annotationCountData,
    hasControlledAccess,
    isModal,
  };

  return (
    <>
      {isProjectFetching || isAnnotationFetching || isFileFetching ? (
        <LoadingOverlay visible data-testid="loading-spinner" />
      ) : projectData && Object.keys(projectData).length > 0 ? (
        <ProjectView {...projectWithAnnotation} />
      ) : (
        <SummaryErrorHeader label="Project Not Found" />
      )}
    </>
  );
};
