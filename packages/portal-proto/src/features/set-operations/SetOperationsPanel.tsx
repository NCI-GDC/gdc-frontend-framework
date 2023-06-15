import SelectionPanel from "@/features/set-operations/SelectionPanel";
import { Loader } from "@mantine/core";
import {
  SetOperationsThree,
  SetOperationsTwo,
} from "@/features/set-operations/SetOperations";
import { useContext } from "react";
import { SelectionScreenContext } from "@/features/user-flow/workflow/AnalysisWorkspace";
import { SelectedEntities, SetOperationEntityType } from "./types";
import {
  useSetOperationGeneTotalQuery,
  useSetOperationSsmTotalQuery,
  useSetOperationsCasesTotalQuery,
  useGeneSetCountsQuery,
  useSsmSetCountsQuery,
  useCaseSetCountsQuery,
} from "@gff/core";

const ENTITY_TYPE_TO_QUERY_HOOK = {
  cohort: useSetOperationsCasesTotalQuery,
  genes: useSetOperationGeneTotalQuery,
  mutations: useSetOperationSsmTotalQuery,
};

const ENTITY_TYPE_TO_COUNT_HOOK = {
  cohort: useCaseSetCountsQuery,
  genes: useGeneSetCountsQuery,
  mutations: useSsmSetCountsQuery,
};

interface SetOperationsPanelProps {
  selectedEntities: SelectedEntities;
  setSelectedEntities: (SelectedEntities) => void;
  selectedEntityType: SetOperationEntityType;
  setSelectedEntityType: (SetOperationEntityType) => void;
  isLoading: boolean;
}

const SetOperationsPanel = ({
  selectedEntities,
  setSelectedEntities,
  selectedEntityType,
  setSelectedEntityType,
  isLoading,
}: SetOperationsPanelProps) => {
  const { selectionScreenOpen, setSelectionScreenOpen, app, setActiveApp } =
    useContext(SelectionScreenContext);

  return (
    <>
      {selectionScreenOpen ? (
        <SelectionPanel
          app={app}
          setActiveApp={setActiveApp}
          setOpen={setSelectionScreenOpen}
          selectedEntities={selectedEntities}
          setSelectedEntities={setSelectedEntities}
          selectedEntityType={selectedEntityType}
          setSelectedEntityType={setSelectedEntityType}
        />
      ) : selectedEntities.length === 0 || isLoading ? (
        <div className="flex flex-row items-center justify-center w-100 h-96">
          <Loader size={100} />
        </div>
      ) : selectedEntities.length === 2 ? (
        <SetOperationsTwo
          sets={selectedEntities}
          entityType={selectedEntityType}
          queryHook={ENTITY_TYPE_TO_QUERY_HOOK[selectedEntityType]}
          countHook={ENTITY_TYPE_TO_COUNT_HOOK[selectedEntityType]}
        />
      ) : (
        <SetOperationsThree
          sets={selectedEntities}
          entityType={selectedEntityType}
          queryHook={ENTITY_TYPE_TO_QUERY_HOOK[selectedEntityType]}
          countHook={ENTITY_TYPE_TO_COUNT_HOOK[selectedEntityType]}
        />
      )}
    </>
  );
};

export default SetOperationsPanel;
