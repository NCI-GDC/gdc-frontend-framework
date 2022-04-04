import React, { useState } from "react";
import { GdcFile } from "@gff/core";
import ReactModal from "react-modal";
import { HorizontalTable } from "../../components/HorizontalTable";
import { get } from "lodash";
import dynamic from "next/dynamic";
import { formatDataForTable, parseSlideDetailsInfo } from "./utils";
const ImageViewer = dynamic(() => import("../../components/ImageViewer"), {
  ssr: false,
});

export interface FileViewProps {
  readonly file?: GdcFile;
}

export const FileView: React.FC<FileViewProps> = ({ file }: FileViewProps) => {
  const [imageId, setImageId] = useState(file?.fileId);

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

      {/* TODO (Pari): remove the div defined below once the other screen gets made */}
      <div>
        <strong>This is just for trial, Image details wont change as of yet!!!</strong>
        <br />
        <button
          onClick={() => setImageId("f069ce05-03eb-48ac-b974-a4660a4d5de2")}
          className='bg-nci-blue text-white mr-4'
        >
          Change Image 1
        </button>
        <button
          onClick={() => setImageId("6e63430a-4a44-4ba8-a1f9-f24871c8f08a")}
          className='bg-nci-blue text-white'
        >
          Change Image 2
        </button>
      </div>

      {get(file, "dataType") === "Slide Image" ? (
        <div className="bg-white w-full mt-4">
          <h2 className="p-2 text-lg mx-4">Slide Image Viewer</h2>
          {/*TODO Slide Image Viewer see PEAR-167 */}
          <ImageViewer imageId={imageId} tableData={parseSlideDetailsInfo(file)} />
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
        {/*
          
    slide images => slide node
    clinical and biospecimen supplements => cases
    protein expression quantifications => portions
    other molecular files => aliquots




          loop at 
          file?.cases
          also possable loop on samples

          Columns in table (left to right)

          "Entity ID": {entity_submitter_id}

          samples?.[0]?.portions?.[0]?.slides?.[0]?.submitter_id
          submitter_id
          samples?.[0]?.portions?.[0]?.submitter_id
          samples?.[0]?.portions?.[0]?.analytes?.[0]?.aliquots?.[0]?.submitter_id
          
          "Entity Type": {entity_type}
          
          possably check path or need to add

          associated_entities?.entity_type
          same ^^
          same ^^
          same ^^

          "Sample Type": {the biospecimen's (e.g. portion/aliquot) sample_type}. Display "--" if there isn't a sample_type value (e.g. case entities don't have sample_types.)

          samples?.[0]?.sample_type
          none
          samples?.[0]?.sample_type
          samples?.[0]?.sample_type

          "Case UUID": {uuid of the case associated with the entity} [TODO: may change this to case submitter_id instead.]
              is also a link that goes to the case entity page

          file?.cases?.[0]?.case_id
          same ^^
          same ^^
          same ^^

          "Annotations": {num of annotations associated with the entity; if >0, links to annotations browser}

          file?.cases?.[0]?.case_id?.annotations?.length
          same ^^
          same ^^
          same ^^

        */}
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
        {false ? (
          {
            /* Data somthing like 
          downstream_analyses.?[0]?.output_files?.[0]?.[0]?.
        <[
            {
              "field": "file_name",
              "name": "File Name"
            },{
              "field": "data_category",
              "name": "Data Category"
            },{
              "field": "data_type",
              "name": "Data Type"
            },{
              "field": "data_format",
              "name": "Data Format"
            },{
              "field": "downstream_analyses.?[0]?.workflow_type",
              "name": "Analysis Workflow"
            },{
              "field": "file_size",
              "name": "Size"
            }
          ])}
        />*/
          }
        ) : (
          <h3 className="p-2 mx-4 text-nci-gray-darker">
            No Downstream Analysis files found.
          </h3>
        )}
      </div>
      <div className="bg-white w-full mt-4">
        <h2 className="p-2 text-lg mx-4">File Versions</h2>
        {/*[ most likly needs its own api call to history cannot find a file with hmore then one version
            {
              "field": "version",
              "name": "Version"
            },{
              "field": "file_id",
              "name": "File UUID"
            },{
              "field": "-",
              "name": "Current Version"
            },{
              "field": "updated_datetime ??",
              "name": "Release Date"
            },{
              "field": "data_release",
              "name": "Release Number"
            }
          ]*/}
      </div>
    </div>
  );
};

export interface FileModalProps {
  readonly isOpen: boolean;
  readonly closeModal: () => void;
  readonly file: GdcFile;
}

export const FileModal: React.FC<FileModalProps> = ({
  isOpen,
  closeModal,
  file,
}: FileModalProps) => {
  return (
    <ReactModal isOpen={isOpen} onRequestClose={closeModal}>
      <FileView file={file} />
    </ReactModal>
  );
};
