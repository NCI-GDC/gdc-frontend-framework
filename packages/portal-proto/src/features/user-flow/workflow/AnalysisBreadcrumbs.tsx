import { useRouter } from "next/router";
import { MdArrowBack, MdCircle } from "react-icons/md";
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
  const router = useRouter();
  const onApp = router.query.app === currentApp;
  const onDemoApp = currentApp?.includes("Demo");

  const appId = onDemoApp ? currentApp?.split("Demo")[0] : currentApp;
  const appInfo = REGISTERED_APPS.find((app) => app.id === appId);

  return (
    <div className="w-full bg-nci-blue-darkest text-white p-2 flex items-center ">
      <Button
        onClick={() => {
          if (!onDemoApp && appInfo?.selectAdditionalCohort) {
            setCohortSelectionOpen(true);
          }

          if (
            cohortSelectionOpen ||
            onDemoApp ||
            (onApp && !appInfo?.selectAdditionalCohort)
          ) {
            router.push({ query: { app: undefined } });
            setActiveApp(undefined);
            setCohortSelectionOpen(false);
          }
        }}
        className="bg-white text-nci-blue-darkest"
        aria-label="Back"
      >
        <MdArrowBack size={20} />
      </Button>
      <span className="p-2 mx-2 uppercase">
        {onDemoApp ? `${appInfo?.name} Demo` : appInfo?.name}
      </span>
      {appInfo?.selectAdditionalCohort && !onDemoApp && (
        <>
          <MdCircle size={8} />
          <span
            className={`p-2 mx-2 uppercase ${
              cohortSelectionOpen ? "font-bold" : ""
            }`}
          >
            Selection
          </span>
        </>
      )}
      {onApp && !cohortSelectionOpen && (
        <>
          <MdCircle size={8} />
          <span className="p-2 mx-2 uppercase font-bold">Results</span>
        </>
      )}
    </div>
  );
};

export default AnalysisBreadcrumbs;
