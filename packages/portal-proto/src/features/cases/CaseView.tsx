import React, { PropsWithChildren } from "react";
import { Image } from "@/components/Image";
import ReactModal from "react-modal";
import { Case } from "../user-flow/all-apps/baseExploration";

export interface CaseViewProps {
  readonly patient?: Case;
}

export const CaseView: React.FC<CaseViewProps> = ({
  patient,
}: PropsWithChildren<CaseViewProps>) => {
  // TODO either use or remove the prop
  console.log(patient);
  return (
    <div>
      <Image
        src="/user-flow/single-case.png"
        layout="responsive"
        width="2259"
        height="5422"
      />
    </div>
  );
};

export interface CaseModalProps {
  readonly isOpen: boolean;
  readonly closeModal: () => void;
  readonly patient?: Case;
}

export const CaseModal: React.FC<CaseModalProps> = (props: CaseModalProps) => {
  const { isOpen, closeModal, patient } = props;

  return (
    <ReactModal isOpen={isOpen} onRequestClose={closeModal}>
      <CaseView patient={patient} />
    </ReactModal>
  );
};
