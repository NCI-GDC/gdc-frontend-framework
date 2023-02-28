import { MdClose, MdCircle } from "react-icons/md";
import { Button } from "@mantine/core";
import { REGISTERED_APPS } from "./registeredApps";

interface AnalysisBreadcrumbsProps {
  readonly currentApp: string;
  readonly setCohortSelectionOpen: (open: boolean) => void;
  readonly cohortSelectionOpen: boolean;
  readonly setActiveApp: (app: string) => void;
  readonly rightComponent?: React.ReactElement;
  readonly onDemoApp?: boolean;
}

const AnalysisBreadcrumbs: React.FC<AnalysisBreadcrumbsProps> = ({
  currentApp,
  setCohortSelectionOpen,
  cohortSelectionOpen,
  setActiveApp,
  rightComponent,
  onDemoApp,
}: AnalysisBreadcrumbsProps) => {
  const appInfo = REGISTERED_APPS.find((app) => app.id === currentApp);

  const displayAdditionalSteps = !onDemoApp && appInfo?.selectAdditionalCohort;

  return (
    <div className="w-full bg-primary p-2 flex items-center ">
      <Button
        onClick={() => setActiveApp(undefined)}
        className="bg-base-lightest text-primary-content-darkest"
        aria-label="Close app"
      >
        <MdClose size={20} />
      </Button>
      <span
        className={`p-2 mx-2 uppercase text-white ${
          !displayAdditionalSteps ? "font-bold" : ""
        }`}
      >
        {onDemoApp ? `${appInfo?.name} Demo` : appInfo?.name}
      </span>
      {displayAdditionalSteps && (
        <>
          {appInfo?.selectAdditionalCohort && (
            <>
              <MdCircle size={8} color="white" />
              <span
                className={`p-2 mx-2 uppercase cursor-pointer text-white ${
                  cohortSelectionOpen ? "font-bold" : ""
                }`}
                role="button"
                tabIndex={0}
                onClick={() => setCohortSelectionOpen(true)}
                onKeyPress={(e) =>
                  e.key === "Enter" ? setCohortSelectionOpen(true) : null
                }
              >
                Selection
              </span>
            </>
          )}
          {!cohortSelectionOpen && (
            <>
              <MdCircle size={8} color="white" />
              <span className="p-2 mx-2 uppercase font-bold text-white">
                Results
              </span>
            </>
          )}
        </>
      )}
      <div className="ml-auto mr-0">{rightComponent}</div>
    </div>
  );
};

export default AnalysisBreadcrumbs;
