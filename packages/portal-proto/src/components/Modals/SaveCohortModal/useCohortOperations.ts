import {
  removeCohort,
  copyToSavedCohort,
  buildCohortGqlOperator,
  setCurrentCohortId,
  updateCohortName,
  useCoreDispatch,
  FilterSet,
  addNewSavedCohort,
  buildGqlOperationToFilterSet,
  NullCountsData,
  useLazyGetCohortByIdQuery,
  showModal,
  Modals,
  fetchCohortCaseCounts,
  useCreateCaseSetFromFiltersMutation,
  CohortModel,
} from "@gff/core";

const useCohortOperations = () => {
  const coreDispatch = useCoreDispatch();
  const [createSet] = useCreateCaseSetFromFiltersMutation();
  const [fetchSavedFilters] = useLazyGetCohortByIdQuery();

  const createStaticCohortSet = async (
    filters: FilterSet,
    caseFilters?: FilterSet,
  ): Promise<FilterSet> => {
    try {
      const setId = await createSet({
        filters: buildCohortGqlOperator(filters),
        case_filters: buildCohortGqlOperator(caseFilters),
        intent: "portal",
        set_type: "frozen",
      }).unwrap();

      return {
        mode: "and",
        root: {
          "cases.case_id": {
            field: "cases.case_id",
            operands: [`set_id:${setId}`],
            operator: "includes",
          },
        },
      } as FilterSet;
    } catch (error) {
      coreDispatch(showModal({ modal: Modals.SaveCohortErrorModal }));
      throw new Error("Failed to create static cohort");
    }
  };

  const updateCohortState = async ({
    cohortPayload,
    newName,
    prevCohortId,
    setAsCurrent,
    saveAs,
  }: {
    cohortPayload: CohortModel;
    newName: string;
    prevCohortId?: string;
    setAsCurrent?: boolean;
    saveAs?: boolean;
  }) => {
    let tempCohortMsg: string[];

    if (prevCohortId) {
      if (saveAs) {
        coreDispatch(
          addNewSavedCohort({
            id: cohortPayload.id,
            name: cohortPayload.name,
            filters: buildGqlOperationToFilterSet(cohortPayload.filters),
            caseSet: { status: "uninitialized" },
            counts: {
              ...NullCountsData,
            },
            modified_datetime: cohortPayload.modified_datetime,
            saved: true,
            modified: false,
          }),
        );
        coreDispatch(setCurrentCohortId(cohortPayload.id));
        tempCohortMsg = [`savedCohort|${newName}|${cohortPayload.id}`];
      } else {
        coreDispatch(
          copyToSavedCohort({
            sourceId: prevCohortId,
            destId: cohortPayload.id,
          }),
        );
        // NOTE: the current cohort can not be undefined. Setting the id to a cohort
        // which does not exist will cause this
        // Therefore, copy the unsaved cohort to the new cohort id received from
        // the BE.

        // possible that the caseCount are undefined or pending so
        // re-request counts.
        coreDispatch(fetchCohortCaseCounts(cohortPayload.id)); // fetch counts for new cohort
        tempCohortMsg = [`savedCurrentCohort|${newName}|${cohortPayload.id}`];
        coreDispatch(
          removeCohort({
            shouldShowMessage: false,
            id: prevCohortId,
          }),
        );
        coreDispatch(setCurrentCohortId(cohortPayload.id));
        coreDispatch(updateCohortName(newName));
      }
    } else {
      coreDispatch(
        addNewSavedCohort({
          id: cohortPayload.id,
          name: cohortPayload.name,
          filters: buildGqlOperationToFilterSet(cohortPayload.filters),
          caseSet: { status: "uninitialized" },
          counts: {
            ...NullCountsData,
          },
          modified_datetime: cohortPayload.modified_datetime,
          saved: true,
          modified: false,
        }),
      );

      if (setAsCurrent) {
        coreDispatch(setCurrentCohortId(cohortPayload.id));
        tempCohortMsg = [`savedCohort|${newName}|${cohortPayload.id}`];
      } else {
        tempCohortMsg = [
          `savedCohortSetCurrent|${cohortPayload.name}|${cohortPayload.id}`,
        ];
      }
    }

    return tempCohortMsg;
  };

  return {
    createStaticCohortSet,
    updateCohortState,
    fetchSavedFilters,
    coreDispatch,
  };
};

export default useCohortOperations;
