import dynamic from "next/dynamic";
import {
  buildCohortGqlOperator,
  useVennIntersectionData,
  FilterSet,
} from "@gff/core";

import makeIntersectionFilters from "./makeIntersectionFilters";
const VennDiagram = dynamic(() => import("@/features/charts/VennDiagram"), {
  ssr: false,
});

interface CohortVennDiagramProps {
  readonly cohorts: Array<{
    filter: FilterSet;
    name: string;
  }>;
  readonly caseIds: string[][];
}

const CohortVennDiagram: React.FC<CohortVennDiagramProps> = ({
  cohorts,
  caseIds,
}: CohortVennDiagramProps) => {
  const filters = makeIntersectionFilters(
    buildCohortGqlOperator(cohorts[0].filter),
    buildCohortGqlOperator(cohorts[1].filter),
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
