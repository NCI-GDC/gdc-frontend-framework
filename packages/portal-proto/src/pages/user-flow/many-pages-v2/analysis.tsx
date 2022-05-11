import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ReactModal from "react-modal";
import { UserFlowVariedPages } from "../../../features/layout/UserFlowVariedPages";
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
import { FileModal } from "../../../features/files/FileView";
import { GdcFile } from "@gff/core";
import { CaseModal } from "../../../features/cases/CaseView";
import { Case } from "../../../features/cases/CasesView";

const AnalysisPage: NextPage = () => {
  const [showCohortBuilderModal, setShowCohortBuilderModal] = useState(false);

  const [showAppModal, setShowAppModal] = useState(false);

  const options = [
    { value: "cb-expand", label: "Cohort Builder Expand" },
    { value: "cb-modal", label: "Cohort Builder Modal" },
  ];

  const [protoOption, setProtoOption] = useState(options[0]);
  const [isExpanded, setIsExpanded] = useState(false);

  // the next two state hooks are used for a single components. what's a good
  // way to organize the code to encapsulate or at least group these?
  // and we have to repeat ourselves in every page where we use this modal.
  // perhaps we could create a hook to create the states and the component.
  // pretty much a hook that acts as a HOC.
  const [isFileModalOpen, setFileModalOpen] = useState(false);
  const [currentFile, setCurrentFile] = useState(undefined as GdcFile);

  const [isCaseModalOpen, setCaseModalOpen] = useState(false);
  const [currentCase, setCurrentCase] = useState(undefined as Case);

  const headerElements = [
    <Link key="Studies" href="/user-flow/many-pages-v2/studies">
      Cohorts
    </Link>,
    "Analysis",
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
            setShowAppModal(true);
          }}
        />
        <SingleCellRnaSeq
          onClick={() => {
            setShowAppModal(true);
          }}
        />
        <GeneExpression
          onClick={() => {
            setShowAppModal(true);
          }}
        />
        <ProteinPaint
          onClick={() => {
            setShowAppModal(true);
          }}
        />

        <SetOperations
          onClick={() => {
            setShowAppModal(true);
          }}
        />
        <CohortComparison
          onClick={() => {
            setShowAppModal(true);
          }}
        />
        <ClinicalDataAnalysis
          onClick={() => {
            setShowAppModal(true);
          }}
        />
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
    <UserFlowVariedPages
      {...{ indexPath: "/user-flow/many-pages-v2", headerElements, Options }}
    >
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
            handleFileSelected={(file: GdcFile) => {
              setCurrentFile(file);
              setFileModalOpen(true);
            }}
            handleCaseSelected={(patient: Case) => {
              setCurrentCase(patient);
              setCaseModalOpen(true);
            }}
          />
        </div>
        <Apps />
      </div>
      <FileModal
        isOpen={isFileModalOpen}
        closeModal={() => setFileModalOpen(false)}
        file={currentFile}
      />
      <CaseModal
        isOpen={isCaseModalOpen}
        closeModal={() => setCaseModalOpen(false)}
        patient={currentCase}
      />
    </UserFlowVariedPages>
  );
};

export default AnalysisPage;
