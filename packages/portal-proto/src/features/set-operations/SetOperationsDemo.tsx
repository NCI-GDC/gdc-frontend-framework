import { useEffect } from "react";
import {
  GqlOperation,
  useCreateSsmsSetFromFiltersMutation,
  useSsmSetCountsQuery,
} from "@gff/core";
import SetOperationsChartsForGeneSSMS from "@/features/set-operations/SetOperationsChartsForGeneSSMS";

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

const SetOperationsDemo = (): JSX.Element => {
  const { data: demoCounts, isSuccess: demoCountsSuccess } =
    useSsmSetCountsQuery({
      setIds: DEMO_SETS.map((set) => set.id),
    });
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
    if (needsToCreateSets) {
      createDemoSet1({
        filters: DEMO_SETS[0].filters as GqlOperation,
        set_id: DEMO_SETS[0].id,
      });
      createDemoSet2({
        filters: DEMO_SETS[1].filters as GqlOperation,
        set_id: DEMO_SETS[1].id,
      });
      createDemoSet3({
        filters: DEMO_SETS[2].filters as GqlOperation,
        set_id: DEMO_SETS[2].id,
      });
    }
  }, [needsToCreateSets, createDemoSet1, createDemoSet2, createDemoSet3]);

  return (
    <SetOperationsChartsForGeneSSMS
      selectedEntities={DEMO_SETS}
      selectedEntityType="mutations"
      isLoading={!demoCountsSuccess || creatingDemoSets}
    />
  );
};

export default SetOperationsDemo;
