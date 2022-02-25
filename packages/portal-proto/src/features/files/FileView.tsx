import React from "react";
import { GdcFile } from "@gff/core";
import ReactModal from "react-modal";
import { HorizontalTable, HorizontalTableProps } from "../../components/HorizontalTable";
import {get} from 'lodash';

export interface FileViewProps {
  readonly file?: GdcFile;
}

export const FileView: React.FC<FileViewProps> = ({ file }: FileViewProps) => {
  const formatDataForTable = (headersConfig:ReadonlyArray<{
    readonly field: string;
    readonly name: string;
  }>): HorizontalTableProps["tableData"] => {
    //match headers with available properties
    return headersConfig.reduce((output, obj)=>{
      const value = get(file, obj.field);
      output.push({
        headerName: obj.name,
        values: [value?value:'--']
      });
      return output;
    }, []);
  };
  return (
    <div className="flex text-nci-gray">
      <div className="flex-auto bg-white mr-4">
        <h2 className="p-2 text-lg mx-4">File Properties</h2>
        <HorizontalTable tableData={formatDataForTable([
            {
              "field": "fileName",
              "name": "Name"
            },{
              "field": "access",
              "name": "Access"
            },{
              "field": "id",
              "name": "UUID"
            },{
              "field": "dataFormat",
              "name": "Data Format"
            },{
              "field": "fileSize",
              "name": "Size"
            },{
              "field": "md5sum",
              "name": "MD5 Checksum"
            },{
              "field": "state",
              "name": "State"
            },{
              "field": "project_id",
              "name": "Project"
            }
          ])}
        />
      </div>
      <div className="w-1/3 bg-white h-full">
        <h2 className="p-2 text-lg mx-4">Data Information</h2>
        <HorizontalTable tableData={formatDataForTable([
            {
              "field": "dataCategory",
              "name": "Data Category"
            },{
              "field": "dataType",
              "name": "Data Type"
            },{
              "field": "experimentalStrategy",
              "name": "Experimental Strategy"
            },{
              "field": "platform",
              "name": "Platform"
            }
          ])}
        />
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
