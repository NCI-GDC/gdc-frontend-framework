import CohortComparison from "../cohortComparison/CohortComparison";

const CohortComparisonDemo = () => (
  <CohortComparison cohortNames={["Pancreas - KRAS mutated", "Pancreas - KRAS not mutated"]} demoMode />
);

export default CohortComparisonDemo;