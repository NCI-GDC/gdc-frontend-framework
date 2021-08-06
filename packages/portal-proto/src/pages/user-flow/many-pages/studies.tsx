import { NextPage } from "next";
import {
  Button,
  UserFlowVariedPages,
} from "../../../features/layout/UserFlowVariedPages";
import Link from "next/link";
import Image from "next/image";
import { useProjects } from "@gff/core";
import { useState } from "react";
import { useRouter } from "next/router";
import ReactModal from "react-modal";
import { Search, Studies } from "../../../features/user-flow/common";

const StudiesPage: NextPage = () => {
  const router = useRouter();
  const { data, error, isUninitialized, isFetching, isError } = useProjects();
  const [showModal, setShowModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState("");

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
    "Cohorts",
    <Link key="Analysis" href="/user-flow/many-pages/analysis">
      Analysis
    </Link>,
    <Link key="Repository" href="/user-flow/many-pages/repository">
      Repository
    </Link>,
  ];

  const SingleStudyModal = () => {
    return (
      <ReactModal isOpen={showModal} onRequestClose={() => setShowModal(false)}>
        <div className="flex flex-col h-full gap-y-4">
          <div className="flex-grow overflow-y-auto">
            <Image
              src="/user-flow/studies-mock-up.png"
              layout="responsive"
              width="100%"
              height="100%"
            ></Image>
          </div>
        </div>
      </ReactModal>
    );
  };

  return (
    <UserFlowVariedPages {...{ headerElements }}>
      {SingleStudyModal()}
      <div className="flex flex-col p-4 gap-y-4">
        <div>
          <Search />
        </div>
        <div className="flex flex-row justify-end">
          <ExploreStudies onClick={() => router.push("analysis")} />
        </div>
        <Studies
          projectIds={data.map((d) => d.projectId)}
          onClickStudy={(projectId) => {
            setSelectedProjectId(projectId);
            setShowModal(true);
          }}
        />
      </div>
    </UserFlowVariedPages>
  );
};

interface ExploreStudiesProps {
  readonly onClick: () => void;
}
const ExploreStudies = (props: ExploreStudiesProps) => {
  return <Button onClick={props.onClick}>Explore Studies</Button>;
};

export default StudiesPage;
