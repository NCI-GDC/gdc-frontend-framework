import useIsDemoApp from "@/hooks/useIsDemoApp";
import {
  useCoreSelector,
  selectCurrentCohortName,
  selectComparisonCohorts,
} from "@gff/core";
import CohortComparison from "../cohortComparison/CohortComparison";

const CohortComparisonApp: React.FC = () => {
  const isDemoMode = useIsDemoApp();

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
