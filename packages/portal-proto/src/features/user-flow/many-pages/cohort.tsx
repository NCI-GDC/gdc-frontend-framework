import React, { PropsWithChildren, useState } from "react";
import {
  Button,
  CardPlaceholder,
} from "../../layout/UserFlowVariedPages";
import {
  MdClose as ClearIcon,
  MdSettings as SettingsIcon,
  MdEdit as EditIcon,
  MdSave as SaveIcon,
  MdAdd as AddIcon,
  MdDelete as DeleteIcon,
  MdFileUpload as UploadIcon,
  MdFileDownload as DownloadIcon,
  MdArrowDropDown as DropDownIcon,
  MdExpandMore as ExpandMoreIcon,
  MdExpandLess as ExpandLessIcon,
} from "react-icons/md"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import classNames from "classnames";
import Image from "next/image";
import ReactModal from "react-modal";
import { Select } from "../../../components/Select";
import { ContextualCasesView } from "../../cases/CasesView";
import { ContextualFilesView } from "../../files/FilesView";
import { CohortGroup, SummaryCharts } from "../../cohortBuilder/CohortGroup";
import { MetaSearch} from "../../cohortBuilder/MetaSearch";
import { CohortTabbedFacets } from "../../cohortBuilder/FacetGroup";

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
  const [showCases, setShowCases] = useState(false);
  const [showFiles, setShowFiles] = useState(false);


  const cohortOptions = [
    { value: "custom-cohort-1", label: "New Custom Cohort" },
    { value: "all-gdc", label: "All GDC Cases" },
  ];

  const COHORTS = [
    { name: 'New Custom Cohort',
      facets : [  ],
      case_count: "84,609",
      file_count: "618,198"
    },
    { name: 'Current Cohort',
      facets : [ { name:"Primary Site", op:"any of", value: "bronchus and lung"} ],
      case_count: "12,027",
      file_count: "52,234"
    },
    {
      name: "Baily's Cohort",
      facets: [
        { name: "Primary Site", op: "any of", value: "bronchus and lung" },
        { name: "Age of Diagnosis", op: "between", value: "65 and 89" },
      ],
      case_count: "2,425",
      file_count: "29,074"
    },
    { name: " Final Cohort",
      facets : [
        { name:"Primary Site", op:"any of ", value: "bronchus and lung"},
        { name:"Primary Diagnosis", op:"any_of", value: "squamous cell carcinoma, nos / squamous cell carcinoma, keratinizing, nos / basaloid squamous cell car…"},
        { name:"Age of Diagnosis", op:"between", value: "65 and 89"},
        { name:"Gene", op:"any of", value: "TP53,KMT2D,PIK3CA,NFE2L2,CDH8,KEAP1,PTEN,ADCY8,PTPRT,CALCR,GRM8,FBXW7,RB1,CDKN2A"}

      ],
      case_count: "179",
      file_count: "2,198"
    }
  ]

  const menu_items = COHORTS.map((x, index) => {
    return { value: index, label: x.name }
  });

  const [currentIndex, setCurrentIndex] = useState(0)

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-row gap-x-4 items-center">
        <div className="w-60">
          <Select
            inputId="cohort-manager__cohort-select"
            options={menu_items}
            defaultValue={menu_items[0]}
            isMulti={false}
            onChange={(x) => {
              setCurrentIndex(x.value);
            }}
          />
        </div>
        <div className="flex flex-row items-center">
          <Button className="mx-1 "><EditIcon size="1.5em" /></Button>
          <Button className="mx-2 "><SaveIcon size="1.5em" /></Button>
          <Button className="mx-2 "><AddIcon size="1.5em" /></Button>
          <Button className="mx-2 "><DeleteIcon size="1.5em" /></Button>
          <Button className="mx-2 "><UploadIcon size="1.5em" /></Button>
          <Button className="mx-2 "><DownloadIcon size="1.5em" /></Button>
        </div>
        <div className="flex-grow"></div>
        <div>
          <Button
            onClick={() => {
              setShowCases(!showCases);
              setShowFiles(false);
            }}
          >
            {COHORTS[currentIndex].case_count} Cases
          </Button>
        </div>
        <div>
          <Button
            onClick={() => {
              setShowFiles(!showFiles);
              setShowCases(false);
            }}
          >
            {COHORTS[currentIndex].file_count} Files
          </Button>
        </div>
        <ModalOrExpand
          mode={mode}
          setIsModalOpen={setIsModalOpen}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
        />
      </div>
      <CohortBuilderModal isOpen={isOpen} closeModal={closeModal} cohort={[COHORTS[currentIndex]]} />
      <CollapsibleCohortBuilder isCollapsed={!isExpanded} cohort={[COHORTS[currentIndex]]}/>
      <CollapsibleCases show={showCases} />
      <CollapsibleFiles show={showFiles} />
    </div>
  );
};

interface CollapsibleCasesProps {
  readonly show: boolean;
}

const CollapsibleCases: React.FC<CollapsibleCasesProps> = (
  props: CollapsibleCasesProps,
) => {
  const { show } = props;

  return (
    <div
      className={classNames("flex-col gap-y-4 h-96 overflow-y-auto", {
        hidden: !show,
        flex: show,
      })}
    >
      <ContextualCasesView />
    </div>
  );
};

interface CollapsibleFilesProps {
  readonly show: boolean;
}

const CollapsibleFiles: React.FC<CollapsibleFilesProps> = (
  props: CollapsibleFilesProps,
) => {
  const { show } = props;

  return (
    <div
      className={classNames("flex-col gap-y-4 h-96 overflow-y-auto", {
        hidden: !show,
        flex: show,
      })}
    >
      <ContextualFilesView />
    </div>
  );
};

interface CollapsibleCohortBuilderProps {
  readonly isCollapsed: boolean;
  readonly cohort: Array<any>;
}

const CollapsibleCohortBuilder: React.FC<CollapsibleCohortBuilderProps> = ({
  isCollapsed,
  cohort
}: CollapsibleCohortBuilderProps) => {
  return <CohortBuilder show={!isCollapsed} cohort={cohort} />;
};

export interface CohortBuilderProps {
  readonly show?: boolean;
  readonly cohort: Array<any>;
}

export const CohortBuilder: React.FC<CohortBuilderProps> = ({
  cohort,
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
        <CohortGroup cohorts={cohort} simpleMode={true}></CohortGroup>
        <MetaSearch onChange={(r) => r }></MetaSearch>
        <CohortTabbedFacets  searchResults={[]}></CohortTabbedFacets>
      </div>
      <div className="pt-4">
        <Tabs>
          <TabList>
            <Tab>Summary</Tab>
            <Tab>Cases</Tab>
          </TabList>

          <TabPanel>
            <SummaryCharts/>
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
      return <Button onClick={() => setIsExpanded(false)}><ExpandLessIcon/></Button>;
    } else {
      return <Button onClick={() => setIsExpanded(true)}><ExpandMoreIcon/></Button>;
    }
  } else {
    return null;
  }
};

interface CohortBuilderModalProps {
  readonly isOpen: boolean;
  readonly closeModal: () => void;
  readonly cohort: Array<any>;
}

const CohortBuilderModal: React.FC<CohortBuilderModalProps> = ({
  isOpen,
  closeModal,
  cohort
}: CohortBuilderModalProps) => {
  return (
    <ReactModal isOpen={isOpen} onRequestClose={closeModal}>
      <div>
        <CohortGroup cohorts={cohort} simpleMode={true}></CohortGroup>
        <MetaSearch onChange={(r) => r }></MetaSearch>
        <CohortTabbedFacets  searchResults={[]}></CohortTabbedFacets>
      </div>
    </ReactModal>
  );
};

const Cases = () => {
  return (
    <div className="overflow-y-auto h-96">
      <ContextualCasesView />
    </div>
  );
};
