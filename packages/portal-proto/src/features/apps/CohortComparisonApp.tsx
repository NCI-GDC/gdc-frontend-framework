import { useCoreSelector, selectCurrentCohort } from "@gff/core";
import CohortComparison from "../cohortComparison/CohortComparison";

const COMPARISON_COHORT = "breast, true";

const CohortComparisonApp: React.FC = () => {
  const primaryCohortName = useCoreSelector((state) =>
    selectCurrentCohort(state),
  );

  return (
    <CohortComparison cohortNames={[primaryCohortName, COMPARISON_COHORT]} />
  );
};

export default CohortComparisonApp;
