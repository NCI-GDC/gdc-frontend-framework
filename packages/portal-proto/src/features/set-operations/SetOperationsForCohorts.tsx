import { useContext, useEffect, useMemo } from "react";
import {
  useCoreSelector,
  useCreateCaseSetFromFiltersMutation,
  buildCohortGqlOperator,
  useSetOperationsCasesTotalQuery,
  useCaseSetCountsQuery,
  getCohortFilterForAPI,
  selectAllCohorts,
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

  // get all cohorts, and filter down to the ones that are selected
  const allCohorts = useCoreSelector((state) => selectAllCohorts(state));

  const cohorts = useMemo(() => {
    return selectedEntities.map((se) => allCohorts[se.id]);
  }, [selectedEntities, allCohorts]);

  // if the cohorts are not already case sets, create them
  useEffect(() => {
    createSet0({
      filters: buildCohortGqlOperator(getCohortFilterForAPI(cohorts[0])),
    });
    createSet1({
      filters: buildCohortGqlOperator(getCohortFilterForAPI(cohorts[1])),
    });
    if (cohorts.length == 3)
      createSet2({
        filters: buildCohortGqlOperator(getCohortFilterForAPI(cohorts[2])),
      });
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //
  const loading =
    createSet0Response.isUninitialized ||
    createSet0Response.isLoading ||
    createSet1Response.isUninitialized ||
    createSet1Response.isLoading ||
    (cohorts.length == 3 && // if there are 3 cohorts, check the third one
      (createSet2Response.isUninitialized || createSet2Response.isLoading));

  // create the sets that will be used for the set operations
  const selectedSets = useMemo(() => {
    return [
      { name: cohorts[0].name, id: createSet0Response.data },
      { name: cohorts[1].name, id: createSet1Response.data },
      ...(cohorts.length == 3
        ? [{ name: cohorts[2].name, id: createSet2Response.data }]
        : []),
    ];
  }, [
    cohorts,
    createSet0Response.data,
    createSet1Response.data,
    createSet2Response.data,
  ]);

  return (
    <>
      {selectedEntities.length === 0 || loading ? (
        <div className="flex flex-row items-center justify-center w-100 h-96">
          <Loader size={100} />
        </div>
      ) : selectedEntities.length === 2 ? (
        <SetOperationsTwo
          sets={selectedSets}
          entityType={selectedEntityType}
          queryHook={useSetOperationsCasesTotalQuery}
          countHook={useCaseSetCountsQuery}
        />
      ) : (
        <SetOperationsThree
          sets={selectedSets}
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
}: SetOperationsForGenesSSMSCasesProps): JSX.Element => {
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
