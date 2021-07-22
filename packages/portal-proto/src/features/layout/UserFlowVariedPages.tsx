import { PropsWithChildren, ReactNode } from "react";
import Image from "next/image";

interface UserFlowVariedPagesProps {
  readonly headerElements: ReadonlyArray<ReactNode>;
}

export const UserFlowVariedPages: React.FC<UserFlowVariedPagesProps> = ({
  headerElements,
  children,
}: PropsWithChildren<UserFlowVariedPagesProps>) => {
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

const Header: React.FC<HeaderProps> = ({ headerElements }: HeaderProps) => {
  return (
    <div className="p-4">
      <div className="flex flex-row flex-wrap divide-x divide-gray-300">
        {headerElements.map((element, i) => (
          <div key={i} className="px-2">
            {typeof element === "string" ? (
              <span className="font-semibold">{element}</span>
            ) : (
              element
            )}
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

export interface CohortManagerProps {
  onClick?: () => void;
}

export const CohortManager: React.FC<CohortManagerProps> = ({onClick = () => {return}}: PropsWithChildren<CohortManagerProps>) => {
  return (
    <div className="flex flex-row gap-x-4 items-center">
      <select name="currentCohort" id="current-cohort-select">
        <option value="ALL_GDC">All GDC Cases</option>
        <option value="TCGA-BRCA">TCGA BCRA</option>
      </select>
      <div className="h-10 w-10">
        <Card />
      </div>
      <div className="h-10 w-10">
        <Card />
      </div>
      <div className="h-10 w-10">
        <Card />
      </div>
      <div className="flex-grow"></div>
      <div>
        <Button>2,345 Cases</Button>
      </div>
      <div>
        <Image src="/expand-svgrepo-com.svg" width="32rem" height="32rem" onClick={onClick}/>
      </div>
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
}: CohortGraphs) => {
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
  return <div className="h-52 border text-center">graph</div>;
};

export interface ButtonProps {
  readonly color?: string;
  readonly onClick?: () => void;
  readonly className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  color = "gray",
  onClick = () => {
    return;
  },
  className = "",
  children,
}: PropsWithChildren<ButtonProps>) => {
  return (
    <button
      className={`
        px-2 py-1 
        border rounded
        border-${color}-300 hover:border-${color}-400
        bg-${color}-200 hover:bg-${color}-300 
        ${className}
      `}
      onClick={onClick}
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
  readonly onClick?: () => void;
}

export const App: React.FC<AppProps> = ({
  name,
  onClick = () => {
    return;
  },
}: AppProps) => {
  return (
    <button
      className="h-52 border border-gray-500 px-4 pt-2 pb-4 flex flex-col gap-y-2"
      onClick={onClick}
    >
      <div className="text-center w-full">
        {name ? name : <LinePlaceholer length={6} />}
      </div>
      <Card />
    </button>
  );
};

interface LinePlaceholerProps {
  readonly length: number;
}

export const LinePlaceholer: React.FC<LinePlaceholerProps> = ({
  length,
}: LinePlaceholerProps) => {
  return (
    <div className="flex flex-row justify-center">
      <div className={`w-${length * 4} h-6 bg-gray-200 rounded-md`} />
    </div>
  );
};

export const Card: React.FC<unknown> = () => {
  // styles for the SVG X from https://stackoverflow.com/a/56557106
  const color = "gray";
  return (
    <div
      className="h-full w-full border border-gray-500"
      style={{
        background: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' preserveAspectRatio='none' viewBox='0 0 100 100'><line x1='0' y1='0' x2='100' y2='100' stroke='${color}' vector-effect='non-scaling-stroke'/><line x1='0' y1='100' x2='100' y2='0' stroke='${color}' vector-effect='non-scaling-stroke'/></svg>")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundSize: "100% 100%, auto",
      }}
    ></div>
  );
};
