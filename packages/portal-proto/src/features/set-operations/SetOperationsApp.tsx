import { FC, useContext, useEffect, useState } from "react";
import { PersistGate } from "redux-persist/integration/react";
import {
  useCoreDispatch,
  useCoreSelector,
  useGeneSetCountsQuery,
  useSetOperationGeneTotalQuery,
  useSetOperationSsmTotalQuery,
  useSetOperationsCasesTotalQuery,
  useSsmSetCountsQuery,
  useCreateSsmsSetFromFiltersMutation,
  useCreateCaseSetFromFiltersMutation,
  addSet,
  selectAvailableCohortsAsMap,
} from "@gff/core";
import {
  SetOperationsTwo,
  SetOperationsThree,
} from "@/features/set-operations/SetOperations";
import SelectionPanel from "@/features/set-operations/SelectionPanel";
import { SelectionScreenContext } from "../user-flow/workflow/AnalysisWorkspace";
import {
  SelectedEntity,
  SelectedEntities,
  SetOperationEntityType,
} from "../set-operations/types";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import { Loader } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { persistStore } from "redux-persist";
import { AppStore } from "./appApi";

const persistor = persistStore(AppStore);

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

// process the selected cohorts, creating a set for each one
// TODO remove eslint disable once we have a real implementation
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useCreateCaseSetFromCohorts = (
  selectedEntityType: SetOperationEntityType,
  entity: SelectedEntity,
) => {
  const [createSet, response] = useCreateCaseSetFromFiltersMutation();
  const cohorts = useCoreSelector((state) =>
    selectAvailableCohortsAsMap(state),
  );
  const dispatch = useCoreDispatch();

  if (selectedEntityType !== "cohort") return true;

  const filters = cohorts[entity.id].filters ?? {};
  createSet({
    filters: filters,
    size: cohorts[entity.id].caseCount,
    sort: "case.project.project_id",
    id: `set-ops-cohort-${entity.id}`,
  }).then((result) => {
    if ("data" in result) {
      dispatch(
        addSet({
          setType: "cases",
          setName: entity.name,
          setId: result.data as string,
        }),
      );
    } else if (result.error) {
      showNotification({ message: "Problem saving set.", color: "red" });
      return { isError: true, error: result.error };
    }
  });
  return response.isSuccess;
};

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

  return (
    <>
      <PersistGate persistor={persistor}>
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
        )}
      </PersistGate>
    </>
  );
};

export default SetOperationsApp;
