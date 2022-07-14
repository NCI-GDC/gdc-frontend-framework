import { FC } from "react";
import { useCoreSelector, selectCurrentCohort } from "@gff/core";
import ClinicalDataAnalysis from "../cDave/ClinicalDataAnalysis";

const CDaveApp: FC = () => {
  const primaryCohortName = useCoreSelector((state) =>
    selectCurrentCohort(state),
  );

  return <ClinicalDataAnalysis cohort={primaryCohortName} />;
};

export default CDaveApp;
