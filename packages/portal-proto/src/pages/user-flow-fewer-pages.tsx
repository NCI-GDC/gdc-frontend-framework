import { NextPage } from "next";
import {
  UserFlowVariedPages,
  CohortManager,
  CohortExpressionsAndBuilder,
  CohortGraphs
} from "../features/layout/UserFlowVariedPages";
import Link from "next/link";

const UserFlowFewerPagesPage: NextPage = () => {
  const headerElements = [
    <Link key="Home" href="/">Home</Link>,
    <Link key="Studies" href="/not-implemented-yet">Studies</Link>,
    <Link key="Exploration" href="/user-flow-fewer-pages">Exploration</Link>,
  ];

  return (
    <UserFlowVariedPages {...{ headerElements }}>
      <div className="flex flex-col gap-y-4 px-4">
        <div className="border p-4 border-gray-400">
          <CohortManager />
        </div>
        <div className="border p-4 border-gray-400">
          <CohortExpressionsAndBuilder />
        </div>
        <div className="border p-4 border-gray-400">
          <CohortGraphs showAnalysis showCase showFiles showSummary/>
        </div>
      </div>
    </UserFlowVariedPages>
  );
};

export default UserFlowFewerPagesPage;