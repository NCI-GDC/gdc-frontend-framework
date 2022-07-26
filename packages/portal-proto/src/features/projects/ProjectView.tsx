import {
  useProjects,
  useAnnotations,
  AnnotationDefaults,
  ProjectDefaults,
} from "@gff/core";
import SummaryCount from "../../components/Summary/SummaryCount";
import { HorizontalTableProps } from "../../components/HorizontalTable";
import { FaUser, FaFile, FaEdit, FaTable } from "react-icons/fa";
import { SummaryHeader } from "@/components/Summary/SummaryHeader";
import { SummaryCard } from "@/components/Summary/SummaryCard";
import { Button, LoadingOverlay, Menu, Tooltip } from "@mantine/core";
import { MdFileDownload } from "react-icons/md";
import { calculatePercentage, sortByPropertyAsc } from "src/utils";
import { SummaryErrorHeader } from "@/components/Summary/SummaryErrorHeader";
import { formatDataForHorizontalTable } from "../files/utils";
import { humanify } from "../biospecimen/utils";
import Link from "next/link";
import { CollapsibleList } from "@/components/CollapsibleList";
import { CategoryTableSummary } from "@/components/Summary/CategoryTableSummary";

export interface ContextualProjectViewProps {
  readonly projectId: string;
}

export const ContextualProjectView: React.FC<ContextualProjectViewProps> = ({
  projectId,
}: ContextualProjectViewProps) => {
  const { data: projectData, isFetching: isProjectFetching } = useProjects({
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
  const projectWithAnnotation = {
    ...projectData,
    annotation: annotationCountData,
  };

  return (
    <>
      {isProjectFetching || isAnnotationFetching ? (
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
}

export const ProjectView: React.FC<ProjectViewProps> = (
  projectData: ProjectViewProps,
) => {
  const formatDataForSummary = (): HorizontalTableProps["tableData"] => {
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
    } = projectData;

    const dbGaP_study_accession =
      program_dbgap_accession_number || dbgap_accession_number;

    const projectSummaryObj: Record<string, any> = {
      project_id,
      dbGaP_study_accession: (
        <Link
          href={`https://www.ncbi.nlm.nih.gov/projects/gap/cgi-bin/study.cgi?study_id=${dbGaP_study_accession}`}
          passHref
        >
          <a className="underline text-nci-blue" target="_blank">
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

  const formatDataForDataCateogryTable = () => {
    const sortedDataCategories = sortByPropertyAsc(
      projectData.summary.data_categories,
      "data_category",
    );

    const rows = sortedDataCategories.map((data_c) => ({
      data_category: data_c.data_category,
      // TODO: Need to change it to Link after the href has been finalized
      case_count: `${data_c.case_count} (${calculatePercentage(
        data_c.case_count,
        projectData.summary.case_count,
      )}%)`,
      // TODO: Need to change it to Link after the href has been finalized
      file_count: `${data_c.file_count} (${calculatePercentage(
        data_c.file_count,
        projectData.summary.file_count,
      )}%)`,
    }));

    return {
      headers: [
        "Data Category",
        `Cases (n=${projectData.summary.case_count.toLocaleString()})`,
        `Files (n=${projectData.summary.file_count.toLocaleString()})`,
      ],
      tableRows: rows,
    };
  };

  const formatDataForExpCateogryTable = () => {
    const sortedExpCategories = sortByPropertyAsc(
      projectData.summary.experimental_strategies,
      "experimental_strategy",
    );

    const rows = sortedExpCategories.map((exp_c) => ({
      experimental_strategy: exp_c.experimental_strategy,
      // TODO: Need to change it to Link after the href has been finalized
      case_count: `${exp_c.case_count} (${calculatePercentage(
        exp_c.case_count,
        projectData.summary.case_count,
      )}%)`,
      // TODO: Need to change it to Link after the href has been finalized
      file_count: `${exp_c.file_count} (${calculatePercentage(
        exp_c.file_count,
        projectData.summary.file_count,
      )}%)`,
    }));

    return {
      headers: [
        "Experimental Strategy",
        `Cases (n=${projectData.summary.case_count.toLocaleString()})`,
        `Files (n=${projectData.summary.file_count.toLocaleString()})`,
      ],
      tableRows: rows,
    };
  };
  return (
    <div>
      <SummaryHeader iconText="PR" headerTitle={projectData.project_id} />
      <div className="flex flex-col mx-auto mt-5 w-10/12">
        <div className="flex flex-col gap-5">
          <div className="self-end flex gap-3">
            <Menu
              control={
                <Button className="px-1.5 min-h-7 w-32 border-nci-gray-light border rounded">
                  <MdFileDownload size="1.25em" />
                  Biospecimen
                </Button>
              }
              size="xs"
            >
              <Menu.Item icon={<MdFileDownload size="1.25em" />}>TSV</Menu.Item>
              <Menu.Item icon={<MdFileDownload size="1.25em" />}>
                JSON
              </Menu.Item>
            </Menu>
            <Menu
              control={
                <Button className="px-1.5 min-h-7 w-24 border-nci-gray-light border rounded">
                  <MdFileDownload size="1.25em" />
                  Clinical
                </Button>
              }
              size="xs"
            >
              <Menu.Item icon={<MdFileDownload size="1.25em" />}>TSV</Menu.Item>
              <Menu.Item icon={<MdFileDownload size="1.25em" />}>
                JSON
              </Menu.Item>
            </Menu>
            <Tooltip
              wrapLines
              transition="fade"
              transitionDuration={200}
              width={220}
              label="Download a manifest for use with the GDC Data Transfer Tool. The GDC
Data Transfer Tool is recommended for transferring large volumes of data."
              arrowSize={10}
              withArrow
            >
              <Button
                leftIcon={<MdFileDownload size="1.25em" />}
                className="w-32"
              >
                Manifest
              </Button>
            </Tooltip>
          </div>
          <div className="flex gap-4">
            <div className="w-10/12">
              <SummaryCard
                message={
                  <>
                    The project has controlled access data which requires dbGaP
                    Access. See instructions for{" "}
                    <a
                      href="https://gdc.cancer.gov/access-data/obtaining-access-controlled-data"
                      className="text-nci-blue underline"
                    >
                      Obtaining Access to Controlled Data.
                    </a>
                  </>
                }
                Icon={FaTable}
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

          <div className="flex gap-4 mt-4 mb-8">
            <CategoryTableSummary
              title="Cases and File Counts by Data Category"
              dataObject={projectData?.summary?.data_categories}
              tableData={formatDataForDataCateogryTable()}
            />

            <CategoryTableSummary
              title="Cases and File Counts by Experimental Strategy"
              dataObject={projectData?.summary?.experimental_strategies}
              tableData={formatDataForExpCateogryTable()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
