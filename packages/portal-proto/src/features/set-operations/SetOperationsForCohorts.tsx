import { useContext, useEffect, useMemo } from "react";

import {
  useCoreSelector,
  useCreateCaseSetFromFiltersMutation,
  buildCohortGqlOperator,
  selectManyCohortsById,
} from "@gff/core";
import { showNotification } from "@mantine/notifications";
import { SetOperationsForGenesSSMSCasesProps } from "@/features/set-operations/types";
import { useAppDispatch, useAppSelector } from "./appApi";
import {
  registerCohortCaseSet,
  classifyIfManyCohortsNeedForCaseSet,
  selectCaseSetsFromCohort,
} from "./cohortCaseSetsSlice";
import SetOperationsPanel from "@/features/set-operations/SetOperationsPanel";
import { SelectionScreenContext } from "@/features/user-flow/workflow/AnalysisWorkspace";

const SetOperationsForCohorts = ({
  selectedEntities,
  setSelectedEntities,
  selectedEntityType,
  setSelectedEntityType,
}: SetOperationsForGenesSSMSCasesProps) => {
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
  const mappedCohorts = useMemo(
    () =>
      cohorts.reduce((acc, cohort) => {
        acc[cohort.id] = cohort;
        return acc;
      }, {}),
    [cohorts],
  );

  const needCaseSets = useAppSelector((state) =>
    classifyIfManyCohortsNeedForCaseSet(state, mappedCohorts),
  );

  const cohortSelectedEntities = useAppSelector((state) =>
    selectCaseSetsFromCohort(state, cohorts),
  );

  const numNeededToCreateOrUpdate = Object.values(needCaseSets).filter(
    (cmd) => cmd === "create" || cmd === "update",
  ).length;

  const responses = useMemo(
    () => [createSet0Response, createSet1Response, createSet2Response],
    [createSet0Response, createSet1Response, createSet2Response],
  );

  const creatingCohortSets =
    cohortSelectedEntities.length != selectedEntities.length &&
    numNeededToCreateOrUpdate > 0 &&
    responses.some((response) => response.isLoading);

  console.log("cohorts", cohorts);
  console.log("needCaseSets", needCaseSets);
  console.log("responses", responses);
  useEffect(() => {
    if (selectedEntityType !== "cohort") return;

    const creators = [createSet0, createSet1, createSet2];

    // check if we need to create a case set for any of the selected cohorts
    if (!selectionScreenOpen) {
      Object.keys(needCaseSets).forEach((key, index) => {
        const cohort = mappedCohorts[key];
        const filters = buildCohortGqlOperator(cohort.filters) ?? {};
        console.log(
          "responses[index].isUninitialized",
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
            set_id: cohort.id,
          }).then((result) => {
            console.log("result", result);
            if ("data" in result) {
              dispatch(
                registerCohortCaseSet({
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
      isLoading={creatingCohortSets}
    />
  );
};

export default SetOperationsForCohorts;
