import { useProjects, useAnnotations } from "@gff/core";
import SummaryCount from "../../components/Summary/SummaryCount";
import { HorizontalTableProps } from "../../components/HorizontalTable";
import { FaUser, FaFile, FaEdit, FaTable } from "react-icons/fa";
import { get } from "lodash";
import { SummaryHeader } from "@/components/Summary/SummaryHeader";
import { SummaryCard } from "@/components/Summary/SummaryCard";

export interface ContextualProjectViewProps {
  readonly setCurrentProject: string;
}

export const ContextualProjectView: React.FC<ContextualProjectViewProps> = (
  props: ContextualProjectViewProps,
) => {
  const projectData = useProjects({
    filters: {
      op: "=",
      content: {
        field: "project_id",
        value: props.setCurrentProject,
      },
    },
    expand: [
      "summary",
      "summary.data_categories",
      "summary.experimental_strategies",
      "program",
    ],
  });
  const annotationCountData = useAnnotations({
    filters: {
      op: "=",
      content: {
        field: "project.project_id",
        value: props.setCurrentProject,
      },
    },
    size: 0,
  });
  const projectWithAnnotation = {
    ...projectData.data[0],
    annotationCount: annotationCountData.data.count,
  };
  return <ProjectView projectData={projectWithAnnotation} />;
};

export interface ProjectViewProps {
  readonly projectData: {
    readonly name: string;
    readonly projectId: string | number;
    readonly disease_type: Array<string>;
    readonly primary_site: Array<string>;
    readonly summary?: {
      readonly case_count: number;
      readonly file_count: number;
      readonly file_size: number;
    };
    readonly program?: {
      readonly dbgap_accession_number: string;
      readonly name: string;
      readonly program_id: string;
    };
    readonly annotationCount: number;
  };
}

export const ProjectView: React.FC<ProjectViewProps> = ({
  projectData,
}: ProjectViewProps) => {
  const formatDataForSummery = (): HorizontalTableProps["tableData"] => {
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
  return (
    <div>
      <SummaryHeader iconText="PR" headerTitle={projectData.projectId} />
      <div className="p-4">
        <div className="text-nci-gray flex">
          <div className="flex-auto">
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
              tableData={formatDataForSummery()}
            />
          </div>
          <div className="flex-initial w-1/4 max-w-xs ">
            {projectData.summary?.case_count ? (
              <SummaryCount
                title={"Cases"}
                count={projectData.summary.case_count.toLocaleString()}
                Icon={FaUser}
              />
            ) : null}
            {projectData.summary?.file_count ? (
              <SummaryCount
                title={"Files"}
                count={projectData.summary.file_count.toLocaleString()}
                Icon={FaFile}
              />
            ) : null}
            {projectData.annotationCount ? (
              <SummaryCount
                title={"Annotations"}
                count={projectData.annotationCount.toLocaleString()}
                Icon={FaEdit}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
