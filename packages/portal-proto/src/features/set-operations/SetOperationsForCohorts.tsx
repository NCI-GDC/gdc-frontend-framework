import { useContext, useEffect, useMemo } from "react";
import {
  useCoreSelector,
  useCreateCaseSetFromFiltersMutation,
  buildCohortGqlOperator,
  selectManyCohortsById,
  useSetOperationsCasesTotalQuery,
  useCaseSetCountsQuery,
  getCohortFilterForAPI,
} from "@gff/core";
import {
  SetOperationsForGenesSSMSCasesProps,
  SetOperationsInputProps,
} from "@/features/set-operations/types";
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
  const [createSet0, createSet0Response] =
    useCreateCaseSetFromFiltersMutation();
  const [createSet1, createSet1Response] =
    useCreateCaseSetFromFiltersMutation();
  const [createSet2, createSet2Response] =
    useCreateCaseSetFromFiltersMutation();

  const cohorts = useCoreSelector((state) =>
    selectManyCohortsById(
      state,
      selectedEntities.map((x) => x.id),
    ),
  );

  const cohortSelectedEntities = useMemo(() => {
    return cohorts.map((cohort) => ({
      id: `setops-app-${cohort.id}`,
      name: cohort.name,
    }));
  }, [cohorts]);

  useEffect(() => {
    createSet0({
      filters: buildCohortGqlOperator(getCohortFilterForAPI(cohorts[0])),
      set_id: `setops-app-${cohorts[0].id}`,
    });
    createSet1({
      filters: buildCohortGqlOperator(getCohortFilterForAPI(cohorts[1])),
      set_id: `setops-app-${cohorts[1].id}`,
    });
    if (cohorts.length == 3)
      createSet2({
        filters: buildCohortGqlOperator(getCohortFilterForAPI(cohorts[2])),
        set_id: `setops-app-${cohorts[2].id}`,
      });
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loading =
    createSet0Response.isUninitialized ||
    createSet0Response.isLoading ||
    createSet1Response.isUninitialized ||
    createSet1Response.isLoading ||
    (cohorts.length == 3 &&
      (createSet2Response.isUninitialized || createSet2Response.isLoading));

  return (
    <>
      {selectedEntities.length === 0 || loading ? (
        <div className="flex flex-row items-center justify-center w-100 h-96">
          <Loader size={100} />
        </div>
      ) : selectedEntities.length === 2 ? (
        <SetOperationsTwo
          sets={cohortSelectedEntities}
          entityType={selectedEntityType}
          queryHook={useSetOperationsCasesTotalQuery}
          countHook={useCaseSetCountsQuery}
        />
      ) : (
        <SetOperationsThree
          sets={cohortSelectedEntities}
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
