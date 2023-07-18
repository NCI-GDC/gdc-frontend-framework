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
import { useCoreSelector, selectCohortNameById } from "@gff/core";
import { LoadingOverlay } from "@mantine/core";

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

  const overwriteSelectedEntities = cohort1Id && cohort2Id;
  const cohort1Name = useCoreSelector((state) =>
    selectCohortNameById(state, cohort1Id as string),
  );
  const cohort2Name = useCoreSelector((state) =>
    selectCohortNameById(state, cohort2Id as string),
  );
  const isCohortComparisonDemo =
    cohort1Id === "demoCohort1Id" && cohort2Id === "demoCohort2Id";

  return !ready ? (
    <LoadingOverlay visible />
  ) : !cohort1Id && !cohort2Id && selectionScreenOpen ? (
    <SelectionPanel
      app={app}
      setActiveApp={setActiveApp}
      setOpen={setSelectionScreenOpen}
      selectedEntities={selectedEntities}
      setSelectedEntities={setSelectedEntities}
      selectedEntityType={selectedEntityType}
      setSelectedEntityType={setSelectedEntityType}
    />
  ) : !cohort1Id && !cohort2Id && selectedEntityType !== "cohort" ? ( // not a cohort, so presumably an existing gene or mutation set
    // use the set operations panel as usual
    <SetOperationsChartsForGeneSSMS
      selectedEntities={selectedEntities}
      selectedEntityType={selectedEntityType}
    />
  ) : (
    // handle cohorts as they require case set to be available
    <SetOperationChartsForCohorts
      selectedEntities={
        isCohortComparisonDemo
          ? undefined
          : overwriteSelectedEntities
          ? [
              {
                name: cohort1Name,
                id: cohort1Id as string,
              },
              {
                name: cohort2Name,
                id: cohort2Id as string,
              },
            ]
          : selectedEntities
      }
      isCohortComparisonDemo={isCohortComparisonDemo}
    />
  );
};

export default SetOperationsSelection;
