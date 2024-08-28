import React from "react";
import { AnnotationDefaults, GdcApiData, ProjectDefaults } from "@gff/core";
import { FaUser, FaFile, FaEdit } from "react-icons/fa";
import { SummaryHeader } from "@/components/Summary/SummaryHeader";
import CategoryTableSummary from "@/components/Summary/CategoryTableSummary";
import { HeaderTitle } from "@/components/tailwindComponents";
import { HorizontalTable } from "@/components/HorizontalTable";
import { SingularOrPluralSpan } from "@/components/SingularOrPluralSpan/SingularOrPluralSpan";
import PrimarySiteTable from "./PrimarySiteTable";
import {
  formatDataForDataCategoryTable,
  formatDataForExpCategoryTable,
  formatDataForSummary,
} from "./utils";
import AnnotationsTable from "./AnnotationsTable";
import ProjectsIcon from "public/user-flow/icons/summary/projects.svg";
import useScrollToHash from "@/hooks/useScrollToHash";
import { useViewportSize } from "@mantine/hooks";
import { LG_BREAKPOINT } from "../cases/utils";
import SummaryHeaderLeft from "./SummaryHeaderLeft";

export interface ProjectViewProps extends ProjectDefaults {
  readonly annotation: GdcApiData<AnnotationDefaults>;
  hasControlledAccess: boolean;
  isModal?: boolean;
}

export const ProjectView: React.FC<ProjectViewProps> = (
  projectData: ProjectViewProps,
) => {
  const { width } = useViewportSize();
  useScrollToHash(["annotations"]);

  const Cases = (
    <span className="flex items-center gap-1">
      <FaUser />

      <SingularOrPluralSpan
        customDataTestID="text-case-count-project-summary"
        count={projectData.summary?.case_count}
        title="Case"
      />
    </span>
  );

  const Files = (
    <span className="flex items-center gap-1">
      <FaFile />

      <SingularOrPluralSpan
        customDataTestID="text-file-count-project-summary"
        count={projectData.summary?.file_count}
        title="File"
      />
    </span>
  );

  const Annotations = (
    <span className="flex items-center gap-1">
      <FaEdit />
      {projectData.annotation.pagination.total > 0 ? (
        <a
          data-testid="text-annotation-count-project-summary"
          href="#annotations"
          className="underline font-bold"
        >
          {projectData.annotation.pagination.total.toLocaleString()}
        </a>
      ) : (
        <span
          data-testid="text-annotation-count-project-summary"
          className="font-bold"
        >
          {projectData.annotation.pagination.total.toLocaleString()}
        </span>
      )}
      {projectData.annotation.pagination.total == 1
        ? "Annotation"
        : "Annotations"}
    </span>
  );

  const message = projectData.hasControlledAccess ? (
    <p className="font-content">
      The project has controlled access data which requires dbGaP Access. See
      instructions for{" "}
      <a
        data-testid="link-obtaining-access-to-controlled-data"
        href="https://gdc.cancer.gov/access-data/obtaining-access-controlled-data"
        className="text-utility-link underline"
        target="_blank"
        rel="noreferrer"
      >
        Obtaining Access to Controlled Data.
      </a>
    </p>
  ) : null;

  const summaryData = formatDataForSummary(projectData);
  const [leftColumnData, rightColumnData] = [
    summaryData.slice(0, summaryData.length === 4 ? 2 : 3),
    summaryData.slice(summaryData.length === 4 ? 2 : 3),
  ];

  return (
    <>
      <SummaryHeader
        Icon={ProjectsIcon}
        headerTitleLeft="Project"
        headerTitle={projectData.project_id}
        isModal={projectData.isModal}
        leftElement={<SummaryHeaderLeft projectData={projectData} />}
        rightElement={
          <div className="flex items-center gap-2 text-sm md:text-xl xl:text-sm 2xl:text-xl text-base-lightest leading-4 font-montserrat uppercase whitespace-no-wrap">
            Total of {Cases} {Files} {Annotations}
          </div>
        }
      />

      <div className={`${!projectData?.isModal ? "mt-6" : "mt-4"} mx-4`}>
        <div className="flex flex-col lg:flex-row lg:justify-between">
          <HeaderTitle>Summary</HeaderTitle>
          {message && <div className="text-sm lg:text-right">{message}</div>}
        </div>
        <div data-testid="table-summary-project-summary" className="flex mt-2">
          <div className="basis-full lg:basis-1/2">
            <HorizontalTable
              tableData={width >= LG_BREAKPOINT ? leftColumnData : summaryData}
            />
          </div>
          {width >= LG_BREAKPOINT && (
            <div className="basis-1/2 h-full">
              <HorizontalTable tableData={rightColumnData} />
            </div>
          )}
        </div>

        {(projectData?.summary?.data_categories ||
          projectData?.summary?.experimental_strategies) && (
          <div className="flex flex-col lg:flex-row gap-8 mt-8">
            {projectData?.summary?.data_categories && (
              <CategoryTableSummary
                customDataTestID="table-data-category-project-summary"
                title="Cases and File Counts by Data Category"
                {...formatDataForDataCategoryTable(projectData)}
              />
            )}
            {projectData?.summary?.experimental_strategies && (
              <CategoryTableSummary
                customDataTestID="table-experimental-strategy-project-summary"
                title="Cases and File Counts by Experimental Strategy"
                {...formatDataForExpCategoryTable(projectData)}
              />
            )}
          </div>
        )}
        {projectData?.primary_site?.length > 1 && (
          <div
            className={`mt-8 ${
              projectData?.annotation?.pagination.count === 0 ? "mb-16" : ""
            }`}
          >
            <PrimarySiteTable
              projectId={projectData?.project_id}
              primarySites={projectData?.primary_site}
            />
          </div>
        )}
        {projectData?.annotation?.pagination.count > 0 && (
          <div
            className={`mt-8 mb-16 ${
              projectData.isModal ? "scroll-mt-36" : "scroll-mt-72"
            }`}
            id="annotations"
          >
            <AnnotationsTable project_id={projectData.project_id} />
          </div>
        )}
      </div>
    </>
  );
};
