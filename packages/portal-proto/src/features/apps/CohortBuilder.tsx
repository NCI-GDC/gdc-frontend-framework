import { FC } from "react";
import { DemoUtil } from "./DemoUtil";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import CohortBuilder from "@/features/cohortBuilder/CohortBuilder";

const CohortBuilderApp: FC = () => {
  const isDemoMode = useIsDemoApp();
  return (
    <>
      {isDemoMode ? (
        <DemoUtil text="Demo mode is not available for this app" />
      ) : (
        <div className="flex flex-col">
          <CohortBuilder />
        </div>
      )}
    </>
  );
};

export default CohortBuilderApp;
