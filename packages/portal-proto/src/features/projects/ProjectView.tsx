import {
  useProjects,
  useAnnotations,
  AnnotationDefaults,
  ProjectDefaults,
} from "@gff/core";
import SummaryCount from "../../components/Summary/SummaryCount";
import { HorizontalTableProps } from "../../components/HorizontalTable";
import { FaUser, FaFile, FaEdit, FaTable } from "react-icons/fa";
import { get } from "lodash";
import { SummaryHeader } from "@/components/Summary/SummaryHeader";
import { SummaryCard } from "@/components/Summary/SummaryCard";
import { Button, Menu, Tooltip } from "@mantine/core";
import { MdFileDownload } from "react-icons/md";
import { TempTable } from "../files/FileView";
import {
  calculatePercentage,
  numberWithCommas,
  sortByPropertyAsc,
} from "src/utils";

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
  return <ProjectView {...projectWithAnnotation} />;
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
  console.log(projectData);
  const formatDataForSummary = (): HorizontalTableProps["tableData"] => {
    //Headers for table
    const headersConfig = [
      {
        field: "projectId",
        name: "Project ID",
      },
      {
        field: "program.dbgap_accession_number",
        name: "dbGaP Study Accession",
      },
      {
        field: "name",
        name: "Project Name",
      },
      {
        field: "disease_type",
        name: "Disease Type",
      },
      {
        field: "primary_site",
        name: "Primary Site",
      },
      {
        field: "program.name",
        name: "Program",
      },
    ];
    //match headers with available properties
    return headersConfig.reduce((output, obj) => {
      const value = get(projectData, obj.field);
      if (value) {
        output.push({
          headerName: obj.name,
          values: [value],
        });
      }
      return output;
    }, []);
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
      case_count: `${data_c.case_count} (${calculatePercentage(
        data_c.case_count,
        projectData.summary.case_count,
      )}%)`,
      file_count: `${data_c.file_count} (${calculatePercentage(
        data_c.file_count,
        projectData.summary.file_count,
      )}%)`,
    }));

    return {
      headers: [
        "Data Category",
        `Cases (n=${numberWithCommas(projectData.summary.case_count)})`,
        `Files (n=${numberWithCommas(projectData.summary.file_count)})`,
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
      case_count: `${exp_c.case_count} (${calculatePercentage(
        exp_c.case_count,
        projectData.summary.case_count,
      )}%)`,
      file_count: `${exp_c.file_count} (${calculatePercentage(
        exp_c.file_count,
        projectData.summary.file_count,
      )}%)`,
    }));

    return {
      headers: [
        "Experimental Strategy",
        `Cases (n=${numberWithCommas(projectData.summary.case_count)})`,
        `Files (n=${numberWithCommas(projectData.summary.file_count)})`,
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
              // multiline
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

          <div className="flex gap-4 mt-4">
            <div className="flex-1">
              <div className="bg-white text-nci-gray p-2">
                <h2 className="text-lg font-medium">
                  Cases and File Counts by Data Category
                </h2>
                {!projectData?.summary?.data_categories && (
                  <span className="block text-center text-sm pt-4">
                    No results found
                  </span>
                )}
              </div>
              {projectData?.summary?.data_categories ? (
                <TempTable tableData={formatDataForDataCateogryTable()} />
              ) : null}
            </div>
            <div className="flex-1">
              <div className="bg-white text-nci-gray p-2">
                <h2 className="text-lg font-medium">
                  Cases and File Counts by Experimental Strategy
                </h2>
                {!projectData?.summary?.experimental_strategies && (
                  <span className="block text-center text-sm pt-4">
                    No results found
                  </span>
                )}
              </div>
              {projectData?.summary?.experimental_strategies ? (
                <TempTable tableData={formatDataForExpCateogryTable()} />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
