import { useDeepCompareCallback } from "use-deep-compare";
import { omit } from "lodash";
import {
  useCoreDispatch,
  useCoreSelector,
  selectCurrentCohort as selectCurrentCohortFromStore,
  selectAvailableCohorts as selectCohortsFromStore,
  setCohortMessage,
  useDeleteCohortMutation,
  removeCohort,
  useLazyGetCohortByIdQuery,
  discardCohortChanges,
  buildGqlOperationToFilterSet,
  DataStatus,
  useUpdateCohortMutation,
  buildCohortGqlOperator,
  useCurrentCohortCounts,
  addNewSavedCohort,
  showModal,
  Modals,
  setActiveCohort,
  addNewDefaultUnsavedCohort,
  useLazyGetCasesQuery,
  useAddCohortMutation,
  FilterSet,
  NullCountsData,
  useCreateCaseSetFromFiltersMutation,
  useLazyGetCohortsByContextIdQuery,
  copyToSavedCohort,
  fetchCohortCaseCounts,
  setCurrentCohortId,
  updateCohortName,
} from "@gff/core";
import { useCohortFacetFilters } from "../utils";
import { exportCohort } from "./cohortUtils";
import { saveAs } from "file-saver";

export const useSelectAvailableCohorts = () => {
  return useCoreSelector((state) => selectCohortsFromStore(state));
};

export const useSelectCurrentCohort = () => {
  return useCoreSelector((state) => selectCurrentCohortFromStore(state));
};

export const useAddUnsavedCohort = () => {
  const coreDispatch = useCoreDispatch();

  const handleAdd = useDeepCompareCallback(() => {
    coreDispatch(addNewDefaultUnsavedCohort());
  }, [coreDispatch]);

  return handleAdd;
};

export const useSetActiveCohort = () => {
  const coreDispatch = useCoreDispatch();

  const handleCohortChange = useDeepCompareCallback(
    (id: string) => {
      coreDispatch(setActiveCohort(id));
    },
    [coreDispatch],
  );

  return handleCohortChange;
};

export const useDeleteCohort = () => {
  const coreDispatch = useCoreDispatch();
  const currentCohort = useCoreSelector(selectCurrentCohortFromStore);

  const [deleteCohortFromBE] = useDeleteCohortMutation();
  const deleteCohort = useDeepCompareCallback(() => {
    coreDispatch(removeCohort({ shouldShowMessage: true }));
    // fetch case counts is now handled in listener
  }, [coreDispatch]);

  const handleDelete = useDeepCompareCallback(async () => {
    // only delete cohort from BE if it's been saved before
    if (currentCohort.saved) {
      try {
        // don't delete it from the local adapter if not able to delete from the BE
        await deleteCohortFromBE(currentCohort.id).unwrap();
        deleteCohort();
      } catch {
        coreDispatch(setCohortMessage(["error|deleting|allId"]));
      }
    } else {
      deleteCohort();
    }
  }, [currentCohort, deleteCohortFromBE, deleteCohort, coreDispatch]);

  return handleDelete;
};

export const useDiscardChanges = () => {
  const coreDispatch = useCoreDispatch();
  const currentCohort = useCoreSelector(selectCurrentCohortFromStore);
  const [getCohort] = useLazyGetCohortByIdQuery();

  const handleDiscard = useDeepCompareCallback(() => {
    if (currentCohort.saved) {
      getCohort(currentCohort.id)
        .unwrap()
        .then((payload) => {
          coreDispatch(
            discardCohortChanges({
              filters: buildGqlOperationToFilterSet(payload.filters),
              showMessage: true,
            }),
          );
        })
        .catch(() => {
          coreDispatch(setCohortMessage(["error|discarding|allId"]));
        });
    } else {
      coreDispatch(
        discardCohortChanges({ filters: undefined, showMessage: true }),
      );
    }
  }, [getCohort, currentCohort, coreDispatch]);

  return handleDiscard;
};

export const useUpdateFilters = () => {
  const coreDispatch = useCoreDispatch();
  const currentCohort = useCoreSelector(selectCurrentCohortFromStore);
  const filters = useCohortFacetFilters();
  const counts = useCurrentCohortCounts();

  const [updateCohort] = useUpdateCohortMutation();

  const updateFilters = useDeepCompareCallback(async () => {
    const filteredCohortFilters = omit(filters, "isLoggedIn");

    const updateBody = {
      id: currentCohort.id,
      name: currentCohort.name,
      type: "dynamic",
      filters:
        Object.keys(filteredCohortFilters.root).length > 0
          ? buildCohortGqlOperator(filteredCohortFilters)
          : {},
    };

    try {
      const response = await updateCohort(updateBody).unwrap();
      coreDispatch(
        setCohortMessage([
          `savedCurrentCohort|${currentCohort.name}|${currentCohort.id}`,
        ]),
      );
      const cohort = {
        id: response.id,
        name: response.name,
        filters: buildGqlOperationToFilterSet(response.filters),
        caseSet: {
          caseSetId: buildGqlOperationToFilterSet(response.filters),
          status: "fulfilled" as DataStatus,
        },
        counts: {
          ...counts.data,
          status: counts.status,
        },
        modified_datetime: response.modified_datetime,
      };
      coreDispatch(addNewSavedCohort(cohort));
    } catch {
      coreDispatch(showModal({ modal: Modals.SaveCohortErrorModal }));
    }
  }, [currentCohort, counts, filters, coreDispatch, updateCohort]);

  return updateFilters;
};

export const useExportCohort = () => {
  const currentCohort = useCoreSelector(selectCurrentCohortFromStore);
  const [getCases, { isFetching, isError }] = useLazyGetCasesQuery();

  const handleExport = useDeepCompareCallback(() => {
    getCases({
      request: {
        case_filters: buildCohortGqlOperator(
          currentCohort.filters ?? undefined,
        ),
        fields: ["case_id"],
        size: 50000,
      },
      fetchAll: true,
    })
      .unwrap()
      .then((payload) => {
        exportCohort(payload?.hits, currentCohort.name);
      });
  }, [currentCohort, getCases]);

  return [
    handleExport,
    { isFetching: isFetching as boolean, isError: isError as boolean },
  ];
};

export const useImportCohort = () => {
  const coreDispatch = useCoreDispatch();

  const handleImport = useDeepCompareCallback(() => {
    coreDispatch(showModal({ modal: Modals.ImportCohortModal }));
  }, [coreDispatch]);

  return handleImport;
};

const handleSaveCohort = (payload, newName, cohortId, saveAs, coreDispatch) => {
  if (cohortId) {
    if (saveAs) {
      coreDispatch(
        addNewSavedCohort({
          id: payload.id,
          name: payload.name,
          filters: buildGqlOperationToFilterSet(payload.filters),
          caseSet: { status: "uninitialized" },
          counts: {
            ...NullCountsData,
          },
          modified_datetime: payload.modified_datetime,
          saved: true,
          modified: false,
        }),
      );
    } else {
      coreDispatch(
        copyToSavedCohort({
          sourceId: cohortId,
          destId: payload.id,
        }),
      );
      // NOTE: the current cohort can not be undefined. Setting the id to a cohort
      // which does not exist will cause this
      // Therefore, copy the unsaved cohort to the new cohort id received from
      // the BE.

      // possible that the caseCount are undefined or pending so
      // re-request counts.
      coreDispatch(fetchCohortCaseCounts(payload.id)); // fetch counts for new cohort

      //tempCohortMsg = [`savedCurrentCohort|${newName}|${payload.id}`];

      coreDispatch(
        removeCohort({
          shouldShowMessage: false,
          id: cohortId,
        }),
      );
      coreDispatch(setCurrentCohortId(payload.id));
      coreDispatch(updateCohortName(newName));
    }
  } else {
    coreDispatch(
      addNewSavedCohort({
        id: payload.id,
        name: payload.name,
        filters: buildGqlOperationToFilterSet(payload.filters),
        caseSet: { status: "uninitialized" },
        counts: {
          ...NullCountsData,
        },
        modified_datetime: payload.modified_datetime,
        saved: true,
        modified: false,
      }),
    );
  }
};

export const useSaveCohort = () => {
  const coreDispatch = useCoreDispatch();
  const [addCohort] = useAddCohortMutation();
  const [createSet] = useCreateCaseSetFromFiltersMutation();

  const handleAddCohort = useDeepCompareCallback(
    async ({
      newName,
      cohortId,
      filters,
      caseFilters,
      createStaticCohort,
      saveAs,
    }: {
      newName: string;
      cohortId?: string;
      filters: FilterSet;
      caseFilters: FilterSet;
      createStaticCohort: boolean;
      saveAs: boolean;
    }) => {
      let cohortFilters = filters;

      if (createStaticCohort) {
        await createSet({
          filters: buildCohortGqlOperator(filters),
          case_filters: buildCohortGqlOperator(caseFilters),
          intent: "portal",
          set_type: "frozen",
        })
          .unwrap()
          .then((setId: string) => {
            cohortFilters = {
              mode: "and",
              root: {
                "cases.case_id": {
                  field: "cases.case_id",
                  operands: [`set_id:${setId}`],
                  operator: "includes",
                },
              },
            } as FilterSet;
          });
      }

      const filteredCohortFilters = omit(cohortFilters, "isLoggedIn");

      const addBody = {
        name: newName,
        type: "dynamic",
        filters:
          Object.keys(filteredCohortFilters.root).length > 0
            ? buildCohortGqlOperator(filteredCohortFilters)
            : {},
      };

      let result = {};

      await addCohort({ cohort: addBody, delete_existing: false })
        .unwrap()
        .then(async (payload) => {
          handleSaveCohort(payload, newName, cohortId, saveAs, coreDispatch);

          result = { cohortAlreadyExists: false, newCohortId: payload.id };
        })
        .catch((e) => {
          if (
            (e.data as { message: string })?.message ===
            "Bad Request: Name must be unique (case-insensitive)"
          ) {
            result = { cohortAlreadyExists: true, newCohortId: undefined };
          }
        });

      return result;
    },
    [addCohort, coreDispatch, createSet],
  );

  return [handleAddCohort];
};

export const useReplaceCohort = () => {
  const coreDispatch = useCoreDispatch();
  const cohorts = useCoreSelector(selectCohortsFromStore);
  const [addCohort] = useAddCohortMutation();
  const [fetchCohortList] = useLazyGetCohortsByContextIdQuery();

  const handleReplaceCohort = useDeepCompareCallback(
    async ({
      newName,
      filters,
      cohortId,
    }: {
      newName: string;
      filters: FilterSet;
      cohortId: string;
    }) => {
      const filteredCohortFilters = omit(filters, "isLoggedIn");

      const addBody = {
        name: newName,
        type: "dynamic",
        filters:
          Object.keys(filteredCohortFilters.root).length > 0
            ? buildCohortGqlOperator(filteredCohortFilters)
            : {},
      };

      await addCohort({ cohort: addBody, delete_existing: true })
        .unwrap()
        .then((payload) => {
          handleSaveCohort(payload, newName, cohortId, saveAs, coreDispatch);
        });

      await fetchCohortList()
        .unwrap()
        .then((payload) => {
          const updatedCohortIds = (payload || []).map((cohort) => cohort.id);

          // Find outdated cohorts
          const outdatedCohortsIds = cohorts
            .filter((c) => c.saved && !updatedCohortIds.includes(c.id))
            .map((c) => c.id);

          // Remove outdated cohorts
          outdatedCohortsIds.forEach((id) => {
            coreDispatch(removeCohort({ id }));
          });
        });

      return;
    },
    [addCohort, cohorts, coreDispatch, fetchCohortList],
  );

  return [handleReplaceCohort];
};
