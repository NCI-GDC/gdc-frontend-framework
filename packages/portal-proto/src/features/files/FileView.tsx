import React from "react";
import { GdcFile } from "@gff/core";
import ReactModal from "react-modal";
import Image from "next/image";

export interface FileViewProps {
  readonly file?: GdcFile;
}

export const FileView: React.FC<FileViewProps> = ({ file }: FileViewProps) => {
  return (
    <div className="flex flex-col gap-y-4">
      <div className="text-xl font-bold text-gdc-blue-dark">
        {file.fileName}
      </div>
      <div>
        <Image
          src="/user-flow/single-file.png"
          layout="responsive"
          height="1777"
          width="2232"
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
