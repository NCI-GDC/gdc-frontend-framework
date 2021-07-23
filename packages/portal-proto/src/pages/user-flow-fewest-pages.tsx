import { NextPage } from "next";
import Link from "next/link";
import {
  App,
  UserFlowVariedPages,
  Graph,
  Button,
} from "../features/layout/UserFlowVariedPages";
import { CohortManager } from "../features/user-flow/most-pages/cohort";
import classNames from "classnames";
import { PropsWithChildren } from "react";
import { useState } from "react";

const UserFlowFewestPagesPage: NextPage = () => {
  const [isExpressionsCollapsed, setIsExpressionsCollapsed] = useState(false);
  const [isSummaryCollapsed, setIsSummaryCollapsed] = useState(false);

  const headerElements = [
    <Link key="Home" href="/">
      Home
    </Link>,
    "Exploration",
  ];

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
      <div className="flex flex-col gap-y-4 px-4">
        <div className="border p-4 border-gray-400">
          <CohortManager />
        </div>
        <CohortExpressions />
        <CohortSummary />
        <div className="border p-4 border-gray-400">
          <Apps />
        </div>
      </div>
    </UserFlowVariedPages>
  );
};

export default UserFlowFewestPagesPage;

const Apps: React.FC<unknown> = () => {
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-row gap-x-4">
        <Button>All</Button>
        <Button>Lorem</Button>
        <Button>Ipsum</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        <App name="Clinical" />
        <App name="Biospecimen" />
        <App name="Somatic Mutations" />
        <App name="Repository" />
        <App name="Gene Expression" />
        <App name="Copy Number Variations" />
        <App name="Cohort Viewer" />
        <App name="Studies" />
      </div>
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
