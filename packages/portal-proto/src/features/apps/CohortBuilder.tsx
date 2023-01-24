import FacetTabs from "../cohortBuilder/FacetTabs";
import { FC } from "react";
import { DemoUtil } from "./DemoUtil";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";

const CohortBuilder: FC = () => {
  const isDemoMode = useIsDemoApp();
  return (
    <>
      {isDemoMode ? (
        <DemoUtil text="Demo mode is not available for this app" />
      ) : (
        <div className="flex flex-col">
          <FacetTabs />
        </div>
      )}
    </>
  );
};

export default CohortBuilder;
