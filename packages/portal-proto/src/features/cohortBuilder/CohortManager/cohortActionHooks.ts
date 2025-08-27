import { useEffect } from "react";
import { useDeepCompareCallback } from "use-deep-compare";
import { useRouter } from "next/router";
import { omit } from "lodash";
import {
  useCoreDispatch,
  useCoreSelector,
  selectCurrentCohort as selectCurrentCohortFromStore,
  selectAvailableCohorts as selectCohortsFromStore,
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
  CohortModel,
  addNewUnsavedCohort,
} from "@gff/core";
import { useCohortFacetFilters } from "../utils";
import { exportCohort, removeQueryParamsFromRouter } from "./cohortUtils";

export const useSelectAvailableCohorts = () => {
  return useCoreSelector((state) => selectCohortsFromStore(state));
};

export const useSelectCurrentCohort = () => {
  return useCoreSelector((state) => selectCurrentCohortFromStore(state));
};

export const useAddUnsavedCohort = () => {
  const coreDispatch = useCoreDispatch();

  const handleAdd = () => {
    coreDispatch(addNewDefaultUnsavedCohort());
  };

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
    coreDispatch(removeCohort({}));
    // fetch case counts is now handled in listener
  }, [coreDispatch]);

  const handleDelete = useDeepCompareCallback(async () => {
    return new Promise<void>((resolve, reject) => {
      // only delete cohort from BE if it's been saved before
      if (currentCohort.saved) {
        // don't delete it from the local adapter if not able to delete from the BE
        deleteCohortFromBE(currentCohort.id)
          .unwrap()
          .then(() => {
            deleteCohort();
            resolve();
          })
          .catch(reject);
      } else {
        deleteCohort();
        resolve();
      }
    });
  }, [currentCohort, deleteCohortFromBE, deleteCohort]);

  return handleDelete;
};

export const useDiscardChanges = () => {
  const coreDispatch = useCoreDispatch();
  const currentCohort = useCoreSelector(selectCurrentCohortFromStore);
  const [getCohort] = useLazyGetCohortByIdQuery();

  const handleDiscard = useDeepCompareCallback(async () => {
    return new Promise<void>((resolve, reject) => {
      if (currentCohort.saved) {
        getCohort(currentCohort.id)
          .unwrap()
          .then((payload) => {
            coreDispatch(
              discardCohortChanges({
                filters: buildGqlOperationToFilterSet(payload.filters),
              }),
            );
            resolve();
          })
          .catch(reject);
      } else {
        coreDispatch(discardCohortChanges({ filters: undefined }));
        resolve();
      }
    });
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

  return {
    handleExport,
    status: { isFetching, isError },
  };
};

export const useImportCohort = () => {
  const coreDispatch = useCoreDispatch();

  const handleImport = useDeepCompareCallback(() => {
    coreDispatch(showModal({ modal: Modals.ImportCohortModal }));
  }, [coreDispatch]);

  return handleImport;
};

const useUpdateCohortState = () => {
  const coreDispatch = useCoreDispatch();
  const [fetchSavedFilters] = useLazyGetCohortByIdQuery();

  const updateCohortState = useDeepCompareCallback(
    ({
      payload,
      newName,
      cohortId,
      saveAs,
    }: {
      payload: CohortModel;
      newName: string;
      cohortId: string;
      saveAs: boolean;
    }) => {
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

          coreDispatch(
            removeCohort({
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

      if (saveAs) {
        // Should discard local changes from current cohort when saving as
        fetchSavedFilters(cohortId)
          .unwrap()
          .then((savedFilters) =>
            coreDispatch(
              discardCohortChanges({
                filters: buildGqlOperationToFilterSet(savedFilters.filters),
                id: cohortId,
              }),
            ),
          );
      }
    },
    [coreDispatch, fetchSavedFilters],
  );

  return updateCohortState;
};

const useCreateCohortRequest = () => {
  const [createSet] = useCreateCaseSetFromFiltersMutation();

  const createCohortRequest = async ({
    filters,
    caseFilters,
    newName,
    createStaticCohort,
  }: {
    filters: FilterSet;
    caseFilters: FilterSet;
    newName: string;
    createStaticCohort: boolean;
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

    return addBody;
  };

  return createCohortRequest;
};

export const useSaveCohort = () => {
  const [addCohort] = useAddCohortMutation();
  const updateCohortState = useUpdateCohortState();
  const createCohortRequest = useCreateCohortRequest();

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
      let result = { cohortAlreadyExists: false, newCohortId: undefined };

      const addBody = await createCohortRequest({
        filters,
        caseFilters,
        newName,
        createStaticCohort,
      });

      await addCohort({ cohort: addBody, delete_existing: false })
        .unwrap()
        .then(async (payload) => {
          updateCohortState({ payload, newName, cohortId, saveAs });

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
    [addCohort, updateCohortState, createCohortRequest],
  );

  return handleAddCohort;
};

export const useReplaceCohort = () => {
  const coreDispatch = useCoreDispatch();
  const cohorts = useCoreSelector(selectCohortsFromStore);
  const [addCohort] = useAddCohortMutation();
  const [fetchCohortList] = useLazyGetCohortsByContextIdQuery();
  const updateCohortState = useUpdateCohortState();
  const createCohortRequest = useCreateCohortRequest();

  const handleReplaceCohort = useDeepCompareCallback(
    async ({
      newName,
      filters,
      caseFilters,
      createStaticCohort,
      cohortId,
      saveAs,
    }: {
      newName: string;
      filters: FilterSet;
      caseFilters: FilterSet;
      createStaticCohort: boolean;
      cohortId: string;
      saveAs: boolean;
    }) => {
      const addBody = await createCohortRequest({
        filters,
        caseFilters,
        newName,
        createStaticCohort,
      });

      let result = { newCohortId: undefined };

      await addCohort({ cohort: addBody, delete_existing: true })
        .unwrap()
        .then((payload) => {
          updateCohortState({ payload, newName, cohortId, saveAs });
          result = { newCohortId: payload.id };
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

      return result;
    },
    [
      addCohort,
      cohorts,
      coreDispatch,
      fetchCohortList,
      updateCohortState,
      createCohortRequest,
    ],
  );

  return handleReplaceCohort;
};

const useCreateCohortExternally = (setCohortMessage) => {
  const coreDispatch = useCoreDispatch();
  const router = useRouter();

  useEffect(() => {
    const {
      operation,
      filters: createCohortFilters,
      name: createCohortName,
    } = router.query;

    if (operation == "createCohort") {
      const cohortFilters = JSON.parse(
        createCohortFilters as string,
      ) as FilterSet;
      coreDispatch(
        addNewUnsavedCohort({
          filters: cohortFilters,
          name: (createCohortName as string).replace(/-/g, " "),
          replace: true,
        }),
      );

      setCohortMessage([{ cmd: "newCohort", param1: createCohortName }]);

      removeQueryParamsFromRouter(router, ["operation", "filters", "name"]);
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export const cohortActionsHooks = {
  useSelectCurrentCohort,
  useSelectAvailableCohorts,
  useDeleteCohort,
  useDiscardChanges,
  useUpdateFilters,
  useSetActiveCohort,
  useAddUnsavedCohort,
  useExportCohort,
  useImportCohort,
  useSaveCohort,
  useReplaceCohort,
  useCreateCohortExternally,
};
