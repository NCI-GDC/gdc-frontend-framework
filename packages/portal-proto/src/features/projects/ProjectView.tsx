import { Project, useProjects, useAnnotations } from "@gff/core";
import SummaryCount from "../../components/SummaryCount";
import { FaUser, FaFile, FaEdit } from "react-icons/fa";

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
      }
    },
    expand: ['summary', 'summary.data_categories', 'summary.experimental_strategies', 'program']
  });
  const annotationCount  = useAnnotations({
      filters: {
        op: "=",
        content: {
          field: "project.project_id",
          value: props.setCurrentProject,
        }
      },
      size: 0
    });
  const projectWithAnnotation = {...projectData.data[0], ...annotationCount.data[0]};
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
    readonly annotationCount: number
  }
}

export const ProjectView: React.FC<ProjectViewProps> = ({
  projectData,
}: ProjectViewProps) => {

  return (
    <div className="text-nci-gray flex">
      <div className="flex-auto">

      </div>
      <div className="flex-initial w-1/4 max-w-xs ">
        {projectData.summary?.case_count?
          <SummaryCount
            title={'Cases'}
            count={projectData.summary.case_count.toLocaleString()}
            buttonAction={()=>{alert('Cases click')}}
            icon={<FaUser/>}
          />:null
        }
        {projectData.summary?.file_count?
          <SummaryCount
            title={'Files'}
            count={projectData.summary.file_count.toLocaleString()}
            icon={<FaFile/>}
          />:null
        }
        {projectData.annotationCount?
          <SummaryCount
            title={'Annotations'}
            count={projectData.annotationCount.toLocaleString()}
            buttonAction={()=>{alert('Annotations click')}}
            icon={<FaEdit/>}
          />:null
        }
      </div>
    </div>
  );
};
