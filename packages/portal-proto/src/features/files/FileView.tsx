import React, { useState } from "react";
import { GdcFile, HistoryDefaults } from "@gff/core";
import ReactModal from "react-modal";
import { HorizontalTable } from "../../components/HorizontalTable";
import { Table } from "@mantine/core";
import { get } from "lodash";
import dynamic from "next/dynamic";
import { formatDataForTable, parseSlideDetailsInfo } from "./utils";

import Link from "next/link";

const ImageViewer = dynamic(() => import("../../components/ImageViewer"), {
  ssr: false,
});

export interface FileViewProps {
  readonly file?: GdcFile;
  readonly fileHistory?: HistoryDefaults[];
}

export const FileView: React.FC<FileViewProps> = ({
  file,
  fileHistory,
}: FileViewProps) => {
  const [imageId] = useState(file?.fileId);
  const UuidLink = ({
    uuid,
    text,
  }: {
    uuid: string;
    text: string;
  }): JSX.Element => (
    <Link
      href={{
        query: { uuid: uuid },
      }}
    >
      <a className="text-gdc-blue hover:underline">{text}</a>
    </Link>
  );
  //temp table compoent untill global one is done
  interface TempTableProps {
    readonly tableData: {
      readonly headers: string[];
      readonly tableRows: any[];
    };
  }
  const TempTable = ({ tableData }: TempTableProps): JSX.Element => {
    return (
      <Table striped>
        <thead>
          <tr>
            {tableData.headers.map((text, index) => (
              <th key={index}>{text}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.tableRows.map((row, index) => (
            <tr key={index}>
              {Object.values(row).map((item, index) => (
                <td key={index}>{typeof item === "undefined" ? "--" : item}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  const DownstreamAnalyses = ({
    downstream_analyses,
  }: {
    downstream_analyses: GdcFile["downstream_analyses"];
  }): JSX.Element => {
    const tableRows = [];
    const workflowType = downstream_analyses?.[0]?.workflow_type;
    downstream_analyses?.[0]?.output_files.forEach((obj) => {
      tableRows.push({
        file_name: <UuidLink uuid={obj.file_id} text={obj.file_name} />,
        data_category: obj.data_category,
        data_type: obj.data_type,
        data_format: obj.data_format,
        workflow_type: workflowType,
        file_size: obj.file_size,
      });
    });

    const formatedTableData = {
      headers: [
        "File Name",
        "Data Category",
        "Data Type",
        "Data Format",
        "Analysis Workflow",
        "Size",
      ],
      tableRows: tableRows,
    };
    return <TempTable tableData={formatedTableData} />;
  };

  const AssociatedCB = ({
    cases,
  }: {
    cases: GdcFile["cases"];
  }): JSX.Element => {
    const tableRows = [];

    cases?.forEach((caseObj) => {
      caseObj.samples?.forEach((sample) => {
        // find entity_id note path for entity_type
        const portion = sample.portions?.[0];
        // assigned to variables to avoid "is missing in props validation  react/prop-types" lint error
        let entity_type = "cases",
          entity_id = sample.submitter_id;

        if (portion.analytes?.[0]?.aliquots?.[0]?.submitter_id) {
          entity_type = "aliquot";
          entity_id = portion.analytes?.[0]?.aliquots?.[0]?.submitter_id;
        } else if (portion.slides?.[0]?.submitter_id) {
          entity_type = "slide node";
          entity_id = portion.slides?.[0]?.submitter_id;
        } else if (portion.submitter_id) {
          entity_type = "portions";
          entity_id = portion.submitter_id;
        }

        tableRows.push({
          entity_id: entity_id,
          entity_type: entity_type,
          sample_type: sample.sample_type,
          case_uuid: caseObj.case_id,
          annotations: caseObj?.annotations?.length | 0,
        });
      });
    });

    const formatedTableData = {
      headers: [
        "Entity ID",
        "Entity Type",
        "Sample Type",
        "Case UUID",
        "Annotations",
      ],
      tableRows: tableRows,
    };
    return <TempTable tableData={formatedTableData} />;
  };
  return (
    <div className="p-4 text-nci-gray">
      <div className="flex">
        <div className="flex-auto bg-white mr-4">
          <h2 className="p-2 text-lg mx-4">File Properties</h2>
          <HorizontalTable
            tableData={formatDataForTable(file, [
              {
                field: "fileName",
                name: "Name",
              },
              {
                field: "access",
                name: "Access",
              },
              {
                field: "id",
                name: "UUID",
              },
              {
                field: "dataFormat",
                name: "Data Format",
              },
              {
                field: "fileSize",
                name: "Size",
              },
              {
                field: "md5sum",
                name: "MD5 Checksum",
              },
              {
                field: "state",
                name: "State",
              },
              {
                field: "project_id",
                name: "Project",
              },
            ])}
          />
        </div>
        <div className="w-1/3 bg-white h-full">
          <h2 className="p-2 text-lg mx-4">Data Information</h2>
          <HorizontalTable
            tableData={formatDataForTable(file, [
              {
                field: "dataCategory",
                name: "Data Category",
              },
              {
                field: "dataType",
                name: "Data Type",
              },
              {
                field: "experimentalStrategy",
                name: "Experimental Strategy",
              },
              {
                field: "platform",
                name: "Platform",
              },
            ])}
          />
        </div>
      </div>

      {get(file, "dataType") === "Slide Image" ? (
        <div className="bg-white w-full mt-4">
          <h2 className="p-2 text-lg mx-4">Slide Image Viewer</h2>
          <ImageViewer
            imageId={imageId}
            tableData={parseSlideDetailsInfo(file)}
          />
          <div>
            slide ids for first case, sample, portion:{" "}
            <ul>
              {file?.cases?.[0]?.samples?.[0]?.portions?.[0]?.slides?.map(
                (slide) => (
                  <li key={slide.slide_id}>{slide.slide_id}</li>
                ),
              )}
            </ul>
          </div>
        </div>
      ) : null}
      <div className="bg-white w-full mt-4">
        <h2 className="p-2 text-lg mx-4">Associated Cases/Biospecimens</h2>
        <AssociatedCB cases={file?.cases} />
      </div>
      <div className="bg-white w-full mt-4">
        <h2 className="p-2 text-lg mx-4">Analysis</h2>
        <HorizontalTable
          tableData={formatDataForTable(file, [
            {
              field: "analysis.workflow_type",
              name: "Workflow Type",
            },
            {
              field: "analysis.updated_datetime",
              name: "Workflow Completion Date",
            },
            {
              field: "analysis.input_files.length",
              name: "Source Files",
            },
          ])}
        />
      </div>
      <div className="bg-white w-full mt-4">
        <h2 className="p-2 text-lg mx-4">Downstream Analyses Files</h2>
        {file?.downstream_analyses?.[0]?.output_files?.length > 0 ? (
          <DownstreamAnalyses downstream_analyses={file?.downstream_analyses} />
        ) : (
          <h3 className="p-2 mx-4 text-nci-gray-darker">
            No Downstream Analysis files found.
          </h3>
        )}
      </div>
      <div className="bg-white w-full mt-4">
        <h2 className="p-2 text-lg mx-4">File Versions</h2>
        <TempTable
          tableData={{
            headers: [
              "Version",
              "File UUID",
              "Current Version",
              "Release Date",
              "Release Number",
            ],
            tableRows: fileHistory?.map((obj) => {
              return {
                version: obj.version,
                file_id: <UuidLink uuid={obj.uuid} text={obj.uuid} />,
                current_version: obj.file_change,
                release_date: obj.release_date,
                data_release: obj.data_release,
              };
            }),
          }}
        />
      </div>
    </div>
  );
};

export interface FileModalProps {
  readonly isOpen: boolean;
  readonly closeModal: () => void;
  readonly file?: GdcFile;
  readonly fileHistory?: HistoryDefaults[];
}

export const FileModal: React.FC<FileModalProps> = ({
  isOpen,
  closeModal,
  file,
  fileHistory,
}: FileModalProps) => {
  return (
    <ReactModal isOpen={isOpen} onRequestClose={closeModal}>
      {file?.fileId ? (
        <FileView file={file} fileHistory={fileHistory} />
      ) : (
        <div className="p-4 text-nci-gray">
          <div className="flex">
            <div className="flex-auto bg-white mr-4">
              <h2 className="p-2 text-2xl mx-4">File Not Found</h2>
            </div>
          </div>
        </div>
      )}
    </ReactModal>
  );
};
