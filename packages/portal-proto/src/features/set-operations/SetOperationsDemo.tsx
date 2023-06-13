import {
  useCreateSsmsSetFromFiltersMutation,
  useSsmSetCountsQuery,
} from "@gff/core";
import { useEffect, useState } from "react";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import {
  SelectedEntities,
  SetOperationEntityType,
} from "@/features/set-operations/types";
import SetOperationsPanel from "@/features/set-operations/SetOperationsPanel";

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

const SetOperationsDemo = () => {
  const isDemoMode = useIsDemoApp();
  const [selectedEntities, setSelectedEntities] =
    useState<SelectedEntities>(DEMO_SETS);
  const [selectedEntityType, setSelectedEntityType] =
    useState<SetOperationEntityType>("mutations");

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

  return (
    <SetOperationsPanel
      selectedEntities={selectedEntities}
      selectedEntityType={selectedEntityType}
      setSelectedEntities={setSelectedEntities}
      setSelectedEntityType={setSelectedEntityType}
      isLoading={isDemoMode && (!demoCountsSuccess || creatingDemoSets)}
    />
  );
};

export default SetOperationsDemo;
