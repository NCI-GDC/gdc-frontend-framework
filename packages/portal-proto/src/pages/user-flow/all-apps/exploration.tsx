import { NextPage } from "next";
import {
  App,
  UserFlowVariedPages,
  Graph,
  Button,
} from "../../../features/layout/UserFlowVariedPages";
import { CohortManager } from "../../../features/user-flow/many-pages/cohort";
import classNames from "classnames";
import { PropsWithChildren } from "react";
import { useState } from "react";
import { CasesTable, Studies } from "../../../features/user-flow/common";
import { useProjects } from "@gff/core";

const UserFlowFewestPagesPage: NextPage = () => {
  const [isExpressionsCollapsed, setIsExpressionsCollapsed] = useState(false);
  const [isSummaryCollapsed, setIsSummaryCollapsed] = useState(false);
  const [currentApp, setCurrentApp] = useState("appSelector");
  const { data } = useProjects();

  const headerElements = ["Exploration"];

  const CohortExpressions: React.FC<unknown> = () => {
    const Top = () => <div className="text-center">Expressions</div>;
    return (
      <CollapsibleContainer
        Top={Top}
        isCollapsed={isExpressionsCollapsed}
        toggle={() => setIsExpressionsCollapsed(!isExpressionsCollapsed)}
      >
        <div className="h-32"></div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          <Graph />
          <Graph />
          <Graph />
          <Graph />
          <Graph />
          <Graph />
        </div>
      </CollapsibleContainer>
    );
  };

  return (
    <UserFlowVariedPages {...{ headerElements }}>
      <div className="flex flex-col gap-y-4 p-4">
        <div className="border p-4 border-gray-400 bg-white">
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
            <div className="flex flex-col gap-y-4">
              <div className="flex flex-row">
                <button onClick={() => setCurrentApp("appSelector")}>
                  &lt; All Apps
                </button>
              </div>
              <Studies projectIds={data.map((d) => d.projectId)} />
            </div>
          ) : (
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
        <App name="File Filters" />
        <App name="Somatic Mutations" />
        <App name="Gene Expression" />
        <App name="Copy Number Variations" />
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
