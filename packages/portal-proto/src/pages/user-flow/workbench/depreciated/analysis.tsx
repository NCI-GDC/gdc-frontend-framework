import { NextPage } from "next";
import Image from "next/image";
import React, { PropsWithChildren, useState } from "react";
import ReactModal from "react-modal";
import { UserFlowVariedPages } from "@/features/layout/UserFlowVariedPages";
import { Select } from "@/components/Select";
import { CohortManager } from "@/features/user-flow/many-pages/cohort";
import SomanticMutationFilterFixedVersion from "@/features/genomic/SomanticMutationFilter";
import { headerElements } from "@/features/user-flow/workflow/navigation-utils";
import {
  GeneExpression,
  OncoGrid,
  ProteinPaint,
  SetOperations,
  SingleCellRnaSeq,
  CohortComparison,
  ClinicalDataAnalysis,
  SequenceReads,
  SomaticMutations,
} from "@/features/apps/Apps";
import { MdClose as CloseIcon } from "react-icons/md";

import { FileModal } from "@/features/files/FileView";
import { GdcFile } from "@gff/core";
import { CaseModal } from "@/features/cases/CaseView";
import { Case } from "@/features/cases/CasesView";

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

  // TODO: remove this after removing the OPTIONS ^
  console.log(Options);

  const Apps = () => {
    const sortOptions = [
      { value: "a-z", label: "Sort: A-Z" },
      { value: "z-a", label: "Sort: Z-A" },
    ];

    const inactiveTag =
      "truncate px-2 py-1 text-xs m-1.5 border rounded border-black bg-base-lightest hover:bg-nci-blue text-black hover:text-white";
    const activeTag =
      "truncate px-2 py-1 text-xs m-1.5 border rounded border-black bg-nci-blumine-darker hover:bg-nci-blumine-lightest text-white hover:text-nci-blumine-darker";

    const defaultTagStyles = {
      clinicalAnalysis: false,
      generalUtility: false,
      sequenceAnalysis: false,
      variantAnalysis: false,
      cnv: false,
      geneExpression: false,
      ssm: false,
    };

    const analysisArr = [
      { name: "Clinical Data Analysis", tags: ["clinicalAnalysis"] },
      { name: "Cohort Comparison", tags: ["clinicalAnalysis"] },
      { name: "Gene Expression", tags: ["geneExpression"] },
      { name: "OncoGrid", tags: ["variantAnalysis", "cnv", "ssm"] },
      { name: "ProteinPaint", tags: ["variantAnalysis", "ssm"] },
      { name: "ScRNA-Seq", tags: ["geneExpression"] },
      { name: "Sequence Reads", tags: ["sequenceAnalysis"] },
      { name: "Set Operations", tags: ["generalUtility"] },
      { name: "Somatic Mutations", tags: ["variantAnalysis", "ssm"] },
    ];
    const [appView, setAppView] = useState(() => analysisArr);
    const [nameVal, setNameVal] = useState({
      value: "a-z",
      label: "Sort: A-Z",
    });
    const [activeTags, setActiveTags] = useState([]);
    const [tagStyling, setTagStyling] = useState(() => defaultTagStyles);

    const componentArrayMapping = (name) => {
      switch (name) {
        case "Clinical Data Analysis":
          return (
            <ClinicalDataAnalysis
              onClick={() => {
                setSelectedApp("Clinical Data Analysis");
                setShowAppModal(true);
              }}
            />
          );
        case "Cohort Comparison":
          return (
            <CohortComparison
              onClick={() => {
                setSelectedApp("Cohort Comparison");
                setShowAppModal(true);
              }}
            />
          );
        case "Gene Expression":
          return (
            <GeneExpression
              onClick={() => {
                setSelectedApp("Gene Expression");
                setShowAppModal(true);
              }}
            />
          );
        case "OncoGrid":
          return (
            <OncoGrid
              onClick={() => {
                setSelectedApp("OncoGrid");
                setShowAppModal(true);
              }}
            />
          );
        case "ProteinPaint":
          return (
            <ProteinPaint
              onClick={() => {
                setSelectedApp("ProteinPaint");
                setShowAppModal(true);
              }}
            />
          );
        case "ScRNA-Seq":
          return (
            <SingleCellRnaSeq
              onClick={() => {
                setSelectedApp("scRNA-Seq");
                setShowAppModal(true);
              }}
            />
          );
        case "Sequence Reads":
          return (
            <SequenceReads
              onClick={() => {
                setSelectedApp("Sequence Reads");
                setShowAppModal(true);
              }}
            />
          );
        case "Set Operations":
          return (
            <SetOperations
              onClick={() => {
                setSelectedApp("Set Operations");
                setShowAppModal(true);
              }}
            />
          );
        case "Somatic Mutations":
          return (
            <SomaticMutations
              onClick={() => {
                setSelectedApp("Somatic Mutations");
                setShowAppModal(true);
              }}
            />
          );
      }
    };

    const descendingOrd = (param) => {
      return appView.sort((a, b) => {
        if (a[param] < b[param]) {
          return -1;
        } else if (a[param] > b[param]) {
          return 1;
        } else {
          return 0;
        }
      });
    };

    const ascendingOrd = (param) => {
      return appView.sort((a, b) => {
        if (b[param] < a[param]) {
          return -1;
        } else if (b[param] > a[param]) {
          return 1;
        } else {
          return 0;
        }
      });
    };

    const sortAlphabetically = (direction, category) => {
      return direction === "a-z"
        ? descendingOrd(category)
        : ascendingOrd(category);
    };

    const handleTagFilter = (tagName) => {
      // update tag style
      const tagUpdate = { ...tagStyling, [tagName]: !tagStyling[tagName] };
      setTagStyling(tagUpdate);

      // update array of tags active
      const tagArr = [...activeTags];
      const tagIndex = tagArr.indexOf(tagName);
      tagIndex < 0 ? tagArr.push(tagName) : tagArr.splice(tagIndex, 1);
      setActiveTags(tagArr);

      // filter apps based off tags
      const filteredApps = analysisArr.filter((element) =>
        element.tags.some((tag) => tagArr.includes(tag)),
      );
      filteredApps.length === 0
        ? setAppView(analysisArr)
        : setAppView(filteredApps);
    };

    const clearTags = () => {
      setTagStyling(defaultTagStyles);
      setNameVal({ value: "a-z", label: "Sort: A-Z" });
      setActiveTags([]);
      setAppView(analysisArr);
    };

    const sortFilter = (
      <Select
        label="Name Sort"
        inputId="studies-name-view__sort"
        options={sortOptions}
        placeholder="Analysis Sort"
        value={nameVal}
        isMulti={false}
        onChange={(e) => {
          setNameVal(sortOptions.filter((op) => op.value === e.value)[0]);
          setAppView(sortAlphabetically(e.value, "name"));
        }}
      />
    );
    return (
      <>
        <div className="flex flex-row mx-2 p-2.5">
          <div>Tags:</div>
          <div className="w-2.5"></div>
          <div className="border p-1.5 w-min gap-1 border-gray-400 bg-base-lightest rounded">
            <div className="flex">
              <div className="flex flex-wrap">
                <div className="flex flex-row">
                  <button
                    className={`${
                      tagStyling.clinicalAnalysis ? activeTag : inactiveTag
                    }`}
                    onClick={() => handleTagFilter("clinicalAnalysis")}
                  >
                    Clinical Analysis
                  </button>
                  <button
                    className={`${
                      tagStyling.generalUtility ? activeTag : inactiveTag
                    }`}
                    onClick={() => handleTagFilter("generalUtility")}
                  >
                    General Utility
                  </button>
                  <button
                    className={`${
                      tagStyling.sequenceAnalysis ? activeTag : inactiveTag
                    }`}
                    onClick={() => handleTagFilter("sequenceAnalysis")}
                  >
                    Sequence Analysis
                  </button>
                </div>
                <div className="flex flex-row">
                  <button
                    className={`${
                      tagStyling.variantAnalysis ? activeTag : inactiveTag
                    }`}
                    onClick={() => handleTagFilter("variantAnalysis")}
                  >
                    Variant Analysis
                  </button>
                  <button
                    className={`${tagStyling.cnv ? activeTag : inactiveTag}`}
                    onClick={() => handleTagFilter("cnv")}
                  >
                    CNV
                  </button>
                  <button
                    className={`${
                      tagStyling.geneExpression ? activeTag : inactiveTag
                    }`}
                    onClick={() => handleTagFilter("geneExpression")}
                  >
                    Gene Expression
                  </button>
                  <button
                    className={`${tagStyling.ssm ? activeTag : inactiveTag}`}
                    onClick={() => handleTagFilter("ssm")}
                  >
                    SSM
                  </button>
                </div>
              </div>
              <div className="flex w-14 p-2 content-center">
                <button
                  onClick={() => clearTags()}
                  className="text-nci-blumine-darker text-sm bold"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="w-40">{sortFilter}</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-gray-100">
          {appView.map((element) => {
            return componentArrayMapping(element.name);
          })}
        </div>
      </>
    );
  };

  interface ModalOrInlineProps {
    readonly modal?: boolean;
  }

  const ModalOrInline: React.FC<ModalOrInlineProps> = ({
    children,
    modal = true,
  }: PropsWithChildren<ModalOrInlineProps>) => {
    return modal === true ? (
      <ReactModal
        isOpen={showAppModal}
        onRequestClose={() => setShowAppModal(false)}
      >
        {children}
      </ReactModal>
    ) : (
      <div>{children}</div>
    );
  };

  const AppModal = () => {
    return selectedApp !== "" ? (
      <ModalOrInline modal={appsAsModal}>
        <div className="flex flex-col border-nci-gray-light border-2 h-full">
          <div className="w-full border-1 border-b-2 border-nci-blue-lighter">
            <button
              className="flex flex-row"
              onClick={() => {
                setSelectedApp("");
              }}
            >
              <CloseIcon className="bg-nci-blue-lighter mr-2" size="1.5em" />{" "}
              Analysis
            </button>
          </div>
          <div className="flex-grow overflow-y-auto">
            {selectedApp === "Somatic Mutations" ? (
              <SomanticMutationFilterFixedVersion />
            ) : (
              <Image
                src="/user-flow/oncogrid-mock-up.png"
                layout="responsive"
                width="100%"
                height="100%"
              ></Image>
            )}
          </div>
        </div>
      </ModalOrInline>
    ) : null;
  };

  const empty = () => {
    return <div></div>;
  };
  return (
    <UserFlowVariedPages
      {...{ indexPath: "/user-flow/many-pages", headerElements, empty }}
    >
      <div className="flex flex-col p-4 gap-y-4">
        <div className="border p-4 border-gray-400 bg-base-lightest">
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
        {selectedApp ? <AppModal /> : <Apps />}
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
