import { useContext, useEffect, useMemo } from "react";
import {
  useCoreSelector,
  useCreateCaseSetFromFiltersMutation,
  buildCohortGqlOperator,
  selectManyCohortsById,
  useSetOperationsCasesTotalQuery,
  useCaseSetCountsQuery,
} from "@gff/core";
import { showNotification } from "@mantine/notifications";
import {
  SetOperationsForGenesSSMSCasesProps,
  SetOperationsInputProps,
} from "@/features/set-operations/types";
import { useAppDispatch, useAppSelector } from "./appApi";
import {
  registerCohortCaseSet,
  classifyIfManyCohortsNeedForCaseSet,
  selectCaseSetsFromCohort,
} from "./cohortCaseSetsSlice";
import { SelectionScreenContext } from "@/features/user-flow/workflow/AnalysisWorkspace";
import { Loader } from "@mantine/core";
import {
  SetOperationsThree,
  SetOperationsTwo,
} from "@/features/set-operations/SetOperations";
import SelectionPanel from "@/features/set-operations/SelectionPanel";

/**
 * This component handles the case when the user has selected cohorts for set operations.
 * It will determine if the cohorts need to be converted to case sets, and create them if needed.
 * @param selectedEntities
 * @param selectedEntityType
 * @constructor
 */
const SetOperationsForCohortsTwoOrThree = ({
  selectedEntities,
  selectedEntityType,
}: SetOperationsInputProps) => {
  // const [cohortSetEntities, setCohortSetEntities] = useState<SelectedEntities>([]);
  const [createSet0, createSet0Response] =
    useCreateCaseSetFromFiltersMutation();
  const [createSet1, createSet1Response] =
    useCreateCaseSetFromFiltersMutation();
  const [createSet2, createSet2Response] =
    useCreateCaseSetFromFiltersMutation();
  const dispatch = useAppDispatch();
  // get the list of selected cohorts
  const cohorts = useCoreSelector((state) =>
    selectManyCohortsById(
      state,
      selectedEntities.map((x) => x.id),
    ),
  );
  const mappedCohorts = useMemo(() => {
    console.log("mapping cohorts", cohorts);
    return cohorts.reduce((acc, cohort) => {
      acc[cohort.id] = cohort;
      return acc;
    }, {});
  }, [cohorts]);

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
    const creators = [createSet0, createSet1, createSet2];

    // check if we need to create a case set for any of the selected cohorts
    Object.keys(needCaseSets).forEach((key, index) => {
      const cohort = mappedCohorts[key];
      const filters = buildCohortGqlOperator(cohort.filters) ?? {};
      if (needCaseSets[key] === "create" && responses[index].isUninitialized) {
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
  ]);

  return (
    <>
      {selectedEntities.length === 0 || creatingCohortSets ? (
        <div className="flex flex-row items-center justify-center w-100 h-96">
          <Loader size={100} />
        </div>
      ) : selectedEntities.length === 2 ? (
        <SetOperationsTwo
          sets={selectedEntities}
          entityType={selectedEntityType}
          queryHook={useSetOperationsCasesTotalQuery}
          countHook={useCaseSetCountsQuery}
        />
      ) : (
        <SetOperationsThree
          sets={selectedEntities}
          entityType={selectedEntityType}
          queryHook={useSetOperationsCasesTotalQuery}
          countHook={useCaseSetCountsQuery}
        />
      )}{" "}
    </>
  );
};

const SetOperationsForCohorts = ({
  selectedEntities,
  setSelectedEntities,
  selectedEntityType,
  setSelectedEntityType,
}: SetOperationsForGenesSSMSCasesProps) => {
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
      ) : (
        <SetOperationsForCohortsTwoOrThree
          selectedEntities={selectedEntities}
          selectedEntityType={selectedEntityType}
        />
      )}
    </>
  );
};

export default SetOperationsForCohorts;
