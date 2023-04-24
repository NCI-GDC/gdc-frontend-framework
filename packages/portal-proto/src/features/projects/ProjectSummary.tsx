import React, { useState } from "react";
import {
  useGetProjectsQuery,
  useAnnotations,
  AnnotationDefaults,
  ProjectDefaults,
  useFilesFacetsByNameFilter,
  useCoreDispatch,
  FilterSet,
  useCoreSelector,
  selectAvailableCohorts,
  addNewCohortWithFilterAndMessage,
} from "@gff/core";
import { FaUser, FaFile, FaEdit } from "react-icons/fa";
import { FiDownload as DownloadIcon } from "react-icons/fi";
import { SummaryHeader } from "@/components/Summary/SummaryHeader";
import { Button, Loader, LoadingOverlay, Tooltip } from "@mantine/core";
import {
  calculatePercentageAsNumber,
  humanify,
  sortByPropertyAsc,
} from "src/utils";
import { SummaryErrorHeader } from "@/components/Summary/SummaryErrorHeader";
import { formatDataForHorizontalTable } from "../files/utils";
import Link from "next/link";
import { CollapsibleList } from "@/components/CollapsibleList";
import { CategoryTableSummary } from "@/components/Summary/CategoryTableSummary";
import {
  HeaderTitle,
  PercentBar,
  PercentBarComplete,
  PercentBarLabel,
} from "../shared/tailwindComponents";
import { DropdownWithIcon } from "@/components/DropdownWithIcon/DropdownWithIcon";
import { HorizontalTable } from "@/components/HorizontalTable";
import { SingularOrPluralSpan } from "@/components/SingularOrPluralSpan/SingularOrPluralSpan";
import { SaveOrCreateCohortModal } from "@/components/Modals/SaveOrCreateCohortModal";
import download from "src/utils/download";
import PrimarySiteTable from "./PrimarySiteTable";

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
        <LoadingOverlay visible data-testid="loading" />
      ) : projectData && Object.keys(projectData).length > 0 ? (
        <ProjectView {...projectWithAnnotation} />
      ) : (
        <SummaryErrorHeader label="Project Not Found" />
      )}
    </>
  );
};

export interface ProjectViewProps extends ProjectDefaults {
  readonly annotation: {
    list: AnnotationDefaults[];
    count: number;
  };
  hasControlledAccess: boolean;
  isModal?: boolean;
}

export const ProjectView: React.FC<ProjectViewProps> = (
  projectData: ProjectViewProps,
) => {
  const dispatch = useCoreDispatch();
  const [manifestDownloadActive, setManifestDownloadActive] = useState(false);
  const [showCreateCohort, setShowCreateCohort] = useState(false);
  const cohorts = useCoreSelector((state) => selectAvailableCohorts(state));

  const createCohortFromProjects = (name: string) => {
    const filters: FilterSet = {
      mode: "and",
      root: {
        "cases.project.project_id": {
          operator: "includes",
          field: "cases.project.project_id",
          operands: [projectData.project_id],
        },
      },
    };
    dispatch(
      addNewCohortWithFilterAndMessage({
        filters: filters,
        name,
        message: "newProjectsCohort",
      }),
    );
  };

  const onNameChange = (name: string) =>
    cohorts.every((cohort) => cohort.name !== name);

  const formatDataForSummary = () => {
    const {
      project_id,
      program: {
        name: program,
        dbgap_accession_number: program_dbgap_accession_number,
      },
      primary_site,
      dbgap_accession_number,
      disease_type,
      name: project_name,
    } = projectData || {};

    const dbGaP_study_accession =
      program_dbgap_accession_number || dbgap_accession_number;

    const projectSummaryObj: Record<string, any> = {
      project_id,
      dbGaP_study_accession: (
        <Link
          href={`https://www.ncbi.nlm.nih.gov/projects/gap/cgi-bin/study.cgi?study_id=${dbGaP_study_accession}`}
          passHref
        >
          <a className="underline text-utility-link" target="_blank">
            {dbGaP_study_accession}
          </a>
        </Link>
      ),
      project_name,
      ...(primary_site.length <= 1 &&
        disease_type.length > 0 && {
          disease_type:
            disease_type.length > 1 ? (
              <CollapsibleList
                data={disease_type.slice(0).sort()}
                limit={0}
                expandText={`${disease_type.length} Disease Types`}
                collapseText="collapse"
                customUlStyle="pl-3"
                customLiStyle="list-disc"
                customToggleTextStyle="not-italic"
              />
            ) : (
              disease_type
            ),
        }),
      ...(primary_site.length === 1 && { primary_site }),
      program,
    };

    const headersConfig = Object.keys(projectSummaryObj).map((key) => ({
      field: key,
      name: humanify({ term: key }),
    }));

    return formatDataForHorizontalTable(projectSummaryObj, headersConfig);
  };

  const getAnnotationsLinkParams = () => {
    if (projectData.annotation.count === 0) return null;

    if (projectData.annotation.count === 1) {
      return `https://portal.gdc.cancer.gov/annotations/${projectData.annotation.list[0].annotation_id}`;
    }
    return `https://portal.gdc.cancer.gov/annotations?filters={"content":[{"content":{"field":"annotations.project.project_id","value":["${projectData.project_id}"]},"op":"in"}],"op":"and"}`;
  };

  const formatDataForDataCategoryTable = () => {
    const sortedDataCategories = sortByPropertyAsc(
      projectData.summary.data_categories,
      "data_category",
    );

    const rows = sortedDataCategories.map((data_c) => {
      const caseCountPercentage = calculatePercentageAsNumber(
        data_c.case_count,
        projectData.summary.case_count,
      );

      const fileCountPercentage = calculatePercentageAsNumber(
        data_c.file_count,
        projectData.summary.file_count,
      );

      return {
        data_category: data_c.data_category,
        // TODO: Need to change it to Link after the href has been finalized
        case_count: (
          <div className="flex">
            <div className="basis-1/3 text-right">
              {data_c.case_count.toLocaleString()}
            </div>
            <div className="basis-2/3 pl-1">
              <PercentBar>
                <PercentBarLabel>{`${caseCountPercentage.toFixed(
                  2,
                )}%`}</PercentBarLabel>
                <PercentBarComplete
                  style={{ width: `${caseCountPercentage}%` }}
                />
              </PercentBar>
            </div>
          </div>
        ),
        // TODO: Need to change it to Link after the href has been finalized
        file_count: (
          <div className="flex">
            <div className="basis-1/3 text-right">
              {data_c.file_count.toLocaleString()}
            </div>
            <div className="basis-2/3 pl-1">
              <PercentBar>
                <PercentBarLabel>{`${fileCountPercentage.toFixed(
                  2,
                )}%`}</PercentBarLabel>
                <PercentBarComplete
                  style={{ width: `${fileCountPercentage}%` }}
                />
              </PercentBar>
            </div>
          </div>
        ),
      };
    });

    return {
      headers: [
        <div key="project_summary_data_table_data_category">Data Category</div>,
        <div key="project_summary_data_table_cases_header" className="flex">
          <div className="basis-1/3 text-right">Cases</div>
          <div className="basis-2/3 pl-1">
            (n={projectData.summary.case_count.toLocaleString()})
          </div>
        </div>,
        <div key="project_summary_data_table_files_header" className="flex">
          <div className="basis-1/3 text-right">Files</div>
          <div className="basis-2/3 pl-1">
            (n={projectData.summary.file_count.toLocaleString()})
          </div>
        </div>,
      ],
      tableRows: rows,
    };
  };

  const formatDataForExpCategoryTable = () => {
    const sortedExpCategories = sortByPropertyAsc(
      projectData.summary.experimental_strategies,
      "experimental_strategy",
    );

    const rows = sortedExpCategories.map((exp_c) => {
      const caseCountPercentage = calculatePercentageAsNumber(
        exp_c.case_count,
        projectData.summary.case_count,
      );

      const fileCountPercentage = calculatePercentageAsNumber(
        exp_c.file_count,
        projectData.summary.file_count,
      );

      return {
        experimental_strategy: exp_c.experimental_strategy,
        // TODO: Need to change it to Link after the href has been finalized
        case_count: (
          <div className="flex">
            <div className="basis-1/3 text-right">
              {exp_c.case_count.toLocaleString()}
            </div>
            <div className="basis-2/3 pl-1">
              <PercentBar>
                <PercentBarLabel>{`${caseCountPercentage.toFixed(
                  2,
                )}%`}</PercentBarLabel>
                <PercentBarComplete
                  style={{ width: `${caseCountPercentage}%` }}
                />
              </PercentBar>
            </div>
          </div>
        ),
        // TODO: Need to change it to Link after the href has been finalized
        file_count: (
          <div className="flex">
            <div className="basis-1/3 text-right">
              {exp_c.file_count.toLocaleString()}
            </div>
            <div className="basis-2/3 pl-1">
              <PercentBar>
                <PercentBarLabel>{`${fileCountPercentage.toFixed(
                  2,
                )}%`}</PercentBarLabel>
                <PercentBarComplete
                  style={{ width: `${fileCountPercentage}%` }}
                />
              </PercentBar>
            </div>
          </div>
        ),
      };
    });

    return {
      headers: [
        <div key="project_summary_exp_table_data_category">
          Experimental Strategy
        </div>,
        <div key="project_summary_exp_table_cases_header" className="flex">
          <div className="basis-1/3 text-right">Cases</div>
          <div className="basis-2/3 pl-1">
            (n={projectData.summary.case_count.toLocaleString()})
          </div>
        </div>,
        <div key="project_summary_exp_table_files_header" className="flex">
          <div className="basis-1/3 text-right">Files</div>
          <div className="basis-2/3 pl-1">
            (n={projectData.summary.file_count.toLocaleString()})
          </div>
        </div>,
      ],
      tableRows: rows,
    };
  };

  const addLinkValue = () => (
    <span className="text-base-lightest">
      {getAnnotationsLinkParams() ? (
        <Link href={getAnnotationsLinkParams()} passHref>
          <a className="underline" target="_blank">
            {projectData.annotation.count.toLocaleString()}
          </a>
        </Link>
      ) : (
        projectData.annotation.count.toLocaleString()
      )}
    </span>
  );

  const Cases = (
    <span className="flex items-center gap-1">
      <div className="text-[1rem] xl:text-2xl">
        <FaUser />
      </div>

      <SingularOrPluralSpan
        count={projectData.summary?.case_count}
        title="Case"
      />
    </span>
  );

  const Files = (
    <span className="flex items-center gap-1">
      <div className="text-[1rem] xl:text-2xl">
        <FaFile />
      </div>

      <SingularOrPluralSpan
        count={projectData.summary?.file_count}
        title="File"
      />
    </span>
  );

  const Annotations = (
    <span className="flex items-center gap-1">
      <div className="text-[1rem] xl:text-2xl">
        <FaEdit />
      </div>

      <span>
        {addLinkValue()}{" "}
        {projectData.annotation.count > 1 ? "Annotations" : "Annotation"}
      </span>
    </span>
  );

  const message = projectData.hasControlledAccess ? (
    <p className="font-content">
      The project has controlled access data which requires dbGaP Access. See
      instructions for{" "}
      <a
        href="https://gdc.cancer.gov/access-data/obtaining-access-controlled-data"
        className="text-utility-link underline"
        target="_blank"
        rel="noreferrer"
      >
        Obtaining Access to Controlled Data.
      </a>
    </p>
  ) : null;

  return (
    <>
      <SummaryHeader
        iconText="pr"
        headerTitle={projectData.project_id}
        isModal={projectData.isModal}
        leftElement={
          <div className="flex gap-4">
            <Button
              color="primary"
              variant="outline"
              className="bg-base-max border-primary font-medium text-sm"
              onClick={() => setShowCreateCohort(true)}
            >
              Create New Cohort
            </Button>
            {showCreateCohort && (
              <SaveOrCreateCohortModal
                entity="cohort"
                action="create"
                opened
                onClose={() => setShowCreateCohort(false)}
                onActionClick={(newName: string) => {
                  createCohortFromProjects(newName);
                }}
                onNameChange={onNameChange}
              />
            )}
            <DropdownWithIcon
              dropdownElements={[
                {
                  title: "TSV (Coming soon)",
                  icon: <DownloadIcon size={16} aria-label="download icon" />,
                },
                {
                  title: "JSON (Coming soon)",
                  icon: <DownloadIcon size={16} aria-label="download icon" />,
                },
              ]}
              TargetButtonChildren={
                <span className="font-medium text-sm">Biospecimen</span>
              }
              LeftIcon={<DownloadIcon size="1rem" aria-label="download icon" />}
            />
            <DropdownWithIcon
              dropdownElements={[
                {
                  title: "TSV (Coming soon)",
                  icon: <DownloadIcon size={16} aria-label="download icon" />,
                },
                {
                  title: "JSON (Coming soon)",
                  icon: <DownloadIcon size={16} aria-label="download icon" />,
                },
              ]}
              TargetButtonChildren={
                <span className="font-medium text-sm">Clinical</span>
              }
              LeftIcon={<DownloadIcon size="1rem" aria-label="download icon" />}
            />
            <Tooltip
              transition="fade"
              transitionDuration={200}
              width={220}
              label="Download a manifest for use with the GDC Data Transfer Tool. The GDC
Data Transfer Tool is recommended for transferring large volumes of data."
              arrowSize={10}
              position="bottom"
              multiline
              withArrow
            >
              <Button
                variant="outline"
                leftIcon={
                  manifestDownloadActive ? (
                    <Loader size={20} />
                  ) : (
                    <DownloadIcon size="1.25em" />
                  )
                }
                className="text-primary bg-base-max border-primary hover:bg-primary-darkest hover:text-base-max"
                classNames={{ label: "font-medium text-sm" }}
                onClick={() => {
                  setManifestDownloadActive(true);
                  download({
                    endpoint: "files",
                    method: "POST",
                    options: {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                    },
                    dispatch,
                    params: {
                      filters: {
                        op: "in",
                        content: {
                          field: "cases.project.project_id",
                          value: [projectData.project_id],
                        },
                      },
                      return_type: "manifest",
                      size: 10000,
                    },
                    done: () => setManifestDownloadActive(false),
                  });
                }}
              >
                {manifestDownloadActive ? "Processing" : "Manifest"}
              </Button>
            </Tooltip>
          </div>
        }
        rightElement={
          <div className="flex items-center gap-2 text-[1rem] xl:text-2xl text-base-lightest leading-4 font-montserrat uppercase">
            Total of {Cases} {Files} {Annotations}
          </div>
        }
      />

      <div className={`mx-4 ${projectData.isModal ? "mt-4" : "mt-36"} `}>
        <div className="mt-8">
          <div className="flex justify-between gap-8">
            <HeaderTitle>Summary</HeaderTitle>
            {message && <div className="text-sm text-right">{message}</div>}
          </div>
          <div className="flex">
            <div className="basis-1/2">
              <HorizontalTable
                tableData={formatDataForSummary().slice(
                  0,
                  formatDataForSummary().length === 4 ? 2 : 3,
                )}
              />
            </div>
            <div className="basis-1/2">
              <HorizontalTable
                tableData={formatDataForSummary().slice(
                  formatDataForSummary().length === 4 ? 2 : 3,
                  formatDataForSummary().length,
                )}
              />
            </div>
          </div>

          {(projectData?.summary?.data_categories ||
            projectData?.summary?.experimental_strategies) && (
            <div className="flex gap-8 mt-8 mb-14">
              {projectData?.summary?.data_categories && (
                <CategoryTableSummary
                  title="Cases and File Counts by Data Category"
                  dataObject={projectData?.summary?.data_categories}
                  tableData={formatDataForDataCategoryTable()}
                />
              )}
              {projectData?.summary?.experimental_strategies && (
                <CategoryTableSummary
                  title="Cases and File Counts by Experimental Strategy"
                  dataObject={projectData?.summary?.experimental_strategies}
                  tableData={formatDataForExpCategoryTable()}
                />
              )}
            </div>
          )}
          {projectData?.primary_site?.length > 1 && (
            <div className="mb-16">
              <PrimarySiteTable
                projectId={projectData?.project_id}
                primarySites={projectData?.primary_site}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
