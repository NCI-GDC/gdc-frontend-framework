import { NextPage } from "next";
import {
  Button,
  LinePlaceholer,
  UserFlowVariedPages,
} from "../../../features/layout/UserFlowVariedPages";
import Link from "next/link";
import Image from "next/image";
import {
  fetchProjects,
  Project,
  selectProjectsState,
  useCoreDispatch,
  useCoreSelector,
} from "@gff/core";
import { useEffect } from "react";

interface UseProjectsResponse {
  readonly data?: ReadonlyArray<Project>;
  readonly error?: string;
  readonly isUninitialized: boolean;
  readonly isFetching: boolean;
  readonly isSuccess: boolean;
  readonly isError: boolean;
}

const useProjects = (): UseProjectsResponse => {
  const coreDispatch = useCoreDispatch();
  const { projects, status, error } = useCoreSelector(selectProjectsState);

  useEffect(() => {
    if (!projects || Object.keys(projects).length == 0) {
      coreDispatch(fetchProjects());
    }
  }, [coreDispatch, projects]);

  return {
    data: Object.values(projects),
    error: error,
    isUninitialized: projects === undefined || projects == {},
    isFetching: status === "pending",
    isSuccess: status === "fulfilled",
    isError: status === "rejected",
  };
};

const StudiesPage: NextPage = () => {
  const { data, error, isUninitialized, isFetching, isError } = useProjects();

  if (isUninitialized) {
    return <div>Initializing projects...</div>;
  }

  if (isFetching) {
    return <div>Fetching projects...</div>;
  }

  if (isError) {
    return <div>Failed to fetch projects: {error}</div>;
  }

  const headerElements = [
    <Link key="Home" href="/">
      Home
    </Link>,
    "Studies",
    <Link key="Analysis" href="/user-flow/most-pages/analysis">
      Analysis
    </Link>,
    <Link key="Repository" href="/user-flow/most-pages/repository">
      Repository
    </Link>,
  ];

  return (
    <UserFlowVariedPages {...{ headerElements }}>
      <div className="flex flex-col p-4 gap-y-4">
        <div>
          <Search />
        </div>
        <div className="flex flex-row justify-end">
          <ExploreStudies />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {data.map((project) => (
            <Study name={project.projectId} key={project.projectId} />
          ))}
        </div>
      </div>
    </UserFlowVariedPages>
  );
};

const Search = () => {
  return (
    <div className="flex flex-row justify-center">
      <div className="sm:w-1/2  rounded-full border border-gray-600 flex flex-row pr-4">
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

const ExploreStudies = () => {
  return <Button>Explore Studies</Button>;
};

interface StudyProps {
  readonly name?: string;
}

const Study: React.FC<StudyProps> = ({ name }: StudyProps) => {
  return (
    <div className="flex flex-col border border-gray-500 px-4 pt-2 pb-4 w-full h-52 gap-y-2">
      <div className="flex-none text-center">
        {name ? name : <LinePlaceholer length={6} />}
      </div>
      <div className="flex-grow">
        <Card />
      </div>
    </div>
  );
};

export default StudiesPage;

const Card = () => {
  // styles for the SVG X from https://stackoverflow.com/a/56557106
  const color = "gray";
  return (
    <div
      className="h-full w-full border border-gray-500"
      style={{
        background: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' preserveAspectRatio='none' viewBox='0 0 100 100'><line x1='0' y1='0' x2='100' y2='100' stroke='${color}' vector-effect='non-scaling-stroke'/><line x1='0' y1='100' x2='100' y2='0' stroke='${color}' vector-effect='non-scaling-stroke'/></svg>")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundSize: "100% 100%, auto",
      }}
    ></div>
  );
};
