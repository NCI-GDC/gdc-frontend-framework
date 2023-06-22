import { useEffect, useMemo } from "react";
import {
  useCoreSelector,
  useCreateCaseSetFromFiltersMutation,
  buildCohortGqlOperator,
  useSetOperationsCasesTotalQuery,
  useCaseSetCountsQuery,
  getCohortFilterForAPI,
  selectAllCohorts,
} from "@gff/core";
import { SetOperationsChartInputProps } from "@/features/set-operations/types";
import { Loader } from "@mantine/core";
import {
  SetOperationsThree,
  SetOperationsTwo,
} from "@/features/set-operations/SetOperations";

/**
 * This component handles the case when the user has selected cohorts for set operations.
 * It will render the selection panel if the user has not selected cohorts yet.
 * Otherwise, it will render the set operations for the selected cohorts
 * @param selectedEntities: the selected cohorts
 */
const SetOperationChartsForCohorts = ({
  selectedEntities,
}: SetOperationsChartInputProps): JSX.Element => {
  // set up three calls to create case set from filters for cohorts 0, 1, and 2
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
      // if there are 3 cohorts, create the third one
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

  return selectedEntities.length === 0 || loading ? (
    <div className="flex items-center justify-center w-100 h-96">
      <Loader size={100} />
    </div>
  ) : selectedEntities.length === 2 ? (
    <SetOperationsTwo
      sets={selectedSets}
      entityType="cohort"
      queryHook={useSetOperationsCasesTotalQuery}
      countHook={useCaseSetCountsQuery}
    />
  ) : (
    <SetOperationsThree
      sets={selectedSets}
      entityType="cohort"
      queryHook={useSetOperationsCasesTotalQuery}
      countHook={useCaseSetCountsQuery}
    />
  );
};

export default SetOperationChartsForCohorts;
