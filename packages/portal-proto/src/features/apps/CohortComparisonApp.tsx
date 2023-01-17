import {
  useCoreSelector,
  selectCurrentCohortName,
  selectComparisonCohorts,
} from "@gff/core";
import { useRouter } from "next/router";
import CohortComparison from "../cohortComparison/CohortComparison";

const CohortComparisonApp: React.FC = () => {
  const {
    query: { demoMode },
  } = useRouter();
  const isDemoMode = demoMode === "true" ? true : false;

  const primaryCohortName = useCoreSelector((state) =>
    selectCurrentCohortName(state),
  );

  const comparisonCohort = useCoreSelector((state) =>
    selectComparisonCohorts(state),
  )[0];

  return (
    <CohortComparison
      cohortNames={
        isDemoMode
          ? ["Pancreas - KRAS mutated", "Pancreas - KRAS not mutated"]
          : [primaryCohortName, comparisonCohort]
      }
      demoMode={isDemoMode}
    />
  );
};

export default CohortComparisonApp;
