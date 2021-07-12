import { ReactNode } from "react";

interface UserFlowVariedPagesProps {
  readonly headerElements: ReadonlyArray<ReactNode>
}

export const UserFlowVariedPages: React.FC<UserFlowVariedPagesProps> = ({ headerElements, children }) => {
  return (
    <div className="flex flex-col min-h-screen min-w-full">
      <header className="flex-none">
        <Header {...{headerElements}}/>
      </header>
      <main className="flex-grow">{children}</main>
      <footer className="flex-none">
        <Footer />
      </footer>
    </div>
  );
};

interface HeaderProps {
  readonly headerElements: ReadonlyArray<ReactNode>
}

const Header: React.FC<HeaderProps> = ({headerElements}) => {
  return (
    <div className="p-4">
      <div className="flex flex-row divide-x divide-gray-300">
        {headerElements.map((element, i) => <div key={i} className="px-2">{element}</div>)}
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
