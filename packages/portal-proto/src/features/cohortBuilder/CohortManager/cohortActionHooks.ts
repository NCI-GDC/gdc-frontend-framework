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
} from "@gff/core";
import { useCohortFacetFilters } from "../utils";
import { exportCohort } from "./cohortUtils";

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

  return [handleExport, { isFetching, isError }];
};

export const useImportCohort = () => {
  const coreDispatch = useCoreDispatch();

  const handleImport = useDeepCompareCallback(() => {
    coreDispatch(showModal({ modal: Modals.ImportCohortModal }));
  }, [coreDispatch]);

  return handleImport;
};
