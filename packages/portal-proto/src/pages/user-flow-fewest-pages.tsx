import { NextPage } from "next";
import Link from "next/link";
import { UserFlowVariedPages, CohortManager, CohortGraphs } from "../features/layout/UserFlowVariedPages";

const UserFlowFewestPagesPage: NextPage = () => {
  const headerElements = [
    <Link href="/">Home</Link>,
    <Link href="/user-flow-fewest-pages">Explorations</Link>,
  ];

  return (
    <UserFlowVariedPages {...{ headerElements }}>
      <div className="flex flex-col gap-y-4 px-4">
        <div className="border p-4 border-gray-400">
          <CohortManager />
        </div>
        <div className="border p-4 border-gray-400">
          <CohortExpressions />
        </div>
        <div className="border p-4 border-gray-400">
          <CohortGraphs />
        </div>
        <div className="border p-4 border-gray-400">
          <Apps />
        </div>
      </div>
    </UserFlowVariedPages>
  );
};

export default UserFlowFewestPagesPage;


const CohortExpressions: React.FC<unknown> = () => {
  return <div className="h-40 text-center">cohort expressions</div>;
};

const Apps: React.FC<unknown> = () => {
  return (
    <div className="flex flex-row flex-wrap gap-4">
      <App name="Clinical" />
      <App name="Biospecimen" />
      <App name="Somatic Mutations" />
      <App name="Repository" />
      <App name="Gene Expression" />
      <App name="Copy Number Variations" />
      <App name="Cohort Viewer" />
      <App name="Studies" />
    </div>
  );
};

interface AppProps {
  readonly name: string;
}

const App: React.FC<AppProps> = ({ name }) => {
  return <div className="w-72 h-52 border text-center">{name}</div>;
};
