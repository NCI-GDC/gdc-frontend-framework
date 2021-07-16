import { NextPage } from "next";
import Link from "next/link";
import {
  CohortManager,
  CohortExpressionsAndBuilder,
  CohortGraphs,
  UserFlowVariedPages,
} from "../../../features/layout/UserFlowVariedPages";

const ExplorationPage: NextPage = () => {
  const headerElements = [
    <Link key="Home" href="/">
      Home
    </Link>,
    <Link key="Studies" href="/user-flow/most-pages/studies">
      Studies
    </Link>,
    "Explorations",
    <Link key="Analysis" href="/user-flow/most-pages/analysis">
      Analysis
    </Link>,
    <Link key="Repository" href="/user-flow/most-pages/repository">
      Repository
    </Link>,
  ];

  return (
    <UserFlowVariedPages {...{ headerElements }}>
      <div className="flex flex-col p-4 gap-y-4">
        <div className="border p-4 border-gray-400">
          <CohortManager />
        </div>
        <div className="border p-4 border-gray-400">
          <CohortExpressionsAndBuilder />
        </div>
        <div className="border p-4 border-gray-400">
          <CohortGraphs showSummary showCase />
        </div>
      </div>
    </UserFlowVariedPages>
  );
};

export default ExplorationPage;
