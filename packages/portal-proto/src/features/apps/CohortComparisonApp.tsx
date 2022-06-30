import {
  useCoreSelector,
  selectCurrentCohort,
  selectComparisonCohorts,
} from "@gff/core";
import CohortComparison from "../cohortComparison/CohortComparison";

const CohortComparisonApp: React.FC = () => {
  const primaryCohortName = useCoreSelector((state) =>
    selectCurrentCohort(state),
  );

  const comparisonCohort = useCoreSelector((state) =>
    selectComparisonCohorts(state),
  )[0];

  return (
    <CohortComparison cohortNames={[primaryCohortName, comparisonCohort]} />
  );
};

export default CohortComparisonApp;
