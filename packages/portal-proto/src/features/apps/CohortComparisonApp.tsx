import React, { useContext, useState } from "react";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import {
  useCoreSelector,
  selectCurrentCohortName,
  FilterSet,
  selectCurrentCohortFilterSet,
  Cohort,
  selectCohortFilterSetById,
} from "@gff/core";
import { SelectionScreenContext } from "@/features/user-flow/workflow/AnalysisWorkspace";
import CohortComparison from "../cohortComparison/CohortComparison";
import AdditionalCohortSelection from "@/features/cohortComparison/AdditionalCohortSelection";

export const cohortDemo1: {
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

export const cohortDemo2: {
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
        operator: "excludeifany",
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

const CohortComparisonApp: React.FC = () => {
  const isDemoMode = useIsDemoApp();

  const primaryCohortName = useCoreSelector((state) =>
    selectCurrentCohortName(state),
  );
  const primaryCohortFilter = useCoreSelector((state) =>
    selectCurrentCohortFilterSet(state),
  );

  const [comparisonCohort, setComparisonCohort] = useState<Cohort>();
  const comparisonCohortFilter = useCoreSelector((state) =>
    selectCohortFilterSetById(state, comparisonCohort?.id),
  );

  const { selectionScreenOpen, setSelectionScreenOpen, app, setActiveApp } =
    useContext(SelectionScreenContext);

  const cohorts = isDemoMode
    ? { primary_cohort: cohortDemo1, comparison_cohort: cohortDemo2 }
    : {
        primary_cohort: {
          filter: primaryCohortFilter,
          name: primaryCohortName,
        },
        comparison_cohort: {
          filter: comparisonCohortFilter,
          name: comparisonCohort?.name,
        },
      };

  return selectionScreenOpen ? (
    <AdditionalCohortSelection
      app={app}
      setOpen={setSelectionScreenOpen}
      setActiveApp={setActiveApp}
      setComparisonCohort={setComparisonCohort}
    />
  ) : (
    <CohortComparison cohorts={cohorts} demoMode={isDemoMode} />
  );
};

export default CohortComparisonApp;
