import {
  useGetProjectsQuery,
  useAnnotations,
  AnnotationDefaults,
  ProjectDefaults,
  useFilesFacetsByNameFilter,
} from "@gff/core";
import SummaryCount from "../../components/Summary/SummaryCount";
import { FaUser, FaFile, FaEdit } from "react-icons/fa";
import { SummaryHeader } from "@/components/Summary/SummaryHeader";
import { SummaryCard } from "@/components/Summary/SummaryCard";
import { Button, LoadingOverlay, Menu, Tooltip } from "@mantine/core";
import { MdFileDownload } from "react-icons/md";
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
  PercentBar,
  PercentBarComplete,
  PercentBarLabel,
} from "../shared/tailwindComponents";

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
  return (
    <>
      <SummaryHeader
        iconText="pr"
        headerTitle={projectData.project_id}
        isModal={projectData.isModal}
      />

      <div
        className={`flex flex-col mx-auto ${
          projectData.isModal ? "mt-4" : "mt-20"
        } w-10/12`}
      >
        <div className="flex flex-col gap-5">
          <div className="self-end flex gap-3">
            <Menu width="target">
              <Menu.Target>
                <Button
                  variant="outline"
                  className="px-1.5 min-h-7 w-34 text-primary border-primary border rounded"
                  leftIcon={<MdFileDownload size="1.25em" />}
                >
                  Biospecimen
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item icon={<MdFileDownload size="1.25em" />}>
                  TSV (Coming soon)
                </Menu.Item>
                <Menu.Item icon={<MdFileDownload size="1.25em" />}>
                  JSON (Coming soon)
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
            <Menu width="target">
              <Menu.Target>
                <Button
                  variant="outline"
                  className="px-1.5 min-h-7 w-26 text-primary border-primary border rounded"
                  leftIcon={<MdFileDownload size="1.25em" />}
                >
                  Clinical
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item icon={<MdFileDownload size="1.25em" />}>
                  TSV (Coming soon)
                </Menu.Item>
                <Menu.Item icon={<MdFileDownload size="1.25em" />}>
                  JSON (Coming soon)
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
            <Tooltip
              transition="fade"
              transitionDuration={200}
              width={220}
              label="Download a manifest for use with the GDC Data Transfer Tool. The GDC
Data Transfer Tool is recommended for transferring large volumes of data."
              arrowSize={10}
              multiline
              withArrow
            >
              <Button
                variant="outline"
                leftIcon={<MdFileDownload size="1.25em" />}
                className="text-primary border-primary"
              >
                Manifest
              </Button>
            </Tooltip>
          </div>
          <div className="flex gap-4">
            <div className="w-10/12">
              <SummaryCard
                message={
                  projectData.hasControlledAccess ? (
                    <>
                      The project has controlled access data which requires
                      dbGaP Access. See instructions for{" "}
                      <a
                        href="https://gdc.cancer.gov/access-data/obtaining-access-controlled-data"
                        className="text-utility-link underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Obtaining Access to Controlled Data.
                      </a>
                    </>
                  ) : null
                }
                tableData={formatDataForSummary()}
              />
            </div>
            <div className="w-2/12">
              <SummaryCount
                title={"Cases"}
                count={projectData.summary?.case_count.toLocaleString()}
                Icon={FaUser}
              />

              <SummaryCount
                title={"Files"}
                count={projectData.summary?.file_count.toLocaleString()}
                Icon={FaFile}
              />

              <SummaryCount
                title={"Annotations"}
                count={projectData.annotation?.count.toLocaleString()}
                Icon={FaEdit}
                href={getAnnotationsLinkParams()}
                shouldOpenInNewTab
              />
            </div>
          </div>

          {(projectData?.summary?.data_categories ||
            projectData?.summary?.experimental_strategies) && (
            <div className="flex gap-4 mt-4 mb-14">
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
        </div>
      </div>
    </>
  );
};
