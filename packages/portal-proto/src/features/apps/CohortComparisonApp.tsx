import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import {
  useCoreSelector,
  selectCurrentCohortName,
  selectComparisonCohorts,
  FilterSet,
  selectCurrentCohortFilterSet,
  selectAvailableCohortByName,
} from "@gff/core";
import CohortComparison from "../cohortComparison/CohortComparison";

const CohortComparisonApp: React.FC = () => {
  const isDemoMode = useIsDemoApp();

  const cohortDemo1: {
    filter: FilterSet;
    name: string;
  } = {
    filter: {
      mode: "and",
      root: {
        "cases.project.project_id": {
          operator: "includes",
          field: "cases.project.project_id",
          operands: ["TCGA-LGG"],
        },
        "genes.gene_id": {
          field: "genes.gene_id",
          operator: "includes",
          operands: ["ENSG00000138413", "ENSG00000182054"],
        },
      },
    },
    name: "Low grade gliomas - IDH1 or IDH2 mutated",
  };

  const cohortDemo2: {
    filter: FilterSet;
    name: string;
  } = {
    filter: {
      mode: "and",
      root: {
        "cases.project.project_id": {
          operator: "includes",
          field: "cases.project.project_id",
          operands: ["TCGA-LGG"],
        },
        "genes.gene_id": {
          field: "genes.gene_id",
          operator: "excludes",
          operands: ["ENSG00000138413", "ENSG00000182054"],
        },
        "cases.available_variation_data": {
          field: "cases.available_variation_data",
          operator: "includes",
          operands: ["ssm"],
        },
      },
    },
    name: "Low grade gliomas - IDH1 and IDH2 not mutated",
  };

  const primaryCohortName = useCoreSelector((state) =>
    selectCurrentCohortName(state),
  );

  const primaryCohortFilter = useCoreSelector((state) =>
    selectCurrentCohortFilterSet(state),
  );

  const comparisonCohort = useCoreSelector((state) =>
    selectComparisonCohorts(state),
  )[0];

  const comparisonCohortFilter = useCoreSelector(
    (state) => selectAvailableCohortByName(state, comparisonCohort)?.filters,
  );

  const cohorts = isDemoMode
    ? [cohortDemo1, cohortDemo2]
    : [
        { filter: primaryCohortFilter, name: primaryCohortName },
        { filter: comparisonCohortFilter, name: comparisonCohort },
      ];

  return <CohortComparison cohorts={cohorts} demoMode={isDemoMode} />;
};

export default CohortComparisonApp;
