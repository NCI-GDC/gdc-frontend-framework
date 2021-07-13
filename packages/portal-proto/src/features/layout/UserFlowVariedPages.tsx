import { ReactNode } from "react";

interface UserFlowVariedPagesProps {
  readonly headerElements: ReadonlyArray<ReactNode>;
}

export const UserFlowVariedPages: React.FC<UserFlowVariedPagesProps> = ({
  headerElements,
  children,
}) => {
  return (
    <div className="flex flex-col min-h-screen min-w-full">
      <header className="flex-none">
        <Header {...{ headerElements }} />
      </header>
      <main className="flex-grow">{children}</main>
      <footer className="flex-none">
        <Footer />
      </footer>
    </div>
  );
};

interface HeaderProps {
  readonly headerElements: ReadonlyArray<ReactNode>;
}

const Header: React.FC<HeaderProps> = ({ headerElements }) => {
  return (
    <div className="p-4">
      <div className="flex flex-row divide-x divide-gray-300">
        {headerElements.map((element, i) => (
          <div key={i} className="px-2">
            {typeof element === "string" ? <span className="font-semibold">{element}</span> : element}
          </div>
        ))}
      </div>
    </div>
  );
};

const Footer: React.FC<unknown> = () => {
  return (
    <div className="flex flex-col bg-gray-200 justify-center text-center p-4">
      <div>Site Home | Policies | Accessibility | FOIA | Support</div>
      <div>
        U.S. Department of Health and Human Services | National Institutes of
        Health | National Cancer Institute | USA.gov
      </div>
      <div>NIH... Turning Discovery Into Health ®</div>
    </div>
  );
};

export const CohortManager: React.FC<unknown> = () => {
  return (
    <div className="flex flex-row">
      <select name="currentCohort" id="current-cohort-select">
        <option value="ALL_GDC">All GDC Cases</option>
        <option value="TCGA-BRCA">TCGA BCRA</option>
      </select>
    </div>
  );
};

export interface CohortGraphs {
  readonly showSummary?: boolean;
  readonly showCase?: boolean;
  readonly showAnalysis?: boolean;
  readonly showFiles?: boolean;
}

export const CohortGraphs: React.FC<CohortGraphs> = ({
  showAnalysis = false,
  showCase = false,
  showFiles = false,
  showSummary = false,
}) => {
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-row gap-x-4">
        {showSummary && <Button>Summary</Button>}
        {showCase && <Button>Case</Button>}
        {showAnalysis && <Button>Analysis</Button>}
        {showFiles && <Button>Files</Button>}
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

export const Graph: React.FC<unknown> = () => {
  return <div className="w-52 h-52 border text-center">graph</div>;
};

export interface ButtonProps {
  readonly color?: string;
}

export const Button: React.FC<ButtonProps> = ({ color = "gray", children }) => {
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

export const CohortExpressionsAndBuilder: React.FC<unknown> = () => {
  return <div className="h-96 text-center">Expressions + Cohort Builder</div>;
};

export interface AppProps {
  readonly name?: ReactNode;
}

export const App: React.FC<AppProps> = ({ name }) => {
  return (
    <div className="w-72 h-52 border px-4 pt-2 pb-4 flex flex-col gap-y-2">
      <div className="text-center">
        {name ? name : <LinePlaceholer length={6} />}
      </div>
      <div className="flex-grow border bg-gray-100"></div>
    </div>
  );
};

export const LinePlaceholer: React.FC<{ length: number }> = ({ length }) => {
  return (
    <div className="flex flex-row justify-center">
      <div className={`w-${length * 4} h-6 bg-gray-200 rounded-md`} />
    </div>
  );
};
