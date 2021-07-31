import React, { PropsWithChildren } from "react";
import { Button, Card, Graph } from "../../layout/UserFlowVariedPages";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import classNames from "classnames";
import Image from "next/image";
import ReactModal from "react-modal";
import { CasesTable } from "../common";

export type CohortManagerProps = Partial<ModalOrExpandProps> &
  Partial<CohortBuilderModalProps>;

export const CohortManager: React.FC<CohortManagerProps> = ({
  mode = { value: "" },
  setIsModalOpen = () => {
    return;
  },
  isExpanded = false,
  setIsExpanded = () => {
    return;
  },
  isOpen = false,
  closeModal = () => {
    return;
  },
}: PropsWithChildren<CohortManagerProps>) => {
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-row gap-x-4 items-center">
        <select name="currentCohort" id="current-cohort-select">
          <option value="ALL_GDC">All GDC Cases</option>
          <option value="TCGA-BRCA">TCGA BRCA</option>
        </select>
        <div className="h-10 w-10">
          <Card />
        </div>
        <div className="h-10 w-10">
          <Card />
        </div>
        <div className="h-10 w-10">
          <Card />
        </div>
        <div className="flex-grow"></div>
        <div>
          <Button>2,345 Cases</Button>
        </div>
        <ModalOrExpand
          mode={mode}
          setIsModalOpen={setIsModalOpen}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
        />
      </div>
      <CohortBuilderModal isOpen={isOpen} closeModal={closeModal} />
      <CollapsibleCohortBuilder isCollapsed={!isExpanded} />
    </div>
  );
};

interface CollapsibleCohortBuilderProps {
  readonly isCollapsed: boolean;
}

const CollapsibleCohortBuilder: React.FC<CollapsibleCohortBuilderProps> = ({
  isCollapsed,
}: CollapsibleCohortBuilderProps) => {
  return <CohortBuilder show={!isCollapsed} />;
};

export interface CohortBuilderProps {
  readonly show?: boolean;
}

export const CohortBuilder: React.FC<CohortBuilderProps> = ({
  show = true,
}: CohortBuilderProps) => {
  return (
    <div
      className={classNames("flex-col gap-y-4 overflow-y-auto", {
        hidden: !show,
        flex: show,
      })}
    >
      <div className="">
        <Image
          src="/user-flow/cohort-builder-mock-up.png"
          layout="responsive"
          width="100%"
          height="100%"
        ></Image>
      </div>
      <div className="pt-4">
        <Tabs>
          <TabList>
            <Tab>Summary</Tab>
            <Tab>Cases</Tab>
          </TabList>

          <TabPanel>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 p-4 gap-4 bg-gray-100">
              <Graph />
              <Graph />
              <Graph />
              <Graph />
              <Graph />
              <Graph />
            </div>
          </TabPanel>
          <TabPanel>
            <Cases />
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

interface ModalOrExpandProps {
  readonly mode: {
    readonly value: string;
  };
  readonly setIsModalOpen: (boolean) => void;
  readonly isExpanded: boolean;
  readonly setIsExpanded: (boolean) => void;
}

export const ModalOrExpand: React.FC<ModalOrExpandProps> = (
  props: ModalOrExpandProps,
) => {
  const { mode, setIsModalOpen, isExpanded, setIsExpanded } = props;
  if (mode.value === "cb-modal") {
    return (
      <Image
        src="/expand-svgrepo-com.svg"
        width="32rem"
        height="32rem"
        onClick={() => setIsModalOpen(true)}
      />
    );
  } else if (mode.value === "cb-expand") {
    // TODO use expand/collapse icons
    if (isExpanded) {
      return <Button onClick={() => setIsExpanded(false)}>^</Button>;
    } else {
      return <Button onClick={() => setIsExpanded(true)}>v</Button>;
    }
  } else {
    return null;
  }
};

interface CohortBuilderModalProps {
  readonly isOpen: boolean;
  readonly closeModal: () => void;
}

const CohortBuilderModal: React.FC<CohortBuilderModalProps> = ({
  isOpen,
  closeModal,
}: CohortBuilderModalProps) => {
  return (
    <ReactModal isOpen={isOpen} onRequestClose={closeModal}>
      <CohortBuilder />
    </ReactModal>
  );
};

const Cases = () => {
  return (
    <div className="overflow-y-auto h-96">
      <CasesTable />
    </div>
  );
};
