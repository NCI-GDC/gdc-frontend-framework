import { NextPage } from "next";
import {
  UserFlowVariedPages,
} from "../../../features/layout/UserFlowVariedPages";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";
import ReactModal from "react-modal";
import { ContextualStudiesView } from "../../../features/studies/StudiesView";

const StudiesPage: NextPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState("");

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
    <UserFlowVariedPages
      {...{ indexPath: "/user-flow/many-pages", headerElements }}
    >
      <div className="flex flex-col p-4 gap-y-4">
        {SingleStudyModal()}
        <ContextualStudiesView
          setCurrentStudy={(projectId) => {
            setSelectedProjectId(projectId);
            setShowModal(true);
          }}
        />
      </div>
    </UserFlowVariedPages>
  );
};

export default StudiesPage;
