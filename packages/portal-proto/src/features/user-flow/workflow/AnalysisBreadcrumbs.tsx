import { useRouter } from "next/router";
import { MdArrowBack, MdCircle } from "react-icons/md";
import { Button } from "@mantine/core";
import { AppRegistrationEntry } from "./utils";
import { useEffect } from "react";

interface AnalysisBreadcrumbsProps {
  currentApp: AppRegistrationEntry;
  setCohortSelectionOpen: (open: boolean) => void;
  setActiveApp: (id, name) => void;
}

const AnalysisBreadcrumbs: React.FC<AnalysisBreadcrumbsProps> = ({
  currentApp,
  setCohortSelectionOpen,
  setActiveApp,
}: AnalysisBreadcrumbsProps) => {
  const router = useRouter();
  console.log(currentApp);
  const onApp = router.query.app === currentApp?.id;
  const onDemoApp = router.query.app === `${currentApp?.id}Demo`;

  return (
    <div className="w-full bg-nci-blue-darkest text-white p-2 flex items-center ">
      <Button
        onClick={() => {
          if (onApp || onDemoApp) {
            router.back();
          }
          if (onApp && currentApp?.selectAdditionalCohort) {
            setCohortSelectionOpen(true);
          } else {
            setActiveApp(undefined, undefined);
          }

          if (!onApp || !onDemoApp) {
            setCohortSelectionOpen(false);
          }
        }}
        className="bg-white text-nci-blue-darkest"
      >
        <MdArrowBack size={20} />
      </Button>
      <span className="p-2 mx-2 uppercase">{currentApp?.name}</span>
      {currentApp?.selectAdditionalCohort && (
        <>
          <MdCircle size={8} />
          <span className={`p-2 mx-2 uppercase ${onApp ? "" : "font-bold"}`}>
            Selection
          </span>
        </>
      )}
      {onApp && (
        <>
          <MdCircle size={8} />
          <span className="p-2 mx-2 uppercase font-bold">Results</span>
        </>
      )}
    </div>
  );
};

export default AnalysisBreadcrumbs;
