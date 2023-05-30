import { FC, useContext, useEffect, useState } from "react";
import {
  useGeneSetCountsQuery,
  useSetOperationGeneTotalQuery,
  useSetOperationSsmTotalQuery,
  useSetOperationsCasesTotalQuery,
  useSsmSetCountsQuery,
  useCreateSsmsSetFromFiltersMutation,
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
import { Loader } from "@mantine/core";

const ENTITY_TYPE_TO_QUERY_HOOK = {
  cohort: useSetOperationsCasesTotalQuery,
  genes: useSetOperationGeneTotalQuery,
  mutations: useSetOperationSsmTotalQuery,
};

const ENTITY_TYPE_TO_COUNT_HOOK = {
  genes: useGeneSetCountsQuery,
  mutations: useSsmSetCountsQuery,
};

const DEMO_SETS = [
  {
    name: "Bladder, High impact, Muse",
    id: "demo-bladder-high-muse",
    filters: {
      content: [
        {
          content: {
            field: "cases.primary_site",
            value: ["Bladder"],
          },
          op: "in",
        },
        {
          content: {
            field: "ssms.consequence.transcript.annotation.vep_impact",
            value: ["HIGH"],
          },
          op: "in",
        },
        {
          content: {
            field:
              "ssms.occurrence.case.observation.variant_calling.variant_caller",
            value: ["muse"],
          },
          op: "in",
        },
      ],
      op: "and",
    },
  },
  {
    name: "Bladder, High impact, Mutect2",
    id: "demo-bladder-high-mutect2",
    filters: {
      content: [
        {
          content: {
            field: "cases.primary_site",
            value: ["Bladder"],
          },
          op: "in",
        },
        {
          content: {
            field: "ssms.consequence.transcript.annotation.vep_impact",
            value: ["HIGH"],
          },
          op: "in",
        },
        {
          content: {
            field:
              "ssms.occurrence.case.observation.variant_calling.variant_caller",
            value: ["mutect2"],
          },
          op: "in",
        },
      ],
      op: "and",
    },
  },
  {
    name: "Bladder, High impact, Varscan2",
    id: "demo-bladder-high-varscan2",
    filters: {
      content: [
        {
          content: {
            field: "cases.primary_site",
            value: ["Bladder"],
          },
          op: "in",
        },
        {
          content: {
            field: "ssms.consequence.transcript.annotation.vep_impact",
            value: ["HIGH"],
          },
          op: "in",
        },
        {
          content: {
            field:
              "ssms.occurrence.case.observation.variant_calling.variant_caller",
            value: ["varscan2"],
          },
          op: "in",
        },
      ],
      op: "and",
    },
  },
];

const SetOperationsApp: FC = () => {
  const isDemoMode = useIsDemoApp();
  const [selectedEntities, setSelectedEntities] = useState<SelectedEntities>(
    isDemoMode ? DEMO_SETS : [],
  );
  const [selectedEntityType, setSelectedEntityType] = useState<
    SetOperationEntityType | undefined
  >(isDemoMode ? "mutations" : undefined);

  const { data: demoCounts, isSuccess: demoCountsSuccess } =
    useSsmSetCountsQuery(
      {
        setIds: DEMO_SETS.map((set) => set.id),
      },
      { skip: !isDemoMode },
    );
  const [createDemoSet1, demoSetResponse1] =
    useCreateSsmsSetFromFiltersMutation();
  const [createDemoSet2, demoSetResponse2] =
    useCreateSsmsSetFromFiltersMutation();
  const [createDemoSet3, demoSetResponse3] =
    useCreateSsmsSetFromFiltersMutation();

  const needsToCreateSets =
    demoCountsSuccess &&
    Object.values(demoCounts || {}).some((count) => count === 0);

  const creatingDemoSets =
    needsToCreateSets &&
    (!demoSetResponse1.isSuccess ||
      !demoSetResponse2.isSuccess ||
      !demoSetResponse3.isSuccess);

  useEffect(() => {
    if (isDemoMode) {
      setSelectedEntities(DEMO_SETS);
      setSelectedEntityType("mutations");

      if (needsToCreateSets) {
        createDemoSet1({
          filters: DEMO_SETS[0].filters,
          set_id: DEMO_SETS[0].id,
        });
        createDemoSet2({
          filters: DEMO_SETS[1].filters,
          set_id: DEMO_SETS[1].id,
        });
        createDemoSet3({
          filters: DEMO_SETS[2].filters,
          set_id: DEMO_SETS[2].id,
        });
      }
    }
  }, [
    isDemoMode,
    needsToCreateSets,
    createDemoSet1,
    createDemoSet2,
    createDemoSet3,
  ]);

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
  ) : selectedEntities.length === 0 ||
    (isDemoMode && (!demoCountsSuccess || creatingDemoSets)) ? (
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
  );
};

export default SetOperationsApp;
