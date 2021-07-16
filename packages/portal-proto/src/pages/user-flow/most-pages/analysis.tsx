import { NextPage } from "next";
import Link from "next/link";
import {
  App,
  CohortManager,
  CohortGraphs,
  UserFlowVariedPages,
} from "../../../features/layout/UserFlowVariedPages";

const AnalysisPage: NextPage = () => {
  const headerElements = [
    <Link key="Home" href="/">Home</Link>,
    <Link key="Studies" href="/user-flow/most-pages/studies">Studies</Link>,
    <Link key="Exploration" href="/user-flow/most-pages/exploration">Exploration</Link>,
    "Analysis",
    <Link key="Repository" href="/user-flow/most-pages/repository">Repository</Link>,
  ];

  return (
    <UserFlowVariedPages {...{ headerElements }}>
      <div className="flex flex-col p-4 gap-y-4">
        <div className="border p-4 border-gray-400">
          <CohortManager />
        </div>
        <div className="border p-4 border-gray-400">
          <Apps />
        </div>
        <div className="border p-4 border-gray-400">
          <CohortGraphs showSummary showCase />
        </div>
      </div>
    </UserFlowVariedPages>
  );
};

export default AnalysisPage;

const Apps: React.FC<unknown> = () => {
  return (
    <div className="flex flex-row flex-wrap gap-4">
      <App name="OncoGrid" />
      <App name="Gene Expression" />
      <App />
      <App />
      <App />
      <App />
      <App />
      <App />
      <App />
      <App />
      <App />
      <App />
      <App />
      <App />
      <App />
      <App />
    </div>
  );
};