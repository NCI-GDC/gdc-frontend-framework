import {
  useCoreSelector,
  selectAvailableCohortByName,
  buildCohortGqlOperator,
  useVennIntersectionData,
} from "@gff/core";

import VennDiagram from "@/features/charts/VennDiagram/VennDiagram";
import makeIntersectionFilters from "./makeIntersectionFilters";

interface CohortVennDiagramProps {
  readonly cohortNames: string[];
  readonly caseIds: string[][];
}

const CohortVennDiagram: React.FC<CohortVennDiagramProps> = ({
  cohortNames,
  caseIds,
}: CohortVennDiagramProps) => {
  const cohort1Filters = useCoreSelector((state) =>
    buildCohortGqlOperator(
      selectAvailableCohortByName(state, cohortNames[0]).filters,
    ),
  );

  const cohort2Filters = useCoreSelector((state) =>
    buildCohortGqlOperator(
      selectAvailableCohortByName(state, cohortNames[1]).filters,
    ),
  );
  const filters = makeIntersectionFilters(
    cohort1Filters,
    cohort2Filters,
    caseIds,
  );

  const { data } = useVennIntersectionData({
    set1Filters: filters.cohort1,
    set2Filters: filters.cohort2,
    intersectionFilters: filters.intersection,
  });

  return (
    <VennDiagram
      chartData={[
        {
          key: "S1_minus_S1",
          value: data.set1?.hits?.total.toLocaleString() || 0,
          highlighted: false,
        },
        {
          key: "S2_minus_S1",
          value: data.set2?.hits?.total.toLocaleString() || 0,
          highlighted: false,
        },
        {
          key: "S1_intersect_S2",
          value: data.intersection?.hits?.total.toLocaleString() || 0,
          highlighted: false,
        },
      ]}
      labels={["S<sub>1</sub>", "S<sub>2</sub>"]}
      interactable={false}
    />
  );
};

export default CohortVennDiagram;
