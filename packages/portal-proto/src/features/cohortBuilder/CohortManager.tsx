import React, { useCallback, useState } from "react";
import { LoadingOverlay, Select } from "@mantine/core";
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
import { CohortManagerProps } from "@/features/cohortBuilder/types";
import {
  DEFAULT_COHORT_ID,
  addNewCohort,
  removeCohort,
  selectCurrentCohortName,
  selectCurrentCohortModified,
  useCoreDispatch,
  useCoreSelector,
  discardCohortChanges,
  useDeleteCohortMutation,
  selectCurrentCohortId,
  setCurrentCohortId,
  selectCurrentCohort,
  useUpdateCohortMutation,
  setCohortMessage,
  useLazyGetCohortByIdQuery,
  FilterSet,
} from "@gff/core";
import { buildCohortGqlOperator } from "@gff/core";
import { useCohortFacetFilters } from "./CohortGroup";
import { useAddCohortMutation } from "@gff/core";
import CountButton from "./CountButton";
import { SavingCohortModal } from "./Modals/SavingCohortModal";
import { GenericCohortModal } from "./Modals/GenericCohortModal";

interface CohortGroupButtonProps {
  $buttonDisabled?: boolean;
  $isDiscard?: boolean;
}

const CohortGroupButton = tw.button<CohortGroupButtonProps>`
${(p: CohortGroupButtonProps) =>
  p.$buttonDisabled
    ? "text-primary-content-darkest"
    : "hover:bg-primary hover:text-primary-content-lightest"}
${(p: CohortGroupButtonProps) => (p.$isDiscard ? "rounded-l" : "rounded")}
h-10
w-10
flex
justify-center
items-center
bg-base-lightest
transition-colors
disabled:opacity-50
`;

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
  const coreDispatch = useCoreDispatch();

  // Info about current Cohort
  const currentCohort = useCoreSelector((state) => selectCurrentCohort(state));
  const cohortName = useCoreSelector((state) => selectCurrentCohortName(state));
  const cohortModified = useCoreSelector((state) =>
    selectCurrentCohortModified(state),
  );
  const cohortId = useCoreSelector((state) => selectCurrentCohortId(state));
  const filters = useCohortFacetFilters(); // make sure using this one //TODO maybe use from one amongst the selectors

  // util function to check for names while saving the cohort
  // passed to SavingCohortModal as a prop
  const onSaveCohort = (name: string) =>
    cohorts
      .filter((cohort) => cohort.id !== cohortId)
      .every((cohort) => cohort.name !== name);

  // Cohort specific actions
  const newCohort = useCallback(() => {
    coreDispatch(addNewCohort());
  }, [coreDispatch]);

  const discardChanges = useCallback(
    (filters: FilterSet | undefined) => {
      coreDispatch(discardCohortChanges(filters));
    },
    [coreDispatch],
  );

  const deleteCohort = () => {
    coreDispatch(removeCohort({ shouldShowMessage: true }));
  };

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
  const [showUpdateCohort, setShowUpdateCohort] = useState(false);

  const menu_items = [
    { value: cohorts[0].id, label: cohorts[0].name },
    ...cohorts // Make ALL GDC always first
      .slice(1)
      .map((x) => {
        return { value: x.id, label: x.name };
      }),
  ];

  const isDefaultCohort = startingId === DEFAULT_COHORT_ID;

  return (
    <div
      data-tour="cohort_management_bar"
      className="flex flex-row items-center justify-start gap-6 pl-4 h-20 shadow-lg bg-primary-darkest"
    >
      {(isAddCohortLoading ||
        isCohortIdFetching ||
        isDeleteCohortLoading ||
        isUpdateCohortLoading) && <LoadingOverlay visible />}
      {/*  Modals Start   */}
      <GenericCohortModal
        title="Delete Cohort"
        opened={showDelete}
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
            // dont delete it from the local adapter if not able to delete from the BE
            await deleteCohortFromBE(cohortId)
              .unwrap()
              .then(() => deleteCohort())
              .catch(() =>
                coreDispatch(setCohortMessage("error|deleting|allId")),
              );
          } else {
            deleteCohort();
          }
        }}
      />
      <GenericCohortModal
        title="Discard Changes"
        opened={showDiscard}
        onClose={() => setShowDiscard(false)}
        actionText="Discard"
        mainText={
          <>Are you sure you want to permanently discard the unsaved changes?</>
        }
        subText={<>You cannot undo this action.</>}
        onActionClick={async () => {
          if (currentCohort.saved) {
            await trigger(cohortId)
              .unwrap()
              .then((payload) => {
                discardChanges(payload.filters);
              })
              .catch(() =>
                coreDispatch(setCohortMessage("error|discarding|allId")),
              );
          } else {
            discardChanges(undefined);
          }
        }}
      />
      <GenericCohortModal
        title="Save Cohort"
        opened={showUpdateCohort}
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
            filters: buildCohortGqlOperator(filters),
          };

          await updateCohort(updateBody)
            .unwrap()
            .then(() =>
              coreDispatch(
                setCohortMessage(`savedCohort|${cohortName}|${cohortId}`),
              ),
            )
            .catch(() => coreDispatch(setCohortMessage("error|saving|allId")));
        }}
      />
      <SavingCohortModal
        initialName={cohortName}
        opened={showSaveCohort}
        onClose={() => setShowSaveCohort(false)}
        onSaveClick={async (newName: string) => {
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
              coreDispatch(setCurrentCohortId(payload.id));
              coreDispatch(
                setCohortMessage(`savedCohort|${newName}|${payload.id}`),
              );
              onSelectionChanged(payload.id);
              coreDispatch(
                removeCohort({
                  shouldShowMessage: false,
                  currentID: prevCohort,
                }),
              );
            })
            .catch(() => coreDispatch(setCohortMessage("error|saving|allId")));
        }}
        onSaveCohort={onSaveCohort}
      />
      {/*  Modals End   */}

      <div className="border-opacity-0">
        {!hide_controls ? (
          <div className="flex justify-center items-center">
            <CohortGroupButton
              disabled={!cohortModified}
              onClick={() => setShowDiscard(true)}
              className="mr-0.5"
              $buttonDisabled={!cohortModified}
              $isDiscard={true}
            >
              <DiscardIcon size="16" aria-label="Add cohort" />
            </CohortGroupButton>

            <div className="flex flex-col">
              <Select
                data={menu_items}
                searchable
                clearable={false}
                value={startingId}
                onChange={(x) => {
                  onSelectionChanged(x);
                }}
                classNames={{
                  root: "border-base-light w-80 p-0 z-10 pt-5",
                  input:
                    "text-heading font-[500] text-primary-darkest rounded-l-none h-10",
                  item: "text-heading font-[400] text-primary-darkest data-selected:bg-primary-lighter first:border-b-2 first:rounded-none first:border-primary",
                }}
                aria-label="Select cohort"
                rightSection={<DownArrowIcon size={20} />}
                rightSectionWidth={30}
                styles={{ rightSection: { pointerEvents: "none" } }}
              />
              <div
                className={`ml-auto text-heading text-[0.65em] font-semibold pt-1 text-primary-contrast ${
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
      {
        // TODO: add tooltips with all functions are complete
        !hide_controls ? (
          <>
            <CohortGroupButton
              disabled={isDefaultCohort}
              onClick={() => {
                !currentCohort?.saved
                  ? setShowSaveCohort(true)
                  : setShowUpdateCohort(true);
              }}
              $buttonDisabled={isDefaultCohort}
              data-testid="saveButton"
            >
              <SaveIcon size="1.5em" aria-label="Save cohort" />
            </CohortGroupButton>
            <CohortGroupButton
              onClick={() => newCohort()}
              data-testid="addButton"
            >
              <AddIcon size="1.5em" aria-label="Add cohort" />
            </CohortGroupButton>
            <CohortGroupButton
              onClick={() => setShowDelete(true)}
              disabled={isDefaultCohort}
              $buttonDisabled={isDefaultCohort}
              data-testid="deleteButton"
            >
              <DeleteIcon size="1.5em" aria-label="Delete cohort" />
            </CohortGroupButton>
            <CohortGroupButton data-testid="uploadButton">
              <UploadIcon size="1.5em" aria-label="Upload cohort" />
            </CohortGroupButton>
            <CohortGroupButton data-testid="downloadButton">
              <DownloadIcon size="1.5em" aria-label="Download cohort" />
            </CohortGroupButton>
          </>
        ) : (
          <div />
        )
      }
      <CountButton
        countName="casesMax"
        label="CASES"
        className="text-white ml-auto mr-6 text-lg"
        bold
      />
    </div>
  );
};

export default CohortManager;
