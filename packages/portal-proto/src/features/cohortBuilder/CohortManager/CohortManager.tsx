import React, { useCallback, useEffect, useState } from "react";
import { LoadingOverlay, Tooltip } from "@mantine/core";
import { useRouter } from "next/router";
import {
  selectAvailableCohorts,
  addNewDefaultUnsavedCohort,
  removeCohort,
  selectCurrentCohortName,
  selectCurrentCohortModified,
  useCoreDispatch,
  useCoreSelector,
  discardCohortChanges,
  useDeleteCohortMutation,
  selectCurrentCohortId,
  selectCurrentCohort,
  useUpdateCohortMutation,
  setCohortMessage,
  useLazyGetCohortByIdQuery,
  buildGqlOperationToFilterSet,
  buildCohortGqlOperator,
  Modals,
  selectCurrentModal,
  useGetCasesQuery,
  Operation,
  updateActiveCohortFilter,
  addNewUnsavedCohort,
  showModal,
  setActiveCohort,
  useCurrentCohortCounts,
  selectHasUnsavedCohorts,
  addNewSavedCohort,
  hideModal,
  selectCurrentCohortSaved,
  FilterSet,
  DataStatus,
} from "@gff/core";
import { FaUndo as DiscardIcon } from "react-icons/fa";
import { useCohortFacetFilters } from "../utils";
import { omit } from "lodash";
import { useDeepCompareEffect, useDeepCompareMemo } from "use-deep-compare";
import { exportCohort, removeQueryParamsFromRouter } from "./cohortUtils";
import CohortActions from "./CohortActions";
import CohortSelector from "./CohortSelector";
import { CohortModals } from "./CohortModals";
import { CohortGroupButton } from "../style";

const CohortManager: React.FC = () => {
  const [exportCohortPending, setExportCohortPending] = useState(false);
  const coreDispatch = useCoreDispatch();
  const router = useRouter();

  const cohorts = useCoreSelector(selectAvailableCohorts);
  const currentCohort = useCoreSelector(selectCurrentCohort);
  const cohortName = useCoreSelector(selectCurrentCohortName);
  const cohortModified = useCoreSelector(selectCurrentCohortModified);
  const cohortSaved = useCoreSelector(selectCurrentCohortSaved);
  const cohortId = useCoreSelector(selectCurrentCohortId);
  const filters = useCohortFacetFilters(); // make sure using this one //TODO maybe use from one amongst the selectors
  const counts = useCurrentCohortCounts();
  const hasUnsavedCohorts = useCoreSelector(selectHasUnsavedCohorts);
  const modal = useCoreSelector(selectCurrentModal);

  const cohortStatusMessage = cohortSaved
    ? "Changes not saved"
    : "Cohort not saved";
  const isSavedUnchanged = cohortSaved && !cohortModified;

  // Cohort persistence
  const [deleteCohortFromBE, { isLoading: isDeleteCohortLoading }] =
    useDeleteCohortMutation();
  const [updateCohort, { isLoading: isUpdateCohortLoading }] =
    useUpdateCohortMutation();
  const [trigger, { isFetching: isCohortIdFetching }] =
    useLazyGetCohortByIdQuery();

  const [showDelete, setShowDelete] = useState(false);
  const [showDiscard, setShowDiscard] = useState(false);
  const [showSaveCohort, setShowSaveCohort] = useState(false);
  const [showSaveAsCohort, setShowSaveAsCohort] = useState(false);
  const [showUpdateCohort, setShowUpdateCohort] = useState(false);

  const {
    data: caseIds,
    isFetching: isFetchingCaseIds,
    isError: isErrorCaseIds,
  } = useGetCasesQuery(
    {
      request: {
        case_filters: buildCohortGqlOperator(
          currentCohort?.filters ?? undefined,
        ),
        fields: ["case_id"],
        size: 50000,
      },
      fetchAll: true,
    },
    { skip: !exportCohortPending },
  );

  useDeepCompareEffect(() => {
    if (isErrorCaseIds) {
      setExportCohortPending(false);
    } else if (exportCohortPending && !isFetchingCaseIds) {
      exportCohort(caseIds?.hits, cohortName);
      setExportCohortPending(false);
    }
  }, [
    isFetchingCaseIds,
    isErrorCaseIds,
    exportCohortPending,
    caseIds,
    cohortName,
  ]);

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
          message: "newCohort",
        }),
      );

      removeQueryParamsFromRouter(router, ["operation", "filters", "name"]);
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cohortList = useDeepCompareMemo(
    () =>
      cohorts
        .sort((a, b) => (a.modified_datetime <= b.modified_datetime ? 1 : -1))
        .map((x) => ({
          value: x.id,
          label: x.name,
          isSavedUnchanged: x.saved && !x.modified,
          cohortStatusMessage: x.saved
            ? "Changes not saved"
            : "Cohort not saved",
        })),
    [cohorts],
  );

  const discardChanges = useCallback(
    (filters: FilterSet | undefined) => {
      coreDispatch(discardCohortChanges({ filters, showMessage: true }));
    },
    [coreDispatch],
  );

  const deleteCohort = useCallback(() => {
    coreDispatch(removeCohort({ shouldShowMessage: true }));
    // fetch case counts is now handled in listener
  }, [coreDispatch]);

  const handleExport = useCallback(() => {
    setExportCohortPending(true);
  }, []);

  const handleUpdate = useCallback(async () => {
    const filteredCohortFilters = omit(filters, "isLoggedIn");
    const updateBody = {
      id: cohortId,
      name: cohortName,
      type: "dynamic",
      filters:
        Object.keys(filteredCohortFilters.root).length > 0
          ? buildCohortGqlOperator(filteredCohortFilters)
          : {},
    };

    try {
      const response = await updateCohort(updateBody).unwrap();
      coreDispatch(
        setCohortMessage([`savedCurrentCohort|${cohortName}|${cohortId}`]),
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
  }, [cohortId, cohortName, filters, updateCohort, coreDispatch, counts]);

  const handleCohortChange = useCallback(
    (cohortId: string) => {
      coreDispatch(setActiveCohort(cohortId));
    },
    [coreDispatch],
  );

  const handleDiscard = useCallback(() => {
    if (currentCohort.saved) {
      trigger(cohortId)
        .unwrap()
        .then((payload) => {
          discardChanges(buildGqlOperationToFilterSet(payload.filters));
        })
        .catch(() =>
          coreDispatch(setCohortMessage(["error|discarding|allId"])),
        );
    } else {
      discardChanges(undefined);
    }
  }, [currentCohort?.saved, trigger, cohortId, discardChanges, coreDispatch]);

  const handleDelete = useCallback(async () => {
    // only delete cohort from BE if it's been saved before
    if (currentCohort?.saved) {
      try {
        // don't delete it from the local adapter if not able to delete from the BE
        await deleteCohortFromBE(cohortId).unwrap();
        deleteCohort();
      } catch {
        coreDispatch(setCohortMessage(["error|deleting|allId"]));
      }
    } else {
      deleteCohort();
    }
  }, [
    currentCohort?.saved,
    deleteCohortFromBE,
    cohortId,
    deleteCohort,
    coreDispatch,
  ]);

  const handleImport = useCallback(() => {
    coreDispatch(showModal({ modal: Modals.ImportCohortModal }));
  }, [coreDispatch]);

  const handleAdd = useCallback(() => {
    coreDispatch(addNewDefaultUnsavedCohort());
  }, [coreDispatch]);

  const updateCohortFilters = useCallback(
    (field: string, operation: Operation) => {
      coreDispatch(updateActiveCohortFilter({ field, operation }));
    },
    [coreDispatch],
  );

  return (
    <div
      data-tour="cohort_management_bar"
      className="flex flex-row items-center justify-start gap-6 px-4 h-18 shadow-lg bg-primary"
    >
      {(isCohortIdFetching ||
        isDeleteCohortLoading ||
        isUpdateCohortLoading) && (
        <LoadingOverlay data-testid="loading-spinner" visible />
      )}

      <div className="border-opacity-0">
        <div className="flex flex-wrap gap-2 lg:gap-4">
          <div className="flex justify-center items-center">
            <Tooltip
              label="Discard Unsaved Changes"
              position="bottom"
              withArrow
            >
              <span>
                <CohortGroupButton
                  data-testid="discardButton"
                  onClick={() => setShowDiscard(true)}
                  disabled={!cohortModified}
                  $isDiscard={true}
                  aria-label="Discard cohort changes"
                >
                  <DiscardIcon aria-hidden="true" />
                </CohortGroupButton>
              </span>
            </Tooltip>

            <CohortSelector
              cohortId={cohortId}
              cohortList={cohortList}
              isSavedUnchanged={isSavedUnchanged}
              cohortStatusMessage={cohortStatusMessage}
              onCohortChange={handleCohortChange}
            />
          </div>
          <CohortActions
            onSave={() =>
              currentCohort?.saved
                ? setShowUpdateCohort(true)
                : setShowSaveCohort(true)
            }
            onSaveAs={() => setShowSaveAsCohort(true)}
            onAdd={handleAdd}
            onDelete={() => setShowDelete(true)}
            onImport={handleImport}
            onExport={handleExport}
            isModified={cohortModified}
            isSaved={cohortSaved}
            hasUnsavedCohorts={hasUnsavedCohorts}
            isExporting={exportCohortPending}
          />
        </div>
      </div>

      <CohortModals
        currentCohort={currentCohort}
        cohortName={cohortName}
        cohortId={cohortId}
        filters={filters}
        modal={modal}
        showDelete={showDelete}
        showDiscard={showDiscard}
        showSaveCohort={showSaveCohort}
        showSaveAsCohort={showSaveAsCohort}
        showUpdateCohort={showUpdateCohort}
        onHideModal={() => coreDispatch(hideModal())}
        onSetShowDelete={setShowDelete}
        onSetShowDiscard={setShowDiscard}
        onSetShowSaveCohort={setShowSaveCohort}
        onSetShowSaveAsCohort={setShowSaveAsCohort}
        onSetShowUpdateCohort={setShowUpdateCohort}
        onUpdateCohort={handleUpdate}
        onDiscardChanges={handleDiscard}
        onDeleteCohort={handleDelete}
        updateFilters={updateCohortFilters}
      />
    </div>
  );
};

export default CohortManager;
