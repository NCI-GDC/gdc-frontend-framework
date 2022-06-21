import { MdClose, MdCircle } from "react-icons/md";
import { Button } from "@mantine/core";
import { REGISTERED_APPS } from "./registeredApps";

interface AnalysisBreadcrumbsProps {
  readonly currentApp: string;
  readonly setCohortSelectionOpen: (open: boolean) => void;
  readonly cohortSelectionOpen: boolean;
  readonly setActiveApp: (app: string) => void;
}

const AnalysisBreadcrumbs: React.FC<AnalysisBreadcrumbsProps> = ({
  currentApp,
  setCohortSelectionOpen,
  cohortSelectionOpen,
  setActiveApp,
}: AnalysisBreadcrumbsProps) => {
  const onDemoApp = currentApp?.includes("Demo");
  const appId = onDemoApp ? currentApp?.split("Demo")[0] : currentApp;
  const appInfo = REGISTERED_APPS.find((app) => app.id === appId);

  const displayAdditionalSteps = !onDemoApp && appInfo?.selectAdditionalCohort;

  return (
    <div className="w-full bg-nci-blue-darkest text-white p-2 flex items-center ">
      <Button
        onClick={() => setActiveApp(undefined)}
        className="bg-white text-nci-blue-darkest"
        aria-label="Close app"
      >
        <MdClose size={20} />
      </Button>
      <span
        className={`p-2 mx-2 uppercase ${
          !displayAdditionalSteps ? "font-bold" : ""
        }`}
      >
        {onDemoApp ? `${appInfo?.name} Demo` : appInfo?.name}
      </span>
      {displayAdditionalSteps && (
        <>
          {appInfo?.selectAdditionalCohort && (
            <>
              <MdCircle size={8} />
              <span
                className={`p-2 mx-2 uppercase cursor-pointer ${
                  cohortSelectionOpen ? "font-bold" : ""
                }`}
                role="button"
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
              <MdCircle size={8} />
              <span className="p-2 mx-2 uppercase font-bold">Results</span>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AnalysisBreadcrumbs;
