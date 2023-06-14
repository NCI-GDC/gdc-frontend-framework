import { useContext, useEffect, useState } from "react";

import {
  useCoreSelector,
  useCreateCaseSetFromFiltersMutation,
  buildCohortGqlOperator,
  selectManyCohortsById,
} from "@gff/core";
import { showNotification } from "@mantine/notifications";
import {
  SelectedEntities,
  SetOperationEntityType,
} from "@/features/set-operations/types";
import { useAppDispatch, useAppSelector } from "./appApi";
import {
  addCohort,
  classifyIfManyCohortsNeedForCaseSet,
} from "./cohortCaseSetsSlice";
import SetOperationsPanel from "@/features/set-operations/SetOperationsPanel";
import { SelectionScreenContext } from "@/features/user-flow/workflow/AnalysisWorkspace";

// const useCreateNeededCaseSetsForCohorts = (selectedEntities: SelectedEntities) : Record<string, CohortSetCommand> => {
//
//   const [createSet0, createSet0Responce] = useCreateCaseSetFromFiltersMutation();
//   const [createSet1, createSet1Responce] = useCreateCaseSetFromFiltersMutation();
//   const [createSet2, createSet2Responce] = useCreateCaseSetFromFiltersMutation();
//
//   const cohorts = useCoreSelector((state) => selectManyCohortsById(state, selectedEntities.map(x => x.id)));
//   const needCaseSets = useAppSelector((state) => classifyIfManyCohortsNeedForCaseSet(state, cohorts));
//   console.log("needCaseSets", needCaseSets);
//   return needCaseSets;
// }

const SetOperationsForGenesSSMSCohorts = () => {
  const [selectedEntities, setSelectedEntities] = useState<SelectedEntities>(
    [],
  );
  const [selectedEntityType, setSelectedEntityType] = useState<
    SetOperationEntityType | undefined
  >(undefined);

  const { selectionScreenOpen } = useContext(SelectionScreenContext);

  const [createSet0, createSet0Response] =
    useCreateCaseSetFromFiltersMutation();
  const [createSet1, createSet1Response] =
    useCreateCaseSetFromFiltersMutation();
  const [createSet2, createSet2Response] =
    useCreateCaseSetFromFiltersMutation();
  const dispatch = useAppDispatch();
  const cohorts = useCoreSelector((state) =>
    selectManyCohortsById(
      state,
      selectedEntities.map((x) => x.id),
    ),
  );
  console.log("selectedEntities", selectedEntities);
  console.log("cohorts", cohorts);
  const mappedCohorts = cohorts.reduce((acc, cohort) => {
    acc[cohort.id] = cohort;
    return acc;
  }, {});
  const needCaseSets = useAppSelector((state) =>
    classifyIfManyCohortsNeedForCaseSet(state, mappedCohorts),
  );
  const numNeededToCreateOrUpdate = Object.values(needCaseSets).filter(
    (cmd) => cmd === "create" || cmd === "update",
  ).length;
  const responses = [
    createSet0Response,
    createSet1Response,
    createSet2Response,
  ];

  // const creatingCohortSets =
  //   numNeededToCreateOrUpdate > 0 && responses.some((response) => response.isLoading);

  console.log("numNeededToCreateOrUpdate", numNeededToCreateOrUpdate);
  console.log("responses", responses);
  useEffect(() => {
    if (selectedEntityType !== "cohort") return;

    const creators = [createSet0, createSet1, createSet2];

    // check if we need to create a case set for any of the selected cohorts
    if (!selectionScreenOpen) {
      console.log("needCaseSets", needCaseSets);
      Object.keys(needCaseSets).forEach((key, index) => {
        const cohort = mappedCohorts[key];
        const filters = buildCohortGqlOperator(cohort.filters) ?? {};
        console.log("needCaseSets[key]", needCaseSets[key], index);
        console.log(
          "responses[index].isUnititialized",
          responses[index].isUninitialized,
        );
        if (
          needCaseSets[key] === "create" &&
          responses[index].isUninitialized
        ) {
          console.log("creating case set for cohort", cohort);
          creators[index]({
            filters: filters,
            size: cohort.caseCount,
            sort: "case.project.project_id",
            id: `set-ops-cohort-${cohort.id}`,
          }).then((result) => {
            console.log("result", result);
            if ("data" in result) {
              console.log("result.data", result.data);
              dispatch(
                addCohort({
                  cohort: cohort,
                  createdFilters: cohort.filters,
                  caseSetId: result.data as string,
                }),
              );
            } else if (result.error) {
              showNotification({
                message: `Problem saving set from cohort: ${cohort.name}`,
                color: "red",
              });
              return false;
            }
          });
        }
      });
    }
  }, [
    cohorts,
    createSet0,
    createSet1,
    createSet2,
    dispatch,
    mappedCohorts,
    needCaseSets,
    responses,
    selectedEntities,
    selectedEntityType,
    selectionScreenOpen,
  ]);

  return (
    <SetOperationsPanel
      selectedEntities={selectedEntities}
      selectedEntityType={selectedEntityType}
      setSelectedEntities={setSelectedEntities}
      setSelectedEntityType={setSelectedEntityType}
      isLoading={false}
    />
  );
};

export default SetOperationsForGenesSSMSCohorts;
