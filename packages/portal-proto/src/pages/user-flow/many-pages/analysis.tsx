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
  SequenceReads,
  SomaticMutations
} from "../../../features/apps/Apps";
import { FileModal } from "../../../features/files/FileView";
import { GdcFile } from "@gff/core";
import { CaseModal } from "../../../features/cases/CaseView";
import { Case } from "../../../features/cases/CasesView";

const AnalysisPage: NextPage = () => {
  const [showCohortBuilderModal, setShowCohortBuilderModal] = useState(false);

  const [showAppModal, setShowAppModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState("");

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

    const sortOptions = [
      { value: "a-z", label: "Sort: A-Z" },
      { value: "z-a", label: "Sort: Z-A" },
    ];
    // const tagStyles = "truncate px-2 py-1 text-xs m-1.5 border rounded border-nci-blumine bg-nci-blumine-lightest hover:bg-nci-blumine text-nci-blumine-darker hover:text-white"
    const inactiveStyling = "truncate px-2 py-1 text-xs m-1.5 border rounded border-black bg-white hover:bg-nci-blue text-black hover:text-white"
    const activeStyling = "truncate px-2 py-1 text-xs m-1.5 border rounded border-black bg-nci-blumine-darker hover:bg-nci-blumine-lightest text-white hover:text-nci-blumine-darker"

    const defaultTagStyles = {
      clinicalAnalysis: false,
      generalUtility: false,
      sequenceAnalysis: false,
      variantAnalysis: false,
      cnv: false,
      geneExpression: false,
      ssm: false
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
      { name: "Somatic Mutations", tags: ["variantAnalysis", "ssm"] }
    ]
    const [appView, setAppView] = useState(() => analysisArr);
    const [nameVal, setNameVal] = useState({ value: "a-z", label: "Sort: A-Z" });
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
          )
        case "Cohort Comparison":
          return (
            <CohortComparison
              onClick={() => {
                setSelectedApp("Cohort Comparison");
                setShowAppModal(true);
              }}
            />
          )
        case "Gene Expression":
          return (
            <GeneExpression
              onClick={() => {
                setSelectedApp("Gene Expression");
                setShowAppModal(true);
              }}
            />
          )
        case "OncoGrid":
          return (
            <OncoGrid
              onClick={() => {
                setSelectedApp("OncoGrid");
                setShowAppModal(true);
              }}
            />
          )
        case "ProteinPaint":
          return (
            <ProteinPaint
              onClick={() => {
                setSelectedApp("ProteinPaint");
                setShowAppModal(true);
              }}
            />
          )
        case "ScRNA-Seq":
          return (
            <SingleCellRnaSeq
              onClick={() => {
                setSelectedApp("scRNA-Seq");
                setShowAppModal(true);
              }}
            />
          )
        case "Sequence Reads":
          return (
            <SequenceReads
              onClick={() => {
                setSelectedApp("Sequence Reads");
                setShowAppModal(true);
              }}
            />
          )
        case "Set Operations":
          return (
            <SetOperations
              onClick={() => {
                setSelectedApp("Set Operations");
                setShowAppModal(true);
              }}
            />
          )
        case "Somatic Mutations":
          return (
            <SomaticMutations
              onClick={() => {
                setSelectedApp("Somatic Mutations");
                setShowAppModal(true);
              }}
            />
          )
      }
    }

    const descendingOrd = (param) => {
      return appView.sort((a, b) => {
        if (a[param] < b[param]) {
          return -1
        } else if (a[param] > b[param]) {
          return 1
        } else {
          return 0
        }
      })
    }

    const ascendingOrd = (param) => {
      return appView.sort((a, b) => {
        if (b[param] < a[param]) {
          return -1
        } else if (b[param] > a[param]) {
          return 1
        } else {
          return 0
        }
      })
    }

    const sortAlphabetically = (direction, category) => {
      let sortedApps = direction === "a-z" ?
        descendingOrd(category) : ascendingOrd(category)
      // console.log('sortedApps', sortedApps);
      return sortedApps;
    }

    const handleTagFilter = (tagName) => {
      let styleClone = { ...tagStyling, [tagName]: !tagStyling[tagName] }
      setTagStyling(styleClone);
      let tagArrClone = [...activeTags];
      // console.log('original array', analysisArr);
      const tagIndex = tagArrClone.indexOf(tagName);
      tagIndex < 0 ? tagArrClone.push(tagName) : tagArrClone.splice(tagIndex, 1);
      setActiveTags(tagArrClone);
      // console.log('the clone', tagArrClone);
      const filteredTags = analysisArr.filter(element => element.tags.some(tag => tagArrClone.includes(tag)));
      filteredTags.length === 0 ? setAppView(analysisArr) : setAppView(filteredTags);
    }

    const clearTags = () => {
      setTagStyling(defaultTagStyles);
      setNameVal({ value: "a-z", label: "Sort: A-Z" });
      setActiveTags([]);
      setAppView(analysisArr); 
    }

    const sortFilter = (
      <Select
        label="Name Sort"
        inputId="studies-name-view__sort"
        options={sortOptions}
        placeholder="Analysis Sort"
        value={nameVal}
        isMulti={false}
        onChange={(e) => {
          setNameVal(sortOptions.filter(op => op.value === e.value)[0])
          setAppView(sortAlphabetically(e.value, "name"))
        }}
      />
    );
    return (
      <>
        <div className="flex flex-row mx-2 p-2.5">
          <div>Tags:</div>
          <div className="w-2.5"></div>
          <div className="border p-1.5 w-min gap-1 border-gray-400 bg-white rounded">
            <div className="flex">
              <div className="flex flex-wrap">
                <div className="flex flex-row">
                  <button className={`${tagStyling.clinicalAnalysis ? activeStyling : inactiveStyling}`} onClick={() => handleTagFilter("clinicalAnalysis")}>
                    Clinical Analysis
                  </button>
                  <button className={`${tagStyling.generalUtility ? activeStyling : inactiveStyling}`} onClick={() => handleTagFilter("generalUtility")}>
                    General Utility
                  </button>
                  <button className={`${tagStyling.sequenceAnalysis ? activeStyling : inactiveStyling}`} onClick={() => handleTagFilter("sequenceAnalysis")}>
                    Sequence Analysis
                  </button>
                </div>
                <div className="flex flex-row">
                  <button className={`${tagStyling.variantAnalysis ? activeStyling : inactiveStyling}`} onClick={() => handleTagFilter("variantAnalysis")}>
                    Variant Analysis
                  </button>
                  <button className={`${tagStyling.cnv ? activeStyling : inactiveStyling}`} onClick={() => handleTagFilter("cnv")}>
                    CNV
                  </button>
                  <button className={`${tagStyling.geneExpression ? activeStyling : inactiveStyling}`} onClick={() => handleTagFilter("geneExpression")}>
                    Gene Expression
                  </button>
                  <button className={`${tagStyling.ssm ? activeStyling : inactiveStyling}`} onClick={() => handleTagFilter("ssm")}>
                    SSM
                  </button>
                </div>
              </div>
              <div className="flex w-14 p-2 content-center"><button onClick={() => clearTags()} className="text-nci-blumine-darker text-sm bold">Clear</button></div>
            </div>
          </div>
        </div>
        <div className="w-40">{sortFilter}</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-gray-100">
          {appView.map(element => {
            return componentArrayMapping(element.name)
          })}
          {/* <ClinicalDataAnalysis
            onClick={() => {
              setSelectedApp("Clinical Data Analysis");
              setShowAppModal(true);
            }}
          />
          <CohortComparison
            onClick={() => {
              setSelectedApp("Cohort Comparison");
              setShowAppModal(true);
            }}
          />
          <GeneExpression
            onClick={() => {
              setSelectedApp("Gene Expression");
              setShowAppModal(true);
            }}
          />
          <OncoGrid
            onClick={() => {
              setSelectedApp("OncoGrid");
              setShowAppModal(true);
            }}
          />
          <ProteinPaint
            onClick={() => {
              setSelectedApp("ProteinPaint");
              setShowAppModal(true);
            }}
          />
          <SingleCellRnaSeq
            onClick={() => {
              setSelectedApp("scRNA-Seq");
              setShowAppModal(true);
            }}
          />
          <SequenceReads
            onClick={() => {
              setSelectedApp("Sequence Reads");
              setShowAppModal(true);
            }}
          />
          <SetOperations
            onClick={() => {
              setSelectedApp("Set Operations");
              setShowAppModal(true);
            }}
          />
          <SomaticMutations
            onClick={() => {
              setSelectedApp("Somatic Mutations");
              setShowAppModal(true);
            }}
          /> */}
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
      </>
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
      {...{ indexPath: "/user-flow/many-pages", headerElements, Options }}
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
