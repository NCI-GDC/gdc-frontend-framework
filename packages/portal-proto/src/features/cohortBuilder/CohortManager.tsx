import React, { useCallback, useEffect, useState } from "react";
import { LoadingOverlay, Select, Loader, Tooltip } from "@mantine/core";
import { NextRouter, useRouter } from "next/router";
import {
  MdAdd as AddIcon,
  MdDelete as DeleteIcon,
  MdFileDownload as DownloadIcon,
  MdFileUpload as UploadIcon,
  MdSave as SaveIcon,
} from "react-icons/md";
import {
  FaCaretDown as DownArrowIcon,
  FaUndo as DiscardIcon,
} from "react-icons/fa";
import tw from "tailwind-styled-components";
import saveAs from "file-saver";
import { CohortManagerProps } from "@/features/cohortBuilder/types";
import {
  addNewCohort,
  removeCohort,
  copyCohort,
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
  FilterSet,
  buildGqlOperationToFilterSet,
  buildCohortGqlOperator,
  useAddCohortMutation,
  resetSelectedCases,
  Modals,
  selectCurrentModal,
  setCurrentCohortId,
  useGetCasesQuery,
  Operation,
  updateActiveCohortFilter,
  addNewCohortWithFilterAndMessage,
  showModal,
  DataStatus,
  setCohort,
  updateCohortName,
} from "@gff/core";
import { useCohortFacetFilters } from "./utils";
import CohortCountButton from "./CohortCountButton";
import { SaveOrCreateCohortModal } from "@/components/Modals/SaveOrCreateCohortModal";
import { GenericCohortModal } from "./Modals/GenericCohortModal";
import CaseSetModal from "@/components/Modals/SetModals/CaseSetModal";
import GeneSetModal from "@/components/Modals/SetModals/GeneSetModal";
import MutationSetModal from "@/components/Modals/SetModals/MutationSetModal";
import { convertDateToString } from "src/utils/date";
import ImportCohortModal from "./Modals/ImportCohortModal";

const exportCohort = (
  caseIds: readonly Record<string, any>[],
  cohortName: string,
) => {
  const tsv = `id\n${caseIds.map((c) => c.case_id).join("\n")}`;
  const blob = new Blob([tsv], { type: "text/tsv" });
  const today = new Date();
  saveAs(
    blob,
    `cohort_${cohortName.replace(/[^A-Za-z0-9_.]/g, "_")}.${convertDateToString(
      today,
    )}.tsv`,
  );
};

interface CohortGroupButtonProps {
  disabled: boolean;
  $isDiscard?: boolean;
}

const CohortGroupButton = tw.button<CohortGroupButtonProps>`
${(p: CohortGroupButtonProps) =>
  p.disabled
    ? "text-primary bg-base-light"
    : "text-primary hover:bg-primary-darkest hover:text-primary-content-lightest bg-base-max"}
${(p: CohortGroupButtonProps) => (p.$isDiscard ? "rounded-l" : "rounded")}
h-10
w-10
flex
justify-center
items-center
transition-colors
`;

/**
 * If removeList is empty, the function removes all params from url.
 * @param  router
 * @param  removeList
 */
const removeQueryParamsFromRouter = (
  router: NextRouter,
  removeList: string[] = [],
): void => {
  if (removeList.length > 0) {
    removeList.forEach((param) => delete router.query[param]);
  } else {
    // Remove all
    Object.keys(router.query).forEach((param) => delete router.query[param]);
  }
  router.replace(
    {
      pathname: router.pathname,
      query: router.query,
    },
    undefined,
    /**
     * Do not refresh the page
     */
    { shallow: true },
  );
};

/**
 * Component for selecting, adding, saving, removing, and deleting cohorts
 * @param cohorts: array of Cohort
 * @param onSelectionChanged
 * @param startingId: the selected id
 * @param hide_controls: set to true to hide the function buttons
 * @constructor
 */
const CohortManager: React.FC<CohortManagerProps> = ({
  cohorts,
  onSelectionChanged,
  startingId,
  hide_controls = false,
}: CohortManagerProps) => {
  const [exportCohortPending, setExportCohortPending] = useState(false);
  const coreDispatch = useCoreDispatch();

  // Info about current Cohort
  const currentCohort = useCoreSelector((state) => selectCurrentCohort(state));
  const cohortName = useCoreSelector((state) => selectCurrentCohortName(state));
  const cohortModified = useCoreSelector((state) =>
    selectCurrentCohortModified(state),
  );
  const cohortId = useCoreSelector((state) => selectCurrentCohortId(state));
  const filters = useCohortFacetFilters(); // make sure using this one //TODO maybe use from one amongst the selectors

  // util function to check for duplicate names while saving the cohort
  // here we filter the current cohort id so as not to so duplicate name warning
  // passed to SavingCohortModal as a prop
  const onSaveCohort = (name: string) =>
    cohorts
      .filter((cohort) => cohort.id !== cohortId)
      .every((cohort) => cohort.name !== name);

  // util function to check for duplicate names while creating the cohort
  // passed to SavingCohortModal as a prop
  const onCreateCohort = useCallback(
    (name: string) => cohorts.every((cohort) => cohort.name !== name),
    [cohorts],
  );

  // Cohort specific actions
  const newCohort = useCallback(
    (customName: string) => {
      coreDispatch(resetSelectedCases());
      coreDispatch(addNewCohort(customName));
    },
    [coreDispatch],
  );

  const discardChanges = useCallback(
    (filters: FilterSet | undefined) => {
      coreDispatch(discardCohortChanges(filters));
    },
    [coreDispatch],
  );

  const deleteCohort = () => {
    coreDispatch(resetSelectedCases());
    coreDispatch(removeCohort({ shouldShowMessage: true }));
  };

  const {
    data: caseIds,
    isFetching: isFetchingCaseIds,
    isError: isErrorCaseIds,
  } = useGetCasesQuery(
    {
      filters: buildCohortGqlOperator(currentCohort?.filters ?? undefined),
      fields: ["case_id"],
      size: 50000,
    },
    { skip: currentCohort === undefined },
  );

  useEffect(() => {
    if (isErrorCaseIds) {
      setExportCohortPending(false);
    } else if (exportCohortPending && !isFetchingCaseIds) {
      exportCohort(caseIds, cohortName);
      setExportCohortPending(false);
    }
  }, [
    isFetchingCaseIds,
    isErrorCaseIds,
    exportCohortPending,
    caseIds,
    cohortName,
  ]);

  // Cohort persistence
  const [addCohort, { isLoading: isAddCohortLoading }] = useAddCohortMutation();
  const [deleteCohortFromBE, { isLoading: isDeleteCohortLoading }] =
    useDeleteCohortMutation();
  const [updateCohort, { isLoading: isUpdateCohortLoading }] =
    useUpdateCohortMutation();
  const [trigger, { isFetching: isCohortIdFetching }] =
    useLazyGetCohortByIdQuery();

  // Modals Setters
  const [showDelete, setShowDelete] = useState(false);
  const [showDiscard, setShowDiscard] = useState(false);
  const [showSaveCohort, setShowSaveCohort] = useState(false);
  const [showCreateCohort, setShowCreateCohort] = useState(false);
  const [showUpdateCohort, setShowUpdateCohort] = useState(false);
  const modal = useCoreSelector((state) => selectCurrentModal(state));

  const menu_items = [
    ...cohorts
      .sort((a, b) => (a.modified_datetime <= b.modified_datetime ? 1 : -1))
      .map((x) => {
        return { value: x.id, label: x.name };
      }),
  ];

  const updateCohortFilters = (field: string, operation: Operation) => {
    coreDispatch(updateActiveCohortFilter({ field, operation }));
  };

  const router = useRouter();
  const {
    query: { operation, filters: createCohortFilters, name: createCohortName },
  } = router;

  useEffect(() => {
    if (operation == "createCohort") {
      const cohortFilters = JSON.parse(
        createCohortFilters as string,
      ) as FilterSet;
      coreDispatch(
        addNewCohortWithFilterAndMessage({
          filters: cohortFilters,
          name: (createCohortName as string).replace(/-/g, " "),
          makeCurrent: true,
          message: "newCohort",
        }),
      );

      removeQueryParamsFromRouter(router, ["operation", "filters", "name"]);
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      data-tour="cohort_management_bar"
      className="flex flex-row items-center justify-start gap-6 pl-4 h-18 pb-2 shadow-lg bg-primary"
    >
      {(isAddCohortLoading ||
        isCohortIdFetching ||
        isDeleteCohortLoading ||
        isUpdateCohortLoading) && <LoadingOverlay visible />}
      {/*  Modals Start   */}

      {showDelete && (
        <GenericCohortModal
          title="Delete Cohort"
          opened
          onClose={() => setShowDelete(false)}
          actionText="Delete"
          mainText={
            <>
              Are you sure you want to permanently delete <b>{cohortName}</b>?
            </>
          }
          subText={<>You cannot undo this action.</>}
          onActionClick={async () => {
            setShowDelete(false);
            // only delete cohort from BE if it's been saved before
            if (currentCohort?.saved) {
              // don't delete it from the local adapter if not able to delete from the BE
              await deleteCohortFromBE(cohortId)
                .unwrap()
                .then(() => deleteCohort())
                .catch(() =>
                  coreDispatch(setCohortMessage(["error|deleting|allId"])),
                );
            } else {
              deleteCohort();
            }
          }}
        />
      )}

      {showDiscard && (
        <GenericCohortModal
          title="Discard Changes"
          opened
          onClose={() => setShowDiscard(false)}
          actionText="Discard"
          mainText={
            <>
              Are you sure you want to permanently discard the unsaved changes?
            </>
          }
          subText={<>You cannot undo this action.</>}
          onActionClick={async () => {
            if (currentCohort.saved) {
              await trigger(cohortId)
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
          }}
        />
      )}

      {showUpdateCohort && (
        <GenericCohortModal
          title="Save Cohort"
          opened
          onClose={() => setShowUpdateCohort(false)}
          actionText="Save"
          mainText={
            <>
              Are you sure you want to save <b>{cohortName}</b>? This will
              overwrite your previously saved changes.
            </>
          }
          subText={<>You cannot undo this action.</>}
          onActionClick={async () => {
            setShowUpdateCohort(false);
            const updateBody = {
              id: cohortId,
              name: cohortName,
              type: "static",
              filters:
                Object.keys(filters.root).length > 0
                  ? buildCohortGqlOperator(filters)
                  : {},
            };

            await updateCohort(updateBody)
              .unwrap()
              .then((response) => {
                coreDispatch(
                  setCohortMessage([`savedCohort|${cohortName}|${cohortId}`]),
                );
                const cohort = {
                  id: response.id,
                  name: response.name,
                  filters: buildGqlOperationToFilterSet(response.filters),
                  caseSet: {
                    caseSetId: buildGqlOperationToFilterSet(response.filters),
                    status: "fulfilled" as DataStatus,
                  },
                  modified_datetime: response.modified_datetime,
                  saved: true,
                  modified: false,
                  caseCount: response?.case_ids.length,
                };
                coreDispatch(setCohort(cohort));
              })
              .catch(() =>
                coreDispatch(setCohortMessage(["error|saving|allId"])),
              );
          }}
        />
      )}

      {showSaveCohort && (
        <SaveOrCreateCohortModal
          initialName={cohortName}
          entity="cohort"
          opened
          onClose={() => setShowSaveCohort(false)}
          onActionClick={async (newName: string) => {
            const prevCohort = cohortId;
            const addBody = {
              name: newName,
              type: "static",
              filters:
                Object.keys(filters.root).length > 0
                  ? buildCohortGqlOperator(filters)
                  : {},
            };

            await addCohort(addBody)
              .unwrap()
              .then((payload) => {
                coreDispatch(
                  copyCohort({ sourceId: prevCohort, destId: payload.id }),
                );
                // NOTE: the current cohort can not be undefined. Setting the id to a cohort
                // which does not exist will cause this
                // Therefore, copy the unsaved cohort to the new cohort id received from
                // the BE.
                coreDispatch(setCurrentCohortId(payload.id));
                coreDispatch(updateCohortName(newName));
                coreDispatch(
                  setCohortMessage([`savedCohort|${newName}|${payload.id}`]),
                );
                onSelectionChanged(payload.id);
                coreDispatch(
                  removeCohort({
                    shouldShowMessage: false,
                    currentID: prevCohort,
                  }),
                );
              })
              .catch(() =>
                coreDispatch(setCohortMessage(["error|saving|allId"])),
              );
          }}
          onNameChange={onSaveCohort}
        />
      )}

      {showCreateCohort && (
        <SaveOrCreateCohortModal
          entity="cohort"
          action="create"
          opened
          onClose={() => setShowCreateCohort(false)}
          onActionClick={async (newName: string) => {
            newCohort(newName);
          }}
          onNameChange={onCreateCohort}
        />
      )}

      {modal === Modals.ImportCohortModal && <ImportCohortModal />}
      {modal === Modals.GlobalCaseSetModal && (
        <CaseSetModal
          updateFilters={updateCohortFilters}
          existingFiltersHook={useCohortFacetFilters}
        />
      )}
      {modal === Modals.GlobalGeneSetModal && (
        <GeneSetModal
          modalTitle="Filter Current Cohort by Genes"
          inputInstructions="Enter one or more gene identifiers in the field below or upload a file to filter your cohort. Your filtered cohort will consist of cases that have mutations in any of these genes."
          selectSetInstructions="Select one or more sets below to filter your cohort."
          updateFilters={updateCohortFilters}
          existingFiltersHook={useCohortFacetFilters}
        />
      )}
      {modal === Modals.GlobalMutationSetModal && (
        <MutationSetModal
          modalTitle="Filter Current Cohort by Mutations"
          inputInstructions="Enter one or more mutation identifiers in the field below or upload a file to filter your cohort. Your filtered cohort will consist of cases that have any of these mutations."
          selectSetInstructions="Select one or more sets below to filter your cohort."
          updateFilters={updateCohortFilters}
          existingFiltersHook={useCohortFacetFilters}
        />
      )}
      {/*  Modals End   */}

      <div className="border-opacity-0">
        {!hide_controls ? (
          <div className="flex justify-center items-center">
            <Tooltip
              label="Discard Unsaved Changes"
              position="bottom"
              withArrow
            >
              <span>
                <CohortGroupButton
                  data-testid="discardButton"
                  onClick={() => {
                    setShowDiscard(true);
                  }}
                  disabled={!cohortModified}
                  $isDiscard={true}
                >
                  <DiscardIcon size="16" aria-label="discard cohort changes" />
                </CohortGroupButton>
              </span>
            </Tooltip>

            <div className="flex flex-col" data-testid="cohort-list-dropdown">
              <Select
                data={menu_items}
                searchable
                clearable={false}
                value={startingId}
                zIndex={310}
                onChange={(x) => {
                  onSelectionChanged(x);
                }}
                classNames={{
                  root: "border-secondary-darkest w-80 p-0 pt-5",
                  input:
                    "text-heading font-medium text-primary-darkest rounded-l-none h-[2.63rem]",
                  item: "text-heading font-normal text-primary-darkest data-selected:bg-primary-lighter",
                }}
                aria-label="Select cohort"
                data-testid="switchButton"
                rightSection={
                  <DownArrowIcon size={20} className="text-primary" />
                }
                rightSectionWidth={30}
                styles={{ rightSection: { pointerEvents: "none" } }}
              />
              <div
                className={`ml-auto text-heading text-sm font-semibold pt-0.75 text-primary-contrast ${
                  cohortModified ? "visible" : "invisible"
                }`}
              >
                Changes not saved
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h2>{cohortName}</h2>
          </div>
        )}
      </div>
      {!hide_controls ? (
        <>
          <Tooltip label="Save Cohort" position="bottom" withArrow>
            <span>
              <CohortGroupButton
                onClick={() => {
                  !currentCohort?.saved
                    ? setShowSaveCohort(true)
                    : setShowUpdateCohort(true);
                }}
                disabled={currentCohort?.saved && !cohortModified}
                data-testid="saveButton"
              >
                <SaveIcon size="1.5em" aria-label="Save cohort" />
              </CohortGroupButton>
            </span>
          </Tooltip>
          <Tooltip label="Add New Cohort" position="bottom" withArrow>
            <CohortGroupButton
              onClick={() => setShowCreateCohort(true)}
              data-testid="addButton"
            >
              <AddIcon size="1.5em" aria-label="Add cohort" />
            </CohortGroupButton>
          </Tooltip>
          <Tooltip label="Delete Cohort" position="bottom" withArrow>
            <CohortGroupButton
              data-testid="deleteButton"
              onClick={() => {
                setShowDelete(true);
              }}
            >
              <DeleteIcon size="1.5em" aria-label="Delete cohort" />
            </CohortGroupButton>
          </Tooltip>
          <Tooltip label="Import New Cohort" position="bottom" withArrow>
            <CohortGroupButton
              data-testid="uploadButton"
              onClick={() =>
                coreDispatch(showModal({ modal: Modals.ImportCohortModal }))
              }
            >
              <UploadIcon size="1.5em" aria-label="Upload cohort" />
            </CohortGroupButton>
          </Tooltip>

          <Tooltip label="Export Cohort" position="bottom" withArrow>
            <span>
              <CohortGroupButton
                data-testid="downloadButton"
                disabled={isErrorCaseIds}
                onClick={() => {
                  if (isFetchingCaseIds) {
                    setExportCohortPending(true);
                  } else {
                    exportCohort(caseIds, cohortName);
                  }
                }}
              >
                {exportCohortPending ? (
                  <Loader />
                ) : (
                  <DownloadIcon size="1.5em" aria-label="Download cohort" />
                )}
              </CohortGroupButton>
            </span>
          </Tooltip>
        </>
      ) : (
        <div />
      )}

      {cohorts.length > 0 && (
        <CohortCountButton
          countName="casesMax"
          label="CASES"
          className="text-white ml-auto mr-6 text-lg"
          bold
        />
      )}
    </div>
  );
};

export default CohortManager;
