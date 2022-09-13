import React, { useState } from "react";
import {
  GdcFile,
  HistoryDefaults,
  useCoreDispatch,
  useCoreSelector,
  selectCart,
  Modals,
  selectCurrentModal,
} from "@gff/core";
import ReactModal from "react-modal";
import { HorizontalTable } from "@/components/HorizontalTable";
import { Table, Button } from "@mantine/core";
import { FaShoppingCart, FaDownload } from "react-icons/fa";
import { get } from "lodash";
import dynamic from "next/dynamic";
import fileSize from "filesize";
import tw from "tailwind-styled-components";
import { AddToCartButton } from "../cart/updateCart";
import {
  formatDataForHorizontalTable,
  mapGdcFileToCartFile,
  parseSlideDetailsInfo,
} from "./utils";
import Link from "next/link";
import { SummaryErrorHeader } from "@/components/Summary/SummaryErrorHeader";
import { allFilesInCart } from "src/utils";
import { addToCart, removeFromCart } from "@/features/cart/updateCart";
import { BAMSlicingModal } from "@/components/Modals/BAMSlicingModal/BAMSlicingModal";
import { BAMSlicingErrorModal } from "@/components/Modals/BAMSlicingModal/BAMSlicingErrorModal";
import { NoAccessToProjectModal } from "@/components/Modals/NoAccessToProjectModal";
import { BAMSlicingButton } from "@/features/files/BAMSlicingButton";
import { DownloadFile } from "@/components/DownloadButtons";
import { AgreementModal } from "@/components/Modals/AgreementModal";
// import { DownloadButton } from "@/components/DownloadButtons";

export const StyledButton = tw.button`
bg-base-lightest
border
border-base-darkest
rounded
p-1
hover:bg-base-darkest
hover:text-base-contrast-darkest
`;

const ImageViewer = dynamic(() => import("../../components/ImageViewer"), {
  ssr: false,
});

export interface FileViewProps {
  readonly file?: GdcFile;
  readonly fileHistory?: HistoryDefaults[];
}

const FullWidthDiv = tw.div`
bg-base-lightest w-full mt-4
`;

const TitleText = tw.h2`
text-lg font-bold mx-4 ml-2
`;

//temp table compoent untill global one is done
interface TempTableProps {
  readonly tableData: {
    readonly headers: string[];
    readonly tableRows: any[];
  };
}

export const TempTable = ({ tableData }: TempTableProps): JSX.Element => {
  if (!(tableData?.headers?.length > 0 && tableData?.tableRows?.length > 0)) {
    console.error("bad table data", tableData);
    return <></>;
  }
  return (
    <Table striped>
      <thead>
        <tr>
          {tableData.headers.map((text, index) => (
            <th key={index} className="bg-base-lighter">
              {text}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tableData.tableRows.map((row, index) => (
          <tr
            key={index}
            className={
              index % 2 ? "bg-base-lightest" : "bg-accent-warm-lightest"
            }
          >
            {Object.values(row).map((item, index) => (
              <td key={index} className="text-sm p-1 pl-2.5">
                {typeof item === "undefined" ? "--" : item}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export const FileView: React.FC<FileViewProps> = ({
  file,
  fileHistory,
}: FileViewProps) => {
  const currentCart = useCoreSelector((state) => selectCart(state));
  const dispatch = useCoreDispatch();

  const [imageId] = useState(file?.fileId);
  const modal = useCoreSelector((state) => selectCurrentModal(state));

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
        <a className="text-utility-link underline text-sm">{text}</a>
      </Link>
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
        // const isFileInCart = allFilesInCart(currentCart, [obj]);
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
            <div className="flex gap-3">
              <StyledButton
                onClick={() => {
                  addToCart([file], currentCart, dispatch);
                }}
              >
                <FaShoppingCart title="Add to Cart" />
              </StyledButton>

              <StyledButton>
                <FaDownload title="Download" />
              </StyledButton>
            </div>
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

  const getAnnotationsLinkParams = (
    annotations: readonly string[],
    case_id: string,
  ) => {
    if (!annotations) return null;

    if (annotations.length === 1) {
      return `https://portal.gdc.cancer.gov/annotations/${annotations[0]}`;
    }
    return `https://portal.gdc.cancer.gov/annotations?filters={"content":[{"content":{"field":"annotations.entity_id","value":["${case_id}"]},"op":"in"}],"op":"and"}`;
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
        entityQuery = { bioId: entity.entity_id };
      }

      const url = getAnnotationsLinkParams(
        caseData?.annotations,
        caseData.case_id,
      );

      const annotationsLink = url ? (
        <Link href={url} passHref>
          <a className="text-utility-link underline" target={"_blank"}>
            {caseData.annotations.length}
          </a>
        </Link>
      ) : (
        0
      );

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

  const [bamActive, setBamActive] = useState(false);

  return (
    <div className="p-4 text-primary-content w-10/12 mt-20 m-auto">
      <div className="flex justify-end pb-5 gap-2">
        <AddToCartButton files={[file]} />
        {file.dataFormat === "BAM" &&
          file.dataType === "Aligned Reads" &&
          file?.index_files?.length > 0 && (
            <BAMSlicingButton isActive={bamActive} file={file} />
          )}

        <DownloadFile inactiveText="Download" file={file} />
      </div>
      <div className="flex">
        <div className="flex-auto bg-base-lightest mr-4">
          <TitleText>File Properties</TitleText>
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
        <div className="w-1/3 bg-base-lightest h-full">
          <TitleText>Data Information</TitleText>
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
        <FullWidthDiv>
          <TitleText>Slide Image Viewer</TitleText>
          <ImageViewer
            imageId={imageId}
            tableData={parseSlideDetailsInfo(file)}
          />
        </FullWidthDiv>
      )}
      <FullWidthDiv>
        <TitleText>Associated Cases/Biospecimens</TitleText>
        {file?.associated_entities?.length > 0 ? (
          <AssociatedCB
            cases={file?.cases}
            associated_entities={file?.associated_entities}
          />
        ) : (
          <h3 className="p-2 mx-4 text-primary-content-darker">
            No cases or biospecimen found.
          </h3>
        )}
      </FullWidthDiv>
      {file?.analysis && (
        <>
          <div className="bg-grey mt-4 flex gap-10">
            <div className="flex-1 bg-base-lightest">
              <TitleText>Analysis</TitleText>
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
            <div className="flex-1 bg-base-lightest">
              <TitleText>Reference Genome</TitleText>
              <HorizontalTable
                tableData={[
                  { headerName: "Genome Build	", values: ["GRCh38.p0"] },
                  { headerName: "Genome Name	", values: ["GRCh38.d1.vd1"] },
                ]}
              />
            </div>
          </div>
          {file?.analysis?.metadata && (
            <FullWidthDiv>
              <TitleText>Read Groups</TitleText>
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
                      is_paired_end: read_group.is_paired_end
                        ? "true"
                        : "false",
                      read_length: read_group.read_length ?? "--",
                      library_name: read_group.library_name ?? "--",
                      sequencing_center: read_group.sequencing_center ?? "--",
                      sequencing_date: read_group.sequencing_date ?? "--",
                    }),
                  ),
                }}
              />
            </FullWidthDiv>
          )}
        </>
      )}
      {file?.downstream_analyses?.some(
        (byWorkflowType) => byWorkflowType?.output_files?.length > 0,
      ) && (
        <FullWidthDiv>
          <TitleText>Downstream Analyses Files</TitleText>
          <DownstreamAnalyses downstream_analyses={file?.downstream_analyses} />
        </FullWidthDiv>
      )}

      {fileHistory && (
        <FullWidthDiv>
          <TitleText className="float-left mt-3">File Versions</TitleText>
          <div className="float-right my-2 mr-3">
            <Button
              color={"base"}
              className="mr-2 text-primary-contrast bg-primary hover:bg-primary-darker hover:text-primary-contrast-darker"
            >
              <FaDownload className="mr-2" /> Download JSON
            </Button>
            <Button
              color={"base"}
              className="text-primary-contrast bg-primary hover:bg-primary-darker hover:text-primary-contrast-darker"
            >
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
                        <span className="inline-block ml-2 border rounded-full bg-primary-darker text-white font-bold text-xs py-0.5 px-1">
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
        </FullWidthDiv>
      )}
      {modal === Modals.NoAccessToProjectModal && (
        <NoAccessToProjectModal openModal />
      )}
      {modal === Modals.BAMSlicingModal && (
        <BAMSlicingModal openModal file={file} setActive={setBamActive} />
      )}

      {modal === Modals.BAMSlicingErrorModal && (
        <BAMSlicingErrorModal openModal />
      )}

      {modal === Modals.AgreementModal && (
        <AgreementModal openModal file={file} dbGapList={file.acl} />
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
        <SummaryErrorHeader label="File Not Found" />
      )}
    </ReactModal>
  );
};
