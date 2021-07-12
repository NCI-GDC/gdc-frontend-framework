import { NextPage } from "next";
import { UserFlowFewestPages } from "../features/layout/UserFlowFewestPages";

const UserFlowFewestPagesPage: NextPage = () => {
  return (
    <UserFlowFewestPages>
      <div className="flex flex-col gap-y-4 px-4">
        <div className="border p-4">
          <CohortManager />
        </div>
        <div className="border p-4"><CohortExpressions/></div>
        <div className="border p-4"><CohortGraphs/></div>
        <div className="border p-4"><Apps/></div>
      </div>
    </UserFlowFewestPages>
  );
};

export default UserFlowFewestPagesPage;

const CohortManager: React.FC<unknown> = () => {
  return (
    <div className="flex flex-row">
      <select name="currentCohort" id="current-cohort-select">
        <option value="ALL_GDC">All GDC Cases</option>
        <option value="TCGA-BRCA">TCGA BCRA</option>
      </select>
    </div>
  );
};

const CohortExpressions: React.FC<unknown> = () => {
  return <div className="h-40 text-center">cohort expressions</div>;
};

const CohortGraphs: React.FC<unknown> = () => {
  return (
    <div className="flex flex-row flex-wrap gap-4">
      <Graph/>
      <Graph/>
      <Graph/>
      <Graph/>
      <Graph/>
      <Graph/>
    </div>
  )
}

const Graph: React.FC<unknown> = () => {
  return <div className="w-52 h-52 border text-center">graph</div>
}

const Apps: React.FC<unknown> = () => {
  return (<div className="flex flex-row flex-wrap gap-4">
    <App name="Clinical"/>
    <App name="Biospecimen"/>
    <App name="Somatic Mutations"/>
    <App name="Repository"/>
    <App name="Gene Expression"/>
    <App name="Copy Number Variations"/>
    <App name="Cohort Viewer"/>
    <App name="Studies"/>
  </div>)
}

interface AppProps {
  readonly name: string;
}

const App: React.FC<AppProps> = ({name}) => {
  return (
    <div className="w-72 h-52 border text-center">
      {name}
    </div>
  )
}