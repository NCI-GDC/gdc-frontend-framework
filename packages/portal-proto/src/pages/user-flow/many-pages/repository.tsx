import { NextPage } from "next";
import Link from "next/link";
import { UserFlowVariedPages } from "../../../features/layout/UserFlowVariedPages";
import { CohortManager } from "../../../features/user-flow/many-pages/cohort";
import Select from "react-select";
import { useState } from "react";
import { GdcFile, useFiles } from "@gff/core";

const RepositoryPage: NextPage = () => {
  const { data } = useFiles();

  const options = [
    { value: "cb-modal", label: "Cohort Builder Modal" },
    { value: "cb-expand", label: "Cohort Builder Expand" },
  ];

  const [protoOption, setProtoOption] = useState(options[0]);
  const [isExpanded, setIsExpanded] = useState(false);

  const [showCohortBuilderModal, setShowCohortBuilderModal] = useState(false);

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

  const headerElements = [
    <Link key="Home" href="/">
      Home
    </Link>,
    <Link key="Studies" href="/user-flow/many-pages/studies">
      Studies
    </Link>,
    <Link key="Analysis" href="/user-flow/many-pages/analysis">
      Analysis
    </Link>,
    "Repository",
  ];

  return (
    <UserFlowVariedPages {...{ headerElements, Options }}>
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
          <div className="text-center">
            Some repo-specific actions, e.g. download, etc. here.
          </div>
        </div>
        <div className="border p-4 border-gray-400">
          <Files files={data} />
        </div>
      </div>
    </UserFlowVariedPages>
  );
};

export default RepositoryPage;

interface FilesProps {
  readonly files: ReadonlyArray<GdcFile>;
}

const Files: React.FC<FilesProps> = ({ files }: FilesProps) => {
  return (
    <div className="overflow-y-auto h-96">
      <table
        className="table-auto border-collapse border-gray-400 w-full"
        style={{ borderSpacing: "4em" }}
      >
        <thead>
          <tr className="bg-gray-400">
            <th className="px-2">File</th>
            <th className="px-2">Access</th>
            <th className="px-2">Experimental Strategy</th>
            <th className="px-2">Data Category</th>
            <th className="px-2">Data Format</th>
            <th className="px-2">File Size</th>
          </tr>
        </thead>
        <tbody>
          {files &&
            files.map((file, i) => (
              <tr key={file.id} className={i % 2 == 0 ? "bg-gray-200" : ""}>
                <td className="px-2 break-all">{file.fileName}</td>
                <td className="px-2">{file.access}</td>
                <td className="px-2">{file.experimentalStrategy}</td>
                <td className="px-2">{file.dataCategory}</td>
                <td className="px-2">{file.dataFormat}</td>
                <td className="px-2">{file.fileSize}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
