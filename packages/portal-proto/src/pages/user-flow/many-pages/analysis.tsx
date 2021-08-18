import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ReactModal from "react-modal";
import {
  App,
  UserFlowVariedPages,
} from "../../../features/layout/UserFlowVariedPages";
import { Select } from "../../../components/Select";
import { CohortManager } from "../../../features/user-flow/many-pages/cohort";
import {
  GeneExpression,
  OncoGrid,
  ProteinPaint,
  SetOperations,
  SingleCellRnaSeq,
  CohortComparison,
  ClinicalDataAnalysis,
} from "../../../features/apps/Apps";

const AnalysisPage: NextPage = () => {
  const [showCohortBuilderModal, setShowCohortBuilderModal] = useState(false);

  const [showAppModal, setShowAppModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState("");

  const options = [
    { value: "cb-modal", label: "Cohort Builder Modal" },
    { value: "cb-expand", label: "Cohort Builder Expand" },
  ];

  const [protoOption, setProtoOption] = useState(options[0]);
  const [isExpanded, setIsExpanded] = useState(false);

  const headerElements = [
    <Link key="Studies" href="/user-flow/many-pages/studies">
      Cohorts
    </Link>,
    "Analysis",
    <Link key="Repository" href="/user-flow/many-pages/repository">
      Repository
    </Link>,
  ];

  const Options = () => (
    <Select
      inputId="analysis-proto-options"
      isMulti={false}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 bg-gray-100">
        <OncoGrid
          onClick={() => {
            setSelectedApp("OncoGrid");
            setShowAppModal(true);
          }}
        />
        <SingleCellRnaSeq
          onClick={() => {
            setSelectedApp("scRNA-Seq");
            setShowAppModal(true);
          }}
        />
        <GeneExpression
          onClick={() => {
            setSelectedApp("Gene Expression");
            setShowAppModal(true);
          }}
        />
        <ProteinPaint
          onClick={() => {
            setSelectedApp("ProteinPaint");
            setShowAppModal(true);
          }}
        />

        <SetOperations
          onClick={() => {
            setSelectedApp("Set Operations");
            setShowAppModal(true);
          }}
        />
        <CohortComparison
          onClick={() => {
            setSelectedApp("Cohort Comparison");
            setShowAppModal(true);
          }}
        />
        <ClinicalDataAnalysis
          onClick={() => {
            setSelectedApp("Clinical Data Analysis");
            setShowAppModal(true);
          }}
        />

        {/* {[undefined, undefined, undefined].map((name, i) => (
          <App
            key={`${name}-${i}`}
            name={name}
            onClick={() => {
              setSelectedApp(name);
              setShowAppModal(true);
            }}
          />
        ))} */}
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
        <div className="border p-4 border-gray-400 bg-white">
          <CohortManager
            setIsModalOpen={setShowCohortBuilderModal}
            setIsExpanded={setIsExpanded}
            isExpanded={isExpanded}
            mode={protoOption}
            isOpen={showCohortBuilderModal}
            closeModal={() => setShowCohortBuilderModal(false)}
          />
        </div>
        <Apps />
      </div>
    </UserFlowVariedPages>
  );
};

export default AnalysisPage;
