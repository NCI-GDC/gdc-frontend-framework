import { NextPage } from "next";
import {
  App,
  UserFlowVariedPages,
  Button,
} from "../../../features/layout/UserFlowVariedPages";
import { CohortManager } from "../../../features/user-flow/many-pages/cohort";
import classNames from "classnames";
import { PropsWithChildren } from "react";
import { useState } from "react";
import { ContextualStudiesView } from "../../../features/studies/StudiesView";
import { StudyView } from "../../../features/studies/StudyView";
import Image from "next/image";
import { FacetChart } from "../../../features/charts/FacetChart";
import ReactModal from "react-modal";
import { ContextualCasesView } from "../../../features/cases/CasesView";
import {
  ClincialFilters,
  GeneExpression,
  OncoGrid,
  ProteinPaint,
  SetOperations,
  SingleCellRnaSeq,
} from "../../../features/apps/Apps";
import { ContextualFilesView } from "../../../features/files/FilesView";

const UserFlowFewestPagesPage: NextPage = () => {
  const [isExpressionsCollapsed, setIsExpressionsCollapsed] = useState(false);
  const [isSummaryCollapsed, setIsSummaryCollapsed] = useState(false);
  const [currentApp, setCurrentApp] = useState("appSelector");
  const [isStudyModalOpen, setStudyModalOpen] = useState(false);

  const headerElements = ["Exploration"];

  const CohortExpressions: React.FC<unknown> = () => {
    const Top = () => <div className="text-center">Cohort Criteria</div>;
    return (
      <CollapsibleContainer
        Top={Top}
        isCollapsed={isExpressionsCollapsed}
        toggle={() => setIsExpressionsCollapsed(!isExpressionsCollapsed)}
      >
        <div className="h-48 relative">
          <Image
            src="/user-flow/expressions-mock-up.png"
            layout="fill"
            objectFit="contain"
          />
        </div>
      </CollapsibleContainer>
    );
  };

  const CohortSummary: React.FC<unknown> = () => {
    const Top = () => <div className="text-center">Summary</div>;
    return (
      <CollapsibleContainer
        Top={Top}
        isCollapsed={isSummaryCollapsed}
        toggle={() => setIsSummaryCollapsed(!isSummaryCollapsed)}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          <FacetChart
            field="primary_site"
            height={200}
            marginBottom={30}
            showXLabels={false}
          />
          <FacetChart
            field="demographic.gender"
            height={200}
            marginBottom={30}
            showXLabels={false}
          />
          <FacetChart
            field="disease_type"
            height={200}
            marginBottom={30}
            showXLabels={false}
          />
          <FacetChart
            field="samples.sample_type"
            height={200}
            marginBottom={30}
            showXLabels={false}
          />
          <FacetChart
            field="samples.tissue_type"
            height={200}
            marginBottom={30}
            showXLabels={false}
          />
          <FacetChart
            field="diagnoses.tissue_or_organ_of_origin"
            height={200}
            marginBottom={30}
            showXLabels={false}
          />
        </div>
      </CollapsibleContainer>
    );
  };

  return (
    <UserFlowVariedPages {...{ headerElements }}>
      <div className="flex flex-col gap-y-4 p-4">
        <div className="border p-4 border-nci-gray-lighter bg-white">
          <CohortManager />
        </div>
        <div className="bg-white">
          <CohortExpressions />
        </div>
        <div className="bg-white">
          <CohortSummary />
        </div>
        <div className="border p-4 border-gray-400 bg-white">
          {currentApp === "cohort-viewer" ? (
            <CohortViewer goBack={() => setCurrentApp("appSelector")} />
          ) : currentApp === "studies" ? (
            <AllAppsStudies
              returnToAllApps={() => setCurrentApp("appSelector")}
              viewStudy={() => setStudyModalOpen(true)}
            />
          ) : currentApp === "repository" ? (
            <AllAppsRepository
              returnToAllApps={() => setCurrentApp("appSelector")}
            />
          ) : (
            // app selector
            <Apps setCurrentApp={setCurrentApp} />
          )}
        </div>
      </div>
      <StudyModal
        isOpen={isStudyModalOpen}
        closeModal={() => setStudyModalOpen(false)}
      />
    </UserFlowVariedPages>
  );
};

export default UserFlowFewestPagesPage;

interface AppsProps {
  readonly setCurrentApp: (string) => void;
}

const Apps: React.FC<AppsProps> = ({
  setCurrentApp,
}: PropsWithChildren<AppsProps>) => {
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-row gap-x-4">
        <Button>All</Button>
        <Button>Cohort Tools</Button>
        <Button>Cohort Filters</Button>
        <Button>Genomic Analysis</Button>
        <Button>File Tools</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        <App name="Cohorts" onClick={() => setCurrentApp("studies")} />
        <ClincialFilters />
        <App name="Biospecimen Filters" />
        <App name="Downloadable File Filters" />
        <App name="Somatic Mutations" />
        <App name="Copy Number Variations" />
        <SingleCellRnaSeq />
        <OncoGrid />
        <GeneExpression />
        <ProteinPaint />
        <App
          name="Cohort Viewer"
          onClick={() => setCurrentApp("cohort-viewer")}
        />
        <SetOperations />
        <App name="Cohort Comparison" />
        <App name="Clinical Data Analysis" />
        <App name="Repository" onClick={() => setCurrentApp("repository")} />
      </div>
    </div>
  );
};

interface CohortViewerProps {
  readonly goBack: () => void;
}

const CohortViewer: React.FC<CohortViewerProps> = ({
  goBack,
}: PropsWithChildren<CohortViewerProps>) => {
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-row">
        <button onClick={goBack}>&lt; All Apps</button>
      </div>
      <ContextualCasesView />
    </div>
  );
};

interface CollapsibleContainerProps {
  readonly isCollapsed: boolean;
  readonly toggle: () => void;
  readonly Top: React.FC<unknown>;
}

const CollapsibleContainer: React.FC<CollapsibleContainerProps> = (
  props: PropsWithChildren<CollapsibleContainerProps>,
) => {
  const { Top, isCollapsed, toggle, children } = props;
  const childrenClassNames = classNames({
    hidden: isCollapsed,
    block: !isCollapsed,
  });
  return (
    <div className="flex flex-col border border-gray-400 p-4">
      <div className="flex flex-row">
        <div className="flex-grow">
          <Top />
        </div>
        <div>
          <Button onClick={toggle}>{isCollapsed ? "v" : "^"}</Button>
        </div>
      </div>
      <div className={childrenClassNames}>{children}</div>
    </div>
  );
};

interface StudyModalProps {
  readonly isOpen: boolean;
  readonly closeModal: () => void;
}

const StudyModal: React.FC<StudyModalProps> = ({
  isOpen,
  closeModal,
}: StudyModalProps) => {
  return (
    <ReactModal isOpen={isOpen} onRequestClose={closeModal}>
      <StudyView />
    </ReactModal>
  );
};

interface AllAppsStudiesProps {
  readonly returnToAllApps: () => void;
  readonly viewStudy: (name: string) => void;
}

const AllAppsStudies = (props: AllAppsStudiesProps) => {
  const { returnToAllApps, viewStudy } = props;

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-row">
        <button className="absolute" onClick={returnToAllApps}>
          &lt; All Apps
        </button>
        <div className="flex-grow text-center">Cohorts</div>
      </div>
      <ContextualStudiesView
        setCurrentStudy={viewStudy}
        exploreRight={
          <Button onClick={returnToAllApps}>Explore Studies</Button>
        }
      />
    </div>
  );
};

interface AllAppsRepositoryProps {
  readonly returnToAllApps: () => void;
}

const AllAppsRepository = (props: AllAppsRepositoryProps) => {
  const { returnToAllApps } = props;

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-row">
        <button className="absolute" onClick={returnToAllApps}>
          &lt; All Apps
        </button>
        <div className="flex-grow text-center">Repository</div>
      </div>
      <ContextualFilesView />
    </div>
  );
};

/**
 * single entity modal
 * < prev  ID   next >
 * single entity view
 *
 * ---
 *
 * collection of entities view
 * - show collection of entities
 * - filters entities
 * - sorts entities
 *
 * select entities
 * set filter
 * set sort
 *
 * click entity -> set current entity
 *
 */
