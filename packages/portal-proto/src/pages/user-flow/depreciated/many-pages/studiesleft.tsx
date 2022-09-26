import { NextPage } from "next";
import { UserFlowVariedPages } from "@/features/layout/UserFlowVariedPages";
import { Image } from "@/components/Image";
import { useState } from "react";
import ReactModal from "react-modal";
import { ContextualStudiesView } from "@/features/studies/StudiesViewLeft";
import { headerElements } from "@/features/user-flow/many-pages/navigation-utils";

const StudiesPageLeft: NextPage = () => {
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
            />
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
        />
      </div>
    </UserFlowVariedPages>
  );
};

export default StudiesPageLeft;
