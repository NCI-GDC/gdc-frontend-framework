import { PropsWithChildren } from "react";
import Image from "next/image";
import { Project } from "@gff/core";
import { App } from "../layout/UserFlowVariedPages";

export interface StudyProps {
  readonly project: Project;
  readonly onClick: () => void;
}

export const Study: React.FC<StudyProps> = (props: StudyProps) => {
  const { projectId } = props.project;
  const { onClick } = props;

  return <App name={projectId} onClick={onClick} />;
};

export const Search: React.FC<unknown> = () => {
  return (
    <div className="flex flex-row justify-center">
      <div className="sm:w-1/2  rounded-full border border-gray-600 flex flex-row pr-4 bg-white">
        <div className="flex flex-none fill-current text-black align-text-bottom pl-2">
          <Image src="/Search_Icon.svg" width={16} height={16} />
        </div>
        <input
          type="text"
          placeholder="search"
          className="flex-grow form-input pl-2 pr-0 border-none h-6 focus:ring-0"
        />
      </div>
    </div>
  );
};

export interface StudiesProps {
  readonly projects?: ReadonlyArray<Project>;
  readonly onClickStudy?: (string) => void;
}

export const Studies: React.FC<StudiesProps> = ({
  projects,
  onClickStudy = () => {
    return;
  },
}: PropsWithChildren<StudiesProps>) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
      {projects?.map((project) => (
        <Study
          project={project}
          key={project.projectId}
          onClick={() => onClickStudy(project.projectId)}
        />
      ))}
    </div>
  );
};
