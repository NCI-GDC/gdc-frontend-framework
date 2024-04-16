import React, { useState } from "react";
import { useDeepCompareCallback } from "use-deep-compare";
import {
  GdcFile,
  HistoryDefaults,
  useCoreSelector,
  selectCart,
  Modals,
  selectCurrentModal,
} from "@gff/core";
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
import { BAMSlicingModal } from "@/components/Modals/BAMSlicingModal/BAMSlicingModal";
import { NoAccessToProjectModal } from "@/components/Modals/NoAccessToProjectModal";
import { BAMSlicingButton } from "@/features/files/BAMSlicingButton";
import { DownloadFile } from "@/components/DownloadButtons";
import { AgreementModal } from "@/components/Modals/AgreementModal";
import { fileInCart } from "src/utils";
import { GeneralErrorModal } from "@/components/Modals/GeneraErrorModal";
import { HeaderTitle } from "@/components/tailwindComponents";
import { SummaryCard } from "@/components/Summary/SummaryCard";
import { SummaryHeader } from "@/components/Summary/SummaryHeader";
import GenericLink from "@/components/GenericLink";
import AssociatedCB from "./AssociatedCB";
import DownstreamAnalyses from "./DownstreamAnalyses";
import AnalysisInputFiles from "./AnalysisInput";
import ReadGroups from "./ReadGroups";
import FileVersions from "./FileVersions";
import AnnnotationsTable from "./AnnotationsTable";

interface LeftSideElementForHeaderProps {
  readonly isFileInCart: boolean;
  readonly file: GdcFile;
  readonly bamActive: boolean;
  readonly setFileToDownload: React.Dispatch<React.SetStateAction<GdcFile>>;
}

const LeftSideElementForHeader: React.FC<LeftSideElementForHeaderProps> = ({
  isFileInCart,
  file,
  bamActive,
  setFileToDownload,
}: LeftSideElementForHeaderProps) => (
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
      customDataTestID="button-download-file-summary"
      inactiveText="Download"
      activeText="Processing"
      file={file}
      displayVariant="header"
      setfileToDownload={setFileToDownload}
    />
  </div>
);

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

export const FileView: React.FC<FileViewProps> = ({
  file,
  fileHistory,
  isModal,
}: FileViewProps) => {
  const currentCart = useCoreSelector((state) => selectCart(state));
  const modal = useCoreSelector((state) => selectCurrentModal(state));
  const [bamActive, setBamActive] = useState(false);
  const [fileToDownload, setFileToDownload] = useState(file);
  const isFileInCart = fileInCart(currentCart, file.file_id);

  const formatDataForFileProperties = useDeepCompareCallback(
    () =>
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
      ]),
    [file],
  );

  const formatDataForDataInformation = useDeepCompareCallback(
    () =>
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
      ]),
    [file],
  );

  const formatDataForAnalysis = useDeepCompareCallback(
    () =>
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
      ]),
    [file],
  );

  return (
    <>
      <SummaryHeader
        iconText="fl"
        headerTitle={file.file_name}
        isModal={isModal}
        leftElement={
          <LeftSideElementForHeader
            file={file}
            isFileInCart={isFileInCart}
            bamActive={bamActive}
            setFileToDownload={setFileToDownload}
          />
        }
        isFile={true}
      />
      <div className={`${!isModal ? "mt-40" : "mt-4"} mx-4`}>
        <div className="flex gap-8">
          <div className="flex-1">
            <SummaryCard
              customDataTestID="table-file-properties-file-summary"
              title="File Properties"
              tableData={formatDataForFileProperties()}
            />
          </div>
          <div className="flex-1">
            <SummaryCard
              customDataTestID="table-data-information-file-summary"
              tableData={formatDataForDataInformation()}
              title="Data Information"
            />
          </div>
        </div>

        {get(file, "data_type") === "Slide Image" && (
          <DivWithMargin data-testid="table-slide-image-file-summary">
            <HeaderTitle>Slide Image Viewer</HeaderTitle>
            <ImageViewer
              imageId={file?.file_id}
              tableData={parseSlideDetailsInfo(file)}
            />
          </DivWithMargin>
        )}
        <DivWithMargin data-testid="table-associated-cases-biospecimens-file-summary">
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
                  customDataTestID="table-analysis-file-summary"
                  title="Analysis"
                  tableData={formatDataForAnalysis()}
                />
              </div>
              <div className="flex-1">
                <SummaryCard
                  customDataTestID="table-reference-genome-file-summary"
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
                <AnalysisInputFiles
                  inputFiles={file.analysis.input_files}
                  currentCart={currentCart}
                  setFileToDownload={setFileToDownload}
                />
              </DivWithMargin>
            )}

            {file?.analysis?.metadata && (
              <DivWithMargin data-testid="table-read-groups-file-summary">
                <HeaderTitle>Read Groups</HeaderTitle>

                <ReadGroups readGroups={file?.analysis.metadata.read_groups} />
              </DivWithMargin>
            )}
          </>
        )}
        {file?.downstream_analyses?.some(
          (byWorkflowType) => byWorkflowType?.output_files?.length > 0,
        ) && (
          <DivWithMargin data-testid="table-downstream-analyses-files-file-summary">
            <HeaderTitle>Downstream Analyses Files</HeaderTitle>
            <DownstreamAnalyses
              downstream_analyses={file?.downstream_analyses}
              currentCart={currentCart}
              setFileToDownload={setFileToDownload}
            />
          </DivWithMargin>
        )}
        <FileVersions fileHistory={fileHistory} file_id={file.file_id} />
        {file?.annotations?.length > 0 && (
          <div
            className={`mb-16 ${isModal ? "scroll-mt-36" : "scroll-mt-72"}`}
            id="annotations"
          >
            <AnnnotationsTable annotations={file.annotations} />
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
