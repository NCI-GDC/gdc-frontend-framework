import { useContext, useEffect, useState } from "react";
import {
  SelectedEntities,
  SetOperationEntityType,
} from "@/features/set-operations/types";
import SetOperationChartsForCohorts from "@/features/set-operations/SetOperationChartsForCohorts";
import SetOperationsChartsForGeneSSMS from "@/features/set-operations/SetOperationsChartsForGeneSSMS";
import { SelectionScreenContext } from "@/features/user-flow/workflow/AnalysisWorkspace";
import SelectionPanel from "@/features/set-operations/SelectionPanel";
import { useRouter } from "next/router";
import { useCoreSelector, selectMultipleCohortsById } from "@gff/core";
import { LoadingOverlay } from "@mantine/core";
import { useDeepCompareEffect } from "use-deep-compare";

const SetOperationsSelection = (): JSX.Element => {
  const [selectedEntities, setSelectedEntities] = useState<SelectedEntities>(
    [],
  );
  const [selectedEntityType, setSelectedEntityType] = useState<
    SetOperationEntityType | undefined
  >(undefined);

  const {
    query: { cohort1Id, cohort2Id },
    isReady,
  } = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isReady) {
      setReady(true);
    }
  }, [isReady]);

  const { selectionScreenOpen, setSelectionScreenOpen, app, setActiveApp } =
    useContext(SelectionScreenContext);

  // Link from Cohort Comparison app can set the viewed cohorts
  const overwriteSelectedEntities = cohort1Id && cohort2Id;

  // Need to get current ids of selected cohorts because the ids update after the cohort is saved
  const cohorts = useCoreSelector((state) =>
    selectMultipleCohortsById(
      state,
      overwriteSelectedEntities
        ? [cohort1Id as string, cohort2Id as string]
        : selectedEntities.map((e) => e.id),
    ),
  );

  const isCohortComparisonDemo =
    cohort1Id === "demoCohort1Id" && cohort2Id === "demoCohort2Id";

  useDeepCompareEffect(() => {
    if (cohorts.length > 0 || isCohortComparisonDemo) {
      setSelectedEntityType("cohort");

      // A cohort has been deleted, kick user back to selection screen
      if (cohorts.length < 2 && !isCohortComparisonDemo) {
        setSelectionScreenOpen(true);
      }
    }
  }, [cohorts, isCohortComparisonDemo, setSelectionScreenOpen]);

  return !ready ? (
    <LoadingOverlay data-testid="loading-spinner" visible />
  ) : selectionScreenOpen ? (
    <SelectionPanel
      app={app}
      setActiveApp={setActiveApp}
      setOpen={setSelectionScreenOpen}
      selectedEntities={
        selectedEntityType === "cohort"
          ? cohorts.map((cohort) => ({
              id: cohort.id,
              name: cohort.name,
            }))
          : selectedEntities
      }
      setSelectedEntities={setSelectedEntities}
      selectedEntityType={selectedEntityType}
      setSelectedEntityType={setSelectedEntityType}
    />
  ) : selectedEntityType !== "cohort" ? ( // not a cohort, so presumably an existing gene or mutation set
    // use the set operations panel as usual
    <SetOperationsChartsForGeneSSMS
      selectedEntities={selectedEntities}
      selectedEntityType={selectedEntityType}
    />
  ) : (
    // handle cohorts as they require case set to be available
    <SetOperationChartsForCohorts
      cohorts={isCohortComparisonDemo ? undefined : cohorts}
      isCohortComparisonDemo={isCohortComparisonDemo}
    />
  );
};

export default SetOperationsSelection;
