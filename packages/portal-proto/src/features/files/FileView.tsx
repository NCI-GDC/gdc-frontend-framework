import React, { useMemo, useState } from "react";
import {
  GdcFile,
  GdcCartFile,
  HistoryDefaults,
  useCoreSelector,
  selectCart,
  Modals,
  selectCurrentModal,
} from "@gff/core";
import ReactModal from "react-modal";
import { get } from "lodash";
import dynamic from "next/dynamic";
import fileSize from "filesize";
import tw from "tailwind-styled-components";
import { AddToCartButton, RemoveFromCartButton } from "../cart/updateCart";
import {
  formatDataForHorizontalTable,
  mapGdcFileToCartFile,
  parseSlideDetailsInfo,
} from "./utils";
import Link from "next/link";
import { BAMSlicingModal } from "@/components/Modals/BAMSlicingModal/BAMSlicingModal";
import { NoAccessToProjectModal } from "@/components/Modals/NoAccessToProjectModal";
import { BAMSlicingButton } from "@/features/files/BAMSlicingButton";
import { DownloadFile } from "@/components/DownloadButtons";
import { AgreementModal } from "@/components/Modals/AgreementModal";
import { SummaryErrorHeader } from "@/components/Summary/SummaryErrorHeader";
import { fileInCart } from "src/utils";
import { GeneralErrorModal } from "@/components/Modals/GeneraErrorModal";
import { TableActionButtons } from "@/components/TableActionButtons";
import saveAs from "file-saver";
import {
  VerticalTable,
  HandleChangeInput,
} from "@/features/shared/VerticalTable";
import useStandardPagination from "@/hooks/useStandardPagination";
import { HeaderTitle } from "../shared/tailwindComponents";
import { BasicTable } from "@/components/Tables/BasicTable";
import { SummaryCard } from "@/components/Summary/SummaryCard";
import { SummaryHeader } from "@/components/Summary/SummaryHeader";
import { DropdownWithIcon } from "@/components/DropdownWithIcon/DropdownWithIcon";
import { FiDownload as DownloadIcon } from "react-icons/fi";

export const StyledButton = tw.button`
bg-base-lightest
border
border-base-darkest
rounded
p-1
hover:bg-base-darkest
hover:text-base-contrast-darkest
`;

const ImageViewer = dynamic(
  () => import("../../components/ImageViewer/ImageViewer"),
  {
    ssr: false,
  },
);

export interface FileViewProps {
  readonly file?: GdcFile;
  readonly fileHistory?: HistoryDefaults[];
  readonly isModal?: boolean;
}

const DivWithMargin = tw.div`mt-14`;

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

const AssociatedCB = ({
  cases,
  associated_entities,
}: {
  cases: GdcFile["cases"];
  associated_entities: GdcFile["associated_entities"];
}): JSX.Element => {
  const [associatedCBSearchTerm, setAssociatedCBSearchTerm] = useState("");

  const data = useMemo(() => {
    const tableRows = [];

    associated_entities?.forEach((entity) => {
      // find matching id from cases
      const caseData = cases?.find(
        (caseObj) => caseObj.case_id === entity.case_id,
      );

      // get sample_type from casedata through matching its submitter_id
      const sample_type =
        caseData?.samples?.find((sample) => {
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
        })?.sample_type || "--";

      let entityQuery;
      if (entity.entity_type !== "case") {
        entityQuery = { bioId: entity.entity_id };
      }

      const url =
        caseData !== undefined
          ? getAnnotationsLinkParams(caseData?.annotations, caseData.case_id)
          : undefined;

      const annotationsLink = url ? (
        <Link href={url} passHref>
          <a className="text-utility-link underline" target={"_blank"}>
            {caseData.annotations.length}
          </a>
        </Link>
      ) : (
        0
      );

      if (
        caseData?.submitter_id &&
        (associatedCBSearchTerm === "" ||
          entity.entity_submitter_id
            .toLowerCase()
            .includes(associatedCBSearchTerm.toLowerCase()) ||
          caseData?.submitter_id
            .toLowerCase()
            .includes(associatedCBSearchTerm.toLowerCase()))
      ) {
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
              text={caseData?.submitter_id}
            />
          ),
          annotations: annotationsLink,
        });
      }
    });

    return tableRows;
  }, [associatedCBSearchTerm, associated_entities, cases]);

  const {
    handlePageChange,
    handlePageSizeChange,
    page,
    pages,
    size,
    from,
    total,
    displayedData,
  } = useStandardPagination(data);

  const handleChange = (obj: HandleChangeInput) => {
    switch (Object.keys(obj)?.[0]) {
      case "newPageSize":
        handlePageSizeChange(obj.newPageSize);
        break;
      case "newPageNumber":
        handlePageChange(obj.newPageNumber);
        break;
      case "newSearch":
        setAssociatedCBSearchTerm(obj.newSearch);
        break;
    }
  };

  const columnListOrder = [
    { id: "entity_id", columnName: "Entity ID", visible: true },
    { id: "entity_type", columnName: "Entity Type", visible: true },
    { id: "sample_type", columnName: "Sample Type", visible: true },
    { id: "case_id", columnName: "Case ID", visible: true },
    { id: "annotations", columnName: "Annotations", visible: true },
  ];

  return (
    <VerticalTable
      tableData={displayedData}
      columns={columnListOrder}
      selectableRow={false}
      showControls={false}
      pagination={{
        page,
        pages,
        size,
        from,
        total,
        label: "associated cases/biospecimen",
      }}
      status={"fulfilled"}
      search={{
        enabled: true,
      }}
      additionalControls={
        <div className="mt-3.5">
          <HeaderTitle>Associated Cases/Biospecimens</HeaderTitle>
        </div>
      }
      handleChange={handleChange}
    />
  );
};

export const FileView: React.FC<FileViewProps> = ({
  file,
  fileHistory,
  isModal,
}: FileViewProps) => {
  const currentCart = useCoreSelector((state) => selectCart(state));
  const modal = useCoreSelector((state) => selectCurrentModal(state));
  const [bamActive, setBamActive] = useState(false);
  const [fileToDownload, setfileToDownload] = useState(file);
  const sortedFileHistory = useMemo(
    () =>
      [...(fileHistory ?? [])].sort(
        (a, b) =>
          //sort based on relese number biggest at top
          Number.parseFloat(a.version) - Number.parseFloat(b.version),
      ),
    [fileHistory],
  );

  const handleDownloadTSV = () => {
    const header = ["Version", "File UUID", "Release Date", "Release Number"];

    const body = sortedFileHistory
      .map((obj, index, { length }) =>
        [
          obj.version,
          `${obj.uuid}${index + 1 === length ? " Current Version" : ""}`,
          obj.release_date,
          obj.data_release,
        ].join("\t"),
      )
      .join("\n");

    const tsv = [header.join("\t"), body].join("\n");
    const blob = new Blob([tsv], { type: "text/csv" });

    saveAs(blob, `file-history-${file.file_id}.tsv`);
  };

  const isFileInCart = fileInCart(currentCart, file.file_id);

  const DownstreamAnalyses = ({
    downstream_analyses,
  }: {
    downstream_analyses: GdcFile["downstream_analyses"];
  }): JSX.Element => {
    const tableRows = [];
    downstream_analyses?.forEach((byWorkflowType) => {
      const workflowType = byWorkflowType?.workflow_type;
      byWorkflowType?.output_files?.forEach((outputFile) => {
        const isOutputFileInCart = fileInCart(currentCart, outputFile.file_id);
        const mappedFileObj = mapGdcFileToCartFile([outputFile]);
        tableRows.push({
          file_name: (
            <GenericLink
              path={`/files/${outputFile.file_id}`}
              text={outputFile.file_name}
            />
          ),
          data_category: outputFile.data_category,
          data_type: outputFile.data_type,
          data_format: outputFile.data_format,
          workflow_type: workflowType,
          file_size: fileSize(outputFile.file_size),
          action: (
            <TableActionButtons
              isOutputFileInCart={isOutputFileInCart}
              file={mappedFileObj}
              downloadFile={outputFile}
              setFileToDownload={setfileToDownload}
            />
          ),
        });
      });
    });

    const formattedTableData = {
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
    return <BasicTable tableData={formattedTableData} />;
  };

  const downloadVersionJSON = () => {
    const jsonData = JSON.stringify([...fileHistory], null, 2);
    const currentDate = new Date().toJSON().slice(0, 10);

    saveAs(
      new Blob([jsonData], {
        type: "application/json",
      }),
      `${file.file_id}_history.${currentDate}.json`,
    );
  };

  const formatDataForFileProperties = () =>
    formatDataForHorizontalTable(file, [
      {
        field: "file_name",
        name: "Name",
        modifier: (v) => <span className="break-all">{v}</span>,
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
        field: "data_format",
        name: "Data Format",
      },
      {
        field: "file_size",
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
        modifier: (v) => <GenericLink path={`/projects/${v}`} text={v} />,
      },
    ]);

  const formatDataForDataInformation = () =>
    formatDataForHorizontalTable(file, [
      {
        field: "data_category",
        name: "Data Category",
      },
      {
        field: "data_type",
        name: "Data Type",
      },
      {
        field: "experimental_strategy",
        name: "Experimental Strategy",
      },
      {
        field: "platform",
        name: "Platform",
      },
    ]);

  const formatDataForAnalysis = () =>
    formatDataForHorizontalTable(file, [
      {
        field: "analysis.workflow_type",
        name: "Workflow Type",
      },
      {
        field: "analysis.updated_datetime",
        name: "Workflow Completion Date",
        modifier: (v) => v.split("T")[0],
      },
    ]);

  const LeftSideElementForHeader = () => (
    <div className="flex gap-4">
      {!isFileInCart ? (
        <AddToCartButton files={mapGdcFileToCartFile([file])} />
      ) : (
        <RemoveFromCartButton files={mapGdcFileToCartFile([file])} />
      )}
      {file.data_format === "BAM" &&
        file.data_type === "Aligned Reads" &&
        file?.index_files?.length > 0 && (
          <BAMSlicingButton isActive={bamActive} file={file} />
        )}

      <DownloadFile
        inactiveText="Download"
        activeText="Processing"
        file={file}
        customStyle="text-primary bg-base-max hover:bg-primary-darkest hover:text-base-max font-medium text-sm"
        setfileToDownload={setfileToDownload}
      />
    </div>
  );

  const AnalysisInputFiles = ({
    inputFiles,
  }: {
    inputFiles: GdcCartFile[];
  }): JSX.Element => {
    const data = useMemo(() => {
      return inputFiles.map((ipFile) => ({
        file_name: (
          <GenericLink
            path={`/files/${ipFile.file_id}`}
            text={ipFile.file_name}
          />
        ),
        data_category: ipFile.data_category,
        data_type: ipFile.data_type,
        data_format: ipFile.data_format,
        file_size: fileSize(ipFile.file_size),
        action: (
          <TableActionButtons
            isOutputFileInCart={fileInCart(currentCart, ipFile.file_id)}
            file={mapGdcFileToCartFile([ipFile])}
            downloadFile={ipFile}
            setFileToDownload={setfileToDownload}
          />
        ),
      }));
    }, [inputFiles]);

    const columnListOrder = [
      { id: "file_name", columnName: "File Name", visible: true },
      { id: "data_category", columnName: "Data Category", visible: true },
      { id: "data_type", columnName: "Data Type", visible: true },
      { id: "data_format", columnName: "Data Format", visible: true },
      { id: "file_size", columnName: "Size", visible: true },
      { id: "action", columnName: "Action", visible: true },
    ];

    return (
      <VerticalTable
        tableData={data}
        columns={columnListOrder}
        selectableRow={false}
        showControls={false}
        additionalControls={
          <div className="mt-3.5">
            <HeaderTitle>Source Files</HeaderTitle>
          </div>
        }
      />
    );
  };

  return (
    <>
      <SummaryHeader
        iconText="fl"
        headerTitle={file.file_name}
        isModal={isModal}
        leftElement={<LeftSideElementForHeader />}
        isFile={true}
      />
      <div className={`${!isModal ? "mt-40" : "mt-4"} mx-4`}>
        <div className="flex gap-8">
          <div className="flex-1">
            <SummaryCard
              title="File Properties"
              tableData={formatDataForFileProperties()}
            />
          </div>
          <div className="flex-1">
            <SummaryCard
              tableData={formatDataForDataInformation()}
              title="Data Information"
            />
          </div>
        </div>

        {get(file, "data_type") === "Slide Image" && (
          <DivWithMargin>
            <HeaderTitle>Slide Image Viewer</HeaderTitle>
            <ImageViewer
              imageId={file?.file_id}
              tableData={parseSlideDetailsInfo(file)}
            />
          </DivWithMargin>
        )}
        <DivWithMargin>
          {file?.associated_entities?.length > 0 ? (
            <AssociatedCB
              cases={file?.cases}
              associated_entities={file?.associated_entities}
            />
          ) : (
            <>
              <div className="mt-3.5">
                <HeaderTitle>Associated Cases/Biospecimens</HeaderTitle>
              </div>
              <h3 className="p-2 mx-4 text-primary-content-darker">
                No cases or biospecimen found.
              </h3>
            </>
          )}
        </DivWithMargin>

        {file?.analysis && (
          <>
            <div className="mt-14 flex gap-8">
              <div className="flex-1">
                <SummaryCard
                  title="Analysis"
                  tableData={formatDataForAnalysis()}
                />
              </div>
              <div className="flex-1">
                <SummaryCard
                  title="Reference Genome"
                  tableData={[
                    { headerName: "Genome Build	", values: ["GRCh38.p0"] },
                    { headerName: "Genome Name	", values: ["GRCh38.d1.vd1"] },
                  ]}
                />
              </div>
            </div>
            {file?.analysis?.input_files?.length > 0 && (
              <DivWithMargin>
                <AnalysisInputFiles inputFiles={file.analysis.input_files} />
              </DivWithMargin>
            )}

            {file?.analysis?.metadata && (
              <DivWithMargin>
                <HeaderTitle>Read Groups</HeaderTitle>
                <BasicTable
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
              </DivWithMargin>
            )}
          </>
        )}
        {file?.downstream_analyses?.some(
          (byWorkflowType) => byWorkflowType?.output_files?.length > 0,
        ) && (
          <DivWithMargin>
            <HeaderTitle>Downstream Analyses Files</HeaderTitle>
            <DownstreamAnalyses
              downstream_analyses={file?.downstream_analyses}
            />
          </DivWithMargin>
        )}

        {fileHistory && (
          <div className="mb-16">
            <DivWithMargin>
              <HeaderTitle>File Versions</HeaderTitle>
              <div className="mb-2">
                <DropdownWithIcon
                  dropdownElements={[
                    {
                      title: "TSV",
                      icon: (
                        <DownloadIcon size={16} aria-label="download icon" />
                      ),
                      onClick: handleDownloadTSV,
                    },
                    {
                      title: "JSON",
                      icon: (
                        <DownloadIcon size={16} aria-label="download icon" />
                      ),
                      onClick: downloadVersionJSON,
                    },
                  ]}
                  TargetButtonChildren="Download"
                  LeftIcon={
                    <DownloadIcon size="1rem" aria-label="download icon" />
                  }
                />
              </div>
              <BasicTable
                tableData={{
                  headers: [
                    "Version",
                    "File UUID",
                    "Release Date",
                    "Release Number",
                  ],
                  tableRows: sortedFileHistory.map(
                    (obj, index, { length }) => ({
                      version: obj.version,
                      file_id: (
                        <>
                          {obj.uuid}
                          {index + 1 === length && (
                            <span className="inline-block ml-2 border rounded-full bg-primary-darker text-base-max font-bold text-xs py-0.5 px-1">
                              Current Version
                            </span>
                          )}
                        </>
                      ),
                      release_date: obj.release_date,
                      data_release: obj.data_release,
                    }),
                  ),
                }}
              />
            </DivWithMargin>
          </div>
        )}
        {modal === Modals.NoAccessToProjectModal && (
          <NoAccessToProjectModal openModal />
        )}
        {modal === Modals.BAMSlicingModal && (
          <BAMSlicingModal openModal file={file} setActive={setBamActive} />
        )}

        {modal === Modals.GeneralErrorModal && <GeneralErrorModal openModal />}

        {modal === Modals.AgreementModal && (
          <AgreementModal
            openModal
            file={fileToDownload}
            dbGapList={fileToDownload.acl}
          />
        )}
      </div>
    </>
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
      {file?.file_id ? (
        <FileView file={file} fileHistory={fileHistory} />
      ) : (
        <SummaryErrorHeader label="File Not Found" />
      )}
    </ReactModal>
  );
};
