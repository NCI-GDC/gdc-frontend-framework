import { NextPage } from "next";
import { UserFlowVariedPages } from "@/features/layout/UserFlowVariedPages";
import { CohortManager } from "@/features/user-flow/many-pages/cohort";
import { Select } from "@/components/Select";
import { useState } from "react";
import { GdcFile, useGetFilesQuery } from "@gff/core";
import { FileModal } from "@/features/files/FileView";
import { headerElements } from "@/features/user-flow/many-pages/navigation-utils";
import { Case } from "@/features/user-flow/all-apps/baseExploration";

const RepositoryPage: NextPage = () => {
  const { data } = useGetFilesQuery({ size: 20 });

  const options = [
    { value: "cb-expand", label: "Cohort Builder Expand" },
    { value: "cb-modal", label: "Cohort Builder Modal" },
  ];

  const [protoOption, setProtoOption] = useState(options[0]);
  const [isExpanded, setIsExpanded] = useState(false);

  const [showCohortBuilderModal, setShowCohortBuilderModal] = useState(false);

  const [isFileModalOpen, setFileModalOpen] = useState(false);
  const [currentFile, setCurrentFile] = useState(undefined as GdcFile);

  const [, setCaseModalOpen] = useState(false);
  const [, setCurrentCase] = useState(undefined as Case);

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

  return (
    <UserFlowVariedPages
      {...{ indexPath: "/user-flow/many-pages", headerElements, Options }}
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
        <div className="border border-gray-400 bg-base-lightest p-4">
          TODO Fix FilesView if needed
          {data}
          {/*<FilesView
            files={data}
            handleFileSelected={(file: GdcFile) => {
              setCurrentFile(file);
              setFileModalOpen(true);
            }}
          /> */}
        </div>
      </div>
      <FileModal
        isOpen={isFileModalOpen}
        closeModal={() => setFileModalOpen(false)}
        file={currentFile}
      />
    </UserFlowVariedPages>
  );
};

export default RepositoryPage;
