import React, { useState } from "react";
import { GdcFile, HistoryDefaults } from "@gff/core";
import ReactModal from "react-modal";
import { HorizontalTable } from "../../components/HorizontalTable";
import { Table, Button } from "@mantine/core";
import { FaShoppingCart, FaDownload, FaCut } from "react-icons/fa";
import { get } from "lodash";
import dynamic from "next/dynamic";
import fileSize from "filesize";
import { formatDataForHorizontalTable, parseSlideDetailsInfo } from "./utils";

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
  const GenericLink = ({
    path,
    query,
    text,
  }: {
    path: string;
    query?: Record<string, string>;
    text: string;
  }): JSX.Element => {
    const hrefObj: { pathname: string; query?: Record<string, string> } = {
      pathname: path,
    };
    if (query) {
      hrefObj.query = query;
    }
    return (
      <Link href={hrefObj}>
        <a className="text-gdc-blue hover:underline">{text}</a>
      </Link>
    );
  };
  //temp table compoent untill global one is done
  interface TempTableProps {
    readonly tableData: {
      readonly headers: string[];
      readonly tableRows: any[];
    };
  }
  const TempTable = ({ tableData }: TempTableProps): JSX.Element => {
    if (!(tableData?.headers?.length > 0 && tableData?.tableRows?.length > 0)) {
      console.error("bad table data", tableData);
      return <></>;
    }
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
    downstream_analyses?.forEach((byWorkflowType) => {
      const workflowType = byWorkflowType?.workflow_type;
      byWorkflowType?.output_files?.forEach((obj) => {
        tableRows.push({
          file_name: (
            <GenericLink path={`/files/${obj.file_id}`} text={obj.file_name} />
          ),
          data_category: obj.data_category,
          data_type: obj.data_type,
          data_format: obj.data_format,
          workflow_type: workflowType,
          file_size: fileSize(obj.file_size),
          action: (
            <>
              <button className="mr-2 bg-white border border-black rounded p-1 hover:bg-black hover:text-white focus:bg-black focus:text-white">
                <FaShoppingCart title="Add to Cart" />
              </button>
              <button className="bg-white border border-black rounded p-1 hover:bg-black hover:text-white focus:bg-black focus:text-white">
                <FaDownload title="Download" />
              </button>
            </>
          ),
        });
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
        "Action",
      ],
      tableRows: tableRows,
    };
    return <TempTable tableData={formatedTableData} />;
  };

  const AssociatedCB = ({
    cases,
    associated_entities,
  }: {
    cases: GdcFile["cases"];
    associated_entities: GdcFile["associated_entities"];
  }): JSX.Element => {
    const tableRows = [];

    associated_entities?.forEach((entity) => {
      // find matching id from cases
      const caseData = cases?.find(
        (caseObj) => caseObj.case_id === entity.case_id,
      );

      // get sample_type from casedata through matching its submitter_id
      const sample_type = caseData?.samples?.find((sample) => {
        // match entity_submitter_id

        // get submitter_id from diferent paths
        const portion = sample.portions?.[0];
        let entity_id = sample.submitter_id;
        if (portion.analytes?.[0]?.aliquots?.[0]?.submitter_id) {
          entity_id = portion.analytes?.[0]?.aliquots?.[0]?.submitter_id;
        } else if (portion.slides?.[0]?.submitter_id) {
          entity_id = portion.slides?.[0]?.submitter_id;
        } else if (portion.submitter_id) {
          entity_id = portion.submitter_id;
        }
        return entity_id === entity.entity_submitter_id;
      })?.sample_type;

      let entityQuery;
      if (entity.entity_type !== "case") {
        entityQuery = { bioid: entity.entity_id };
      }

      let annotationsLink = <>0</>;
      if (caseData?.annotations?.length === 1) {
        annotationsLink = (
          <GenericLink
            path={`/annotations/${caseData?.annotations[0]}`}
            text={"1"}
          />
        );
      } else if (caseData?.annotations?.length > 1) {
        annotationsLink = (
          <GenericLink
            path={`/annotations`}
            query={{
              filters: JSON.stringify({
                content: [
                  {
                    content: {
                      field: "annotations.entity_id",
                      value: [entity.case_id],
                    },
                    op: "in",
                  },
                ],
                op: "and",
              }),
            }}
            text={`${caseData?.annotations?.length}`}
          />
        );
      }

      tableRows.push({
        entity_id: (
          <GenericLink
            path={`/cases/${entity.case_id}`}
            query={entityQuery}
            text={entity.entity_submitter_id}
          />
        ),
        entity_type: entity.entity_type,
        sample_type: sample_type,
        case_id: (
          <GenericLink
            path={`/cases/${entity.case_id}`}
            text={caseData.submitter_id}
          />
        ),
        annotations: annotationsLink,
      });
    });

    const formatedTableData = {
      headers: [
        "Entity ID",
        "Entity Type",
        "Sample Type",
        "Case ID",
        "Annotations",
      ],
      tableRows: tableRows,
    };
    return <TempTable tableData={formatedTableData} />;
  };
  return (
    <div className="p-4 text-nci-gray">
      <div className="text-right pb-5">
        <Button className="m-1">
          <FaShoppingCart className="mr-2" /> Add to Cart
        </Button>
        {get(file, "dataFormat") === "BAM" && (
          <Button className="m-1">
            <FaCut className="mr-2" /> BAM Slicing
          </Button>
        )}
        <Button className="m-1">
          <FaDownload className="mr-2" /> Download
        </Button>
      </div>
      <div className="flex">
        <div className="flex-auto bg-white mr-4">
          <h2 className="p-2 text-lg mx-4">File Properties</h2>
          <HorizontalTable
            tableData={formatDataForHorizontalTable(file, [
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
                modifier: fileSize,
              },
              {
                field: "md5sum",
                name: "MD5 Checksum",
              },
              {
                field: "project_id",
                name: "Project",
                modifier: (v) => (
                  <GenericLink path={`/projects/${v}`} text={v} />
                ),
              },
            ])}
          />
        </div>
        <div className="w-1/3 bg-white h-full">
          <h2 className="p-2 text-lg mx-4">Data Information</h2>
          <HorizontalTable
            tableData={formatDataForHorizontalTable(file, [
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

      {get(file, "dataType") === "Slide Image" && (
        <div className="bg-white w-full mt-4">
          <h2 className="p-2 text-lg mx-4">Slide Image Viewer</h2>
          <ImageViewer
            imageId={imageId}
            tableData={parseSlideDetailsInfo(file)}
          />
        </div>
      )}
      <div className="bg-white w-full mt-4">
        <h2 className="p-2 text-lg mx-4">Associated Cases/Biospecimens</h2>
        {file?.associated_entities?.length > 0 ? (
          <AssociatedCB
            cases={file?.cases}
            associated_entities={file?.associated_entities}
          />
        ) : (
          <h3 className="p-2 mx-4 text-nci-gray-darker">
            No cases or biospecimen found.
          </h3>
        )}
      </div>
      {file?.analysis && (
        <>
          <div className="bg-white mt-4 flex gap-4">
            <div className="flex-1">
              <h2 className="p-2 text-lg mx-4">Analysis</h2>
              <HorizontalTable
                tableData={formatDataForHorizontalTable(file, [
                  {
                    field: "analysis.workflow_type",
                    name: "Workflow Type",
                  },
                  {
                    field: "analysis.updated_datetime",
                    name: "Workflow Completion Date",
                    modifier: (v) => v.split("T")[0],
                  },
                  {
                    field: "analysis.input_files.length",
                    name: "Source Files",
                    modifier: (v) => {
                      if (v === 1) {
                        return (
                          <GenericLink
                            path={`/files/${
                              get(file, "analysis.input_files")[0]
                            }`}
                            text={"1"}
                          />
                        );
                      } else if (v > 1) {
                        return (
                          <GenericLink
                            path={`/repository`}
                            query={{
                              filters: JSON.stringify({
                                content: [
                                  {
                                    content: {
                                      field:
                                        "files.downstream_analyses.output_files.file_id",
                                      value: [file.id],
                                    },
                                    op: "in",
                                  },
                                ],
                                op: "and",
                              }),
                              searchTableTab: "files",
                            }}
                            text={`${v}`}
                          />
                        );
                      }
                      return "0";
                    },
                  },
                ])}
              />
            </div>
            <div className="flex-1">
              <h2 className="p-2 text-lg mx-4">Reference Genome</h2>
              <HorizontalTable
                tableData={[
                  { headerName: "Genome Build	", values: ["GRCh38.p0"] },
                  { headerName: "Genome Name	", values: ["GRCh38.d1.vd1"] },
                ]}
              />
            </div>
          </div>
          <div className="bg-white w-full mt-4">
            <h2 className="p-2 text-lg mx-4">Read Groups</h2>
            <TempTable
              tableData={{
                headers: [
                  "Read Group ID",
                  "Is Paired End",
                  "Read Length",
                  "Library Name",
                  "Sequencing Center",
                  "Sequencing Date",
                ],
                tableRows: file?.analysis.metadata.read_groups.map(
                  (read_group) => ({
                    read_group_id: read_group.read_group_id ?? "--",
                    is_paired_end: read_group.is_paired_end ? "true" : "false",
                    read_length: read_group.read_length ?? "--",
                    library_name: read_group.library_name ?? "--",
                    sequencing_center: read_group.sequencing_center ?? "--",
                    sequencing_date: read_group.sequencing_date ?? "--",
                  }),
                ),
              }}
            />
          </div>
        </>
      )}
      {file?.downstream_analyses?.some(
        (byWorkflowType) => byWorkflowType?.output_files?.length > 0,
      ) && (
        <div className="bg-white w-full mt-4">
          <h2 className="p-2 text-lg mx-4">Downstream Analyses Files</h2>

          <DownstreamAnalyses downstream_analyses={file?.downstream_analyses} />
        </div>
      )}

      {fileHistory && (
        <div className="bg-white w-full mt-4">
          <h2 className="p-2 text-lg mx-4 float-left">File Versions</h2>
          <div className="float-right mt-3 mr-3">
            <Button color={"gray"} className="mr-2">
              <FaDownload className="mr-2" /> Download JSON
            </Button>
            <Button color={"gray"} className="">
              <FaDownload className="mr-2" /> Download TSV
            </Button>
          </div>
          <TempTable
            tableData={{
              headers: [
                "Version",
                "File UUID",
                "Release Date",
                "Release Number",
              ],
              tableRows: [...fileHistory]
                ?.sort(
                  (a, b) =>
                    //sort based on relese number biggest at top
                    Number.parseFloat(a.version) - Number.parseFloat(b.version),
                )
                .map((obj, index, { length }) => ({
                  version: obj.version,
                  file_id: (
                    <>
                      {obj.uuid}
                      {index + 1 === length && (
                        <span className="inline-block ml-2 border rounded-full bg-nci-blue-darker text-white font-bold text-xs py-0.5 px-1">
                          Current Version
                        </span>
                      )}
                    </>
                  ),
                  release_date: obj.release_date,
                  data_release: obj.data_release,
                })),
            }}
          />
        </div>
      )}
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
