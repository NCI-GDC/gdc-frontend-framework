import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ReactModal from "react-modal";
import {
  App,
  UserFlowVariedPages,
} from "../../../features/layout/UserFlowVariedPages";
import Select from "react-select";
import { CohortManager } from "../../../features/user-flow/many-pages/cohort";

const AnalysisPage: NextPage = () => {
  const [showCohortBuilderModal, setShowCohortBuilderModal] = useState(false);

  const [showAppModal, setShowAppModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState("");

  const options = [
    { value: "cb-modal", label: "Cohort Buidler Modal" },
    { value: "cb-expand", label: "Cohort Builder Expand" },
  ];

  const [protoOption, setProtoOption] = useState(options[0]);
  const [isExpanded, setIsExpanded] = useState(false);

  const headerElements = [
    <Link key="Home" href="/">
      Home
    </Link>,
    <Link key="Studies" href="/user-flow/many-pages/studies">
      Studies
    </Link>,
    "Analysis",
    <Link key="Repository" href="/user-flow/many-pages/repository">
      Repository
    </Link>,
  ];

  const Options = () => (
    <Select
      inputId="analysis-proto-options"
      isSearchable={false}
      value={protoOption}
      options={options}
      onChange={(v) => {
        if (v.value != "cb-expand") {
          setIsExpanded(false);
        }
        setProtoOption(v);
      }}
    />
  );

  const Apps = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {[
          "OncoGrid",
          "Gene Expression",
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
        ].map((name, i) => (
          <App
            key={`${name}-${i}`}
            name={name}
            onClick={() => {
              setSelectedApp(name);
              setShowAppModal(true);
            }}
          />
        ))}
      </div>
    );
  };

  const AppModal = () => {
    return (
      <ReactModal
        isOpen={showAppModal}
        onRequestClose={() => setShowAppModal(false)}
      >
        <div className="flex flex-col h-full">
          <div className="flex-grow overflow-y-auto">
            <Image
              src="/user-flow/oncogrid-mock-up.png"
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
    <UserFlowVariedPages {...{ headerElements, Options }}>
      <AppModal />
      <div className="flex flex-col p-4 gap-y-4">
        <div className="border p-4 border-gray-400">
          <CohortManager
            setIsModalOpen={setShowCohortBuilderModal}
            setIsExpanded={setIsExpanded}
            isExpanded={isExpanded}
            mode={protoOption}
            isOpen={showCohortBuilderModal}
            closeModal={() => setShowCohortBuilderModal(false)}
          />
        </div>
        <div className="border p-4 border-gray-400">
          <Apps />
        </div>
      </div>
    </UserFlowVariedPages>
  );
};

export default AnalysisPage;
