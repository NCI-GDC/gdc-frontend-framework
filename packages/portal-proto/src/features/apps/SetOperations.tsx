import { FC, useContext, useState } from "react";
import {
  useSetOperationGeneTotalQuery,
  useSetOperationSsmTotalQuery,
  useSetOperationsCasesTotalQuery,
} from "@gff/core";
import {
  SetOperationsTwo,
  SetOperationsThree,
} from "@/features/set-operations/SetOperations";
import SelectionPanel from "@/features/set-operations/SelectionPanel";
import { SelectionScreenContext } from "../user-flow/workflow/AnalysisWorkspace";
import {
  SelectedEntities,
  SetOperationEntityType,
} from "../set-operations/types";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";

const ENTITY_TYPE_TO_HOOK = {
  cohort: useSetOperationsCasesTotalQuery,
  genes: useSetOperationGeneTotalQuery,
  mutations: useSetOperationSsmTotalQuery,
};

const SetOperationsApp: FC = () => {
  const isDemoMode = useIsDemoApp();
  const [selectedEntities, setSelectedEntities] = useState<SelectedEntities>(
    isDemoMode
      ? [
          {
            name: "Bladder, High impact, Muse",
            id: "demo-bladder-high-muse",
          },
          {
            name: "Bladder, High impact, Mutect2",
            id: "demo-bladder-high-mutect2",
          },
          {
            name: "Bladder, High impact, Varscan2	",
            id: "demo-bladder-high-varscan2",
          },
        ]
      : [],
  );
  const [selectedEntityType, setSelectedEntityType] = useState<
    SetOperationEntityType | undefined
  >(isDemoMode ? "mutations" : undefined);
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
  ) : selectedEntities.length === 2 ? (
    <SetOperationsTwo
      sets={selectedEntities}
      entityType={selectedEntityType}
      queryHook={ENTITY_TYPE_TO_HOOK[selectedEntityType]}
    />
  ) : (
    <SetOperationsThree
      sets={selectedEntities}
      entityType={selectedEntityType}
      queryHook={ENTITY_TYPE_TO_HOOK[selectedEntityType]}
    />
  );
};

export default SetOperationsApp;
