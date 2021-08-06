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
import { CasesTable } from "../../../features/user-flow/common";
import { ContextualStudiesView } from "../../../features/studies/StudiesView";
import { StudyView } from "../../../features/studies/StudyView";
import Image from "next/image";
import { FacetChart } from "../../../features/charts/FacetChart";

const UserFlowFewestPagesPage: NextPage = () => {
  const [isExpressionsCollapsed, setIsExpressionsCollapsed] = useState(false);
  const [isSummaryCollapsed, setIsSummaryCollapsed] = useState(false);
  const [currentApp, setCurrentApp] = useState("appSelector");

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
          <FacetChart field="primary_site" />
          <FacetChart field="demographic.gender" />
          <FacetChart field="disease_type" />
          <FacetChart field="samples.sample_type" />
          <FacetChart field="samples.tissue_type" />
          <FacetChart field="diagnoses.tissue_or_organ_of_origin" />
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
            <ContextualStudiesView setView={setCurrentApp} />
          ) : currentApp == "study-view" ? (
            <StudyView setView={setCurrentApp} />
          ) : (
            // app selector
            <Apps setCurrentApp={setCurrentApp} />
          )}
        </div>
      </div>
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
        <Button>Lorem</Button>
        <Button>Ipsum</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        <App name="Studies" onClick={() => setCurrentApp("studies")} />
        <App name="Clinical Filters" />
        <App name="Biospecimen Filters" />
        <App name="Downloadable File Filters" />
        <App name="Somatic Mutations" />
        <App name="Copy Number Variations" />
        <App name="scRNA-Seq">
          <div className="w-full h-full relative">
            <Image
              src="/user-flow/scRnaSeqViz.png"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </App>
        <App name="OncoGrid">
          <div className="w-full h-full relative">
            <Image
              src="/user-flow/oncogrid.png"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </App>
        <App name="Gene Expression">
          <div className="w-full h-full relative">
            <Image
              src="/user-flow/gene-expression.png"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </App>
        <App name="ProteinPaint">
          <div className="w-full h-full relative">
            <Image
              src="/user-flow/proteinpaint.png"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </App>
        <App
          name="Cohort Viewer"
          onClick={() => setCurrentApp("cohort-viewer")}
        />
        <App name="Repository" />
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
      <CasesTable />
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
