import { NextPage } from "next";
import { UserFlowVariedPages } from "../../../features/layout/UserFlowVariedPages";
import Link from "next/link";
import { ContextualStudiesView } from "../../../features/studies/StudiesView";
import ReactModal from "react-modal";
import { StudyView } from "../../../features/studies/StudyView";
import { useState } from "react";

const CohortsPage: NextPage = () => {
  const [isStudyModalOpen, setStudyModalOpen] = useState(false);
  
  const headerElements = [
      "Cohorts",
    <Link key="exploration" href="/user-flow/all-apps-v2/exploration">
      Exploration
    </Link>,
  ];

  return (
    <UserFlowVariedPages
      {...{ indexPath: "/user-flow/all-apps-v2", headerElements }}
    >
      <div className="flex flex-col p-4">
      <ContextualStudiesView setCurrentStudy={() => setStudyModalOpen(true)}/></div>
      <StudyModal isOpen={isStudyModalOpen} closeModal={() => setStudyModalOpen(false)}/>
    </UserFlowVariedPages>
  );
};

interface StudyModalProps {
  readonly isOpen: boolean;
  readonly closeModal: () => void;
}

const StudyModal: React.FC<StudyModalProps> = ({
  isOpen,
  closeModal,
}: StudyModalProps) => {
  return (
    <ReactModal isOpen={isOpen} onRequestClose={closeModal}>
      <StudyView />
    </ReactModal>
  );
};

export default CohortsPage;
