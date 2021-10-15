import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import React, { PropsWithChildren, ReactNode, useState } from "react";
import ReactModal from "react-modal";
import { UserFlowVariedPages } from "../../../features/layout/UserFlowVariedPages";
import { Select } from "../../../components/Select";
import { CohortManager } from "../../../features/user-flow/many-pages/cohort";
import SomanticMutationFilterFixedVersion from '../../../features/genomic/SomanticMutationFilter';
import {
  GeneExpression,
  OncoGrid,
  ProteinPaint,
  SetOperations,
  SingleCellRnaSeq,
  CohortComparison,
  ClinicalDataAnalysis,
  SomaticMutations
} from "../../../features/apps/Apps";
import {
  MdClose as CloseIcon,
} from "react-icons/md";

import { FileModal } from "../../../features/files/FileView";
import { GdcFile } from "@gff/core";
import { CaseModal } from "../../../features/cases/CaseView";
import { Case } from "../../../features/cases/CasesView";

const AnalysisPage: NextPage = () => {
  const [showCohortBuilderModal, setShowCohortBuilderModal] = useState(false);
  const [appsAsModal, setAppsAsModal] = useState(false);

  const [showAppModal, setShowAppModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState("");

  const cohort_options = [
    { value: "cb-expand", label: "Cohort Builder Expand" },
    { value: "cb-modal", label: "Cohort Builder Modal" },
  ];

  const app_options = [
    { value: "app-expand", label: "Apps Expand" },
    { value: "app-modal", label: "Apps Modal" },
  ];

  const [protoOption, setProtoOption] = useState(cohort_options[0]);
  const [appProtoOption, setAppProtoOption] = useState(app_options[0]);
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
    <Link key="Studies" href="/user-flow/many-pages/studies">
      Cohorts
    </Link>,
    "Analysis",
    <Link key="Repository" href="/user-flow/many-pages/repository">
      Repository
    </Link>,
  ];

  const Options = () => (
    <div className="flex flex-col mb-2 ">
    <Select
      inputId="analysis-proto-options"
      isMulti={false}
      isSearchable={false}
      value={protoOption}
      options={cohort_options}
      onChange={(v) => {
        if (v.value != "cb-expand") {
          setIsExpanded(false);
        }
        setProtoOption(v);
      }}
    />
  <Select
    inputId="analysis-app-proto-options"
    isMulti={false}
    isSearchable={false}
    value={appProtoOption}
    options={app_options}
    onChange={(v) => {
      if (v.value != "app-expand") {
        setAppsAsModal(true);
      } else {
        setAppsAsModal(false);
      }
      setAppProtoOption(v);
    }}
  />
    </div>
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

        <SomaticMutations  onClick={() => {
          setSelectedApp("Somatic Mutations");
          setShowAppModal(true);
        }} />


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


  interface ModalOrInlineProps  {
    readonly modal?:boolean
  }

  const ModalOrInline:React.FC<ModalOrInlineProps > = ({  children, modal = true } : PropsWithChildren<ModalOrInlineProps>) => {
      return (
        (modal === true) ?
          <ReactModal isOpen={showAppModal}
                      onRequestClose={() => setShowAppModal(false)} >
          {children}
        </ReactModal> :  <div>
          {children}
        </div>
      )
  }

  const AppModal = (  ) => {
    return (
      (selectedApp !== "") ?
      <ModalOrInline modal={appsAsModal}>
        <div className="flex flex-col border-nci-gray-light border-2 h-full">
          <div className="w-full border-1 border-b-2 border-nci-blue-lighter" >
                 <button className="flex flex-row" onClick={ () => {
                   setSelectedApp("")
                 } }><CloseIcon className="bg-nci-blue-lighter mr-2" size="1.5em" /> Analysis</button>
          </div>
          <div className="flex-grow overflow-y-auto">
            {(selectedApp === "Somatic Mutations") ?
              <SomanticMutationFilterFixedVersion />
              :
              <Image
                src="/user-flow/oncogrid-mock-up.png"
                layout="responsive"
                width="100%"
                height="100%"
              ></Image>
            }
          </div>
        </div>
      </ModalOrInline> : null
        );
  };

  const empty =  () => {return (<div></div>) }
  return (
    <UserFlowVariedPages
      {...{ indexPath: "/user-flow/many-pages", headerElements, empty}}
    >

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
        {(selectedApp) ?
          <AppModal /> :
          <Apps />
        }
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
