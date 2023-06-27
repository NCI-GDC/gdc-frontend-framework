import { useContext, useState } from "react";

import {
  SelectedEntities,
  SetOperationEntityType,
} from "@/features/set-operations/types";
import SetOperationChartsForCohorts from "@/features/set-operations/SetOperationChartsForCohorts";
import SetOperationsChartsForGeneSSMS from "@/features/set-operations/SetOperationsChartsForGeneSSMS";
import { SelectionScreenContext } from "@/features/user-flow/workflow/AnalysisWorkspace";
import SelectionPanel from "@/features/set-operations/SelectionPanel";

const SetOperationsSelection = (): JSX.Element => {
  const [selectedEntities, setSelectedEntities] = useState<SelectedEntities>(
    [],
  );
  const [selectedEntityType, setSelectedEntityType] = useState<
    SetOperationEntityType | undefined
  >(undefined);

  const { selectionScreenOpen, setSelectionScreenOpen, app, setActiveApp } =
    useContext(SelectionScreenContext);

  return selectionScreenOpen ? (
    <SelectionPanel
      app={app}
      setActiveApp={setActiveApp}
      setOpen={setSelectionScreenOpen}
      selectedEntities={selectedEntities}
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
    <SetOperationChartsForCohorts selectedEntities={selectedEntities} />
  );
};

export default SetOperationsSelection;
