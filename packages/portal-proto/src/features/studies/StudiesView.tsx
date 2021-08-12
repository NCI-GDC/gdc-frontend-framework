import { PropsWithChildren } from "react";
import Select from "react-select";
import { useProjects } from "@gff/core";
import { Search, Studies } from "../user-flow/common";

export interface Project {
  readonly projectId: string;
}

export interface ContextualStudiesViewProps {
  // TODO setView will eventually be replaced with an action to update the context
  readonly setView: (string) => void;
}
export const ContextualStudiesView: React.FC<ContextualStudiesViewProps> = (
  props: ContextualStudiesViewProps,
) => {
  const { data } = useProjects();

  return <StudiesView projects={data} setView={props.setView} />;
};

export interface StudiesViewProps {
  readonly projects: ReadonlyArray<Project>;
  readonly setView: (string) => void;
}

export const StudiesView: React.FC<StudiesViewProps> = ({
  projects,
  setView,
}: PropsWithChildren<StudiesViewProps>) => {
  const projectIds = projects.map((p) => p.projectId);

  const filter1Options = [
    {
      value: "one",
      label: "One",
    },
    { value: "two", label: "Two" },
  ];
  const filter1 = (
    <Select inputId="studies-view__filter-1" options={filter1Options} />
  );

  const filter2Options = [
    {
      value: "red",
      label: "Red",
    },
    { value: "blue", label: "Blue" },
  ];
  const filter2 = (
    <Select inputId="studies-view__filter-2" options={filter2Options} />
  );

  const filter3Options = [
    {
      value: "cat",
      label: "Cat",
    },
    { value: "dog", label: "Dog" },
  ];
  const filter3 = (
    <Select inputId="studies-view__filter-3" options={filter3Options} />
  );

  const sortOptions = [
    { value: "a-z", label: "Sort: A-Z" },
    { value: "z-a", label: "Sort: Z-A" },
  ];
  const sortFilter = (
    <Select inputId="studies-view__sort" options={sortOptions} />
  );

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-row">
        <button className="absolute" onClick={() => setView("appSelector")}>
          &lt; All Apps
        </button>
        <div className="flex-grow text-center">Cohorts</div>
      </div>
      <div>
        <Search />
      </div>
      <div className="flex flex-row gap-x-4">
        <div className="w-40">{filter1}</div>
        <div className="w-40">{filter2}</div>
        <div className="w-40">{filter3}</div>
        <div className="flex-grow" />
        <div className="w-40">{sortFilter}</div>
      </div>
      <div className="flex-grow">
        <Studies
          projectIds={projectIds}
          onClickStudy={() => setView("study-view")}
        />
      </div>
    </div>
  );
};
