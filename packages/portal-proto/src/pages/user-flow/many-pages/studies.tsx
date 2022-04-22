import { NextPage } from "next";
import { UserFlowVariedPages } from "../../../features/layout/UserFlowVariedPages";
import { Button } from "@mantine/core";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";
import ReactModal from "react-modal";
import { ContextualStudiesView } from "../../../features/studies/StudiesView";
import { headerElements } from "./navigation-utils";

const StudiesPage: NextPage = () => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

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
          setCurrentStudy={() => {
            setShowModal(true);
          }}
          exploreLeft={
            <Button
              onClick={() => router.push("analysis")}
              className="bg-nci-gray-light hover:bg-nci-gray-dark text-nci-gray-lightest transition-colors"
            >
              Analyze Selected Cohorts
            </Button>
          }
          exploreRight={
            <Button
              onClick={() => router.push("repository")}
              className="bg-nci-gray-light hover:bg-nci-gray-dark text-nci-gray-lightest transition-colors"
            >
              Download Files From Selected Cohorts
            </Button>
          }
        />
      </div>
    </UserFlowVariedPages>
  );
};

export default StudiesPage;
