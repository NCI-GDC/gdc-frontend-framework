import { NextPage } from "next";
import {
  UserFlowVariedPages,
  CohortManager,
  Graph,
} from "../features/layout/UserFlowVariedPages";
import Link from "next/link";

const UserFlowFewerPagesPage: NextPage = () => {
  const headerElements = [
    <Link href="/">Home</Link>,
    <Link href="/not-implemented-yet">Studies</Link>,
    <Link href="/user-flow-fewer-pages">Explorations</Link>,
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
          <CohortGraphs />
        </div>
      </div>
    </UserFlowVariedPages>
  );
};

export default UserFlowFewerPagesPage;

const CohortExpressionsAndBuilder: React.FC<unknown> = () => {
  return <div className="h-96 text-center">Expressions + Cohort Builder</div>;
};

const CohortGraphs: React.FC<unknown> = () => {
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-row gap-x-4">
        <Button>Summary</Button>
        <Button>Case</Button>
        <Button>Analysis</Button>
        <Button>Files</Button>
      </div>
      <div className="flex flex-row flex-wrap gap-4">
        <Graph />
        <Graph />
        <Graph />
        <Graph />
        <Graph />
        <Graph />
      </div>
    </div>
  );
};

interface ButtonProps {
  readonly color?: string;
}

const Button: React.FC<ButtonProps> = ({ color = "gray", children }) => {
  return (
    <button
      className={`
        px-2 py-1 
        border rounded
        border-${color}-300 hover:border-${color}-400
        bg-${color}-200 hover:bg-${color}-300 
      `}
    >
      {children}
    </button>
  );
};
