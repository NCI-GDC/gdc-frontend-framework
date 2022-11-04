import React, { useCallback, useEffect, useState } from "react";
import { Box, Button, Group, Modal, Select, Text } from "@mantine/core";
import {
  MdAdd as AddIcon,
  MdDelete as DeleteIcon,
  MdFileDownload as DownloadIcon,
  MdFileUpload as UploadIcon,
  MdSave as SaveIcon,
} from "react-icons/md";
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
  useGetCohortsByContextIdQuery,
  setCohortList,
  discardCohortChanges,
  setModifed,
  selectCurrentCohortSaved,
  setSaved,
} from "@gff/core";
import { buildCohortGqlOperator } from "@gff/core";
import { useCohortFacetFilters } from "./CohortGroup";
import { useAddCohortMutation } from "@gff/core";
import CountButton from "./CountButton";

const CohortGroupButton = tw(Button)`
p-2
bg-base-lightest
transition-colors
text-primary-content-darkest
hover:bg-primary
hover:text-primary-content-lightest
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
  // Sort the Cohors by modification date, The "All GDC" cohort is always first
  const {
    data: cohortsListData,
    isLoading: isCohortsListLoading,
    isSuccess: isCohortsListSuccess,
    isError: isCohortsListError,
  } = useGetCohortsByContextIdQuery();

  const coreDispatch = useCoreDispatch();

  useEffect(() => {
    console.log("inside efffffectttt");
    coreDispatch(setCohortList(cohortsListData));
  }, [coreDispatch, cohortsListData]);

  const menu_items = [
    { value: cohorts[0].id, label: cohorts[0].name },
    ...cohorts // Make ALL GDC always first
      .slice(1)
      .map((x) => {
        return { value: x.id, label: x.name };
      }),
  ];

  const cohortName = useCoreSelector((state) => selectCurrentCohortName(state));
  const cohortModified = useCoreSelector((state) =>
    selectCurrentCohortModified(state),
  );
  const cohortSaved = useCoreSelector((state) =>
    selectCurrentCohortSaved(state),
  );

  const newCohort = useCallback(() => {
    coreDispatch(addNewCohort());
  }, [coreDispatch]);

  const discardChanges = useCallback(() => {
    coreDispatch(discardCohortChanges());
  }, [coreDispatch]);

  const [showDelete, setShowDelete] = useState(false);
  const [showDiscard, setShowDiscard] = useState(false);

  const deleteCohort = () => {
    coreDispatch(removeCohort());
  };
  const filters = useCohortFacetFilters();
  const [addCohort, { data: addCohortData, isSuccess: isAddCohortSuccess }] =
    useAddCohortMutation();

  return (
    <div
      data-tour="cohort_management_bar"
      className="flex flex-row items-center justify-start gap-6 pl-4 h-20 shadow-lg bg-primary-darkest"
    >
      {" "}
      {
        // Wrap modal in own theme provider to permit overriding of backgroundColor from tailwind
        // Also mantine modal appear to disable tailwind completely which is why the Modal below
        // is styled via mantine.
      }
      <Modal
        title="Delete Cohort"
        opened={showDelete}
        padding={0}
        radius="md"
        onClose={() => setShowDelete(false)}
        styles={(theme) => ({
          header: {
            color: theme.colors.primary[8],
            fontFamily: '"Montserrat", "sans-serif"',
            fontSize: "1.65em",
            fontWeight: 500,
            letterSpacing: ".1rem",
            borderColor: theme.colors.base[1],
            borderStyle: "solid",
            borderWidth: "0px 0px 2px 0px",
            padding: "15px 20px 15px 15px",
            margin: "5px 5px 5px 5px",
          },
          modal: {
            backgroundColor: theme.colors.base[0],
          },
          close: {
            backgroundColor: theme.colors.base[1],
            color: theme.colors.primary[8],
          },
        })}
      >
        <Box
          sx={() => ({
            fontFamily: '"Montserrat", "sans-serif"',
            padding: "20px 25px 20px 10px",
          })}
        >
          <Text
            sx={(theme) => ({
              fontFamily: '"Montserrat", "sans-serif"',
              fontSize: "0.95em",
              fontWeight: 500,
              color: theme.colors.base[8],
            })}
          >
            Are you sure you want to permanently delete <b>{cohortName}</b>?
          </Text>
          <Text
            sx={(theme) => ({
              fontFamily: '"Montserrat", "sans-serif"',
              fontSize: "0.85em",
              color: theme.colors.base[9],
              paddingTop: "1em",
            })}
          >
            You cannot undo this action.
          </Text>
        </Box>
        <Box
          sx={(theme) => ({
            backgroundColor: theme.colors.base[1],
            padding: theme.spacing.md,
            borderRadius: theme.radius.md,
            borderTopRightRadius: 0,
            borderTopLeftRadius: 0,
          })}
        >
          <Group position="right">
            <Button
              variant="outline"
              styles={() => ({
                root: {
                  backgroundColor: "white",
                },
              })}
              color="primary.5"
              onClick={() => setShowDelete(false)}
            >
              Cancel
            </Button>
            <Button
              variant={"filled"}
              color="primary.8"
              onClick={() => deleteCohort()}
            >
              Delete
            </Button>
          </Group>
        </Box>
      </Modal>
      <Modal
        title="Discard Changes"
        opened={showDiscard}
        padding={0}
        radius="md"
        onClose={() => setShowDiscard(false)}
        styles={(theme) => ({
          header: {
            color: theme.colors.primary[8],
            fontFamily: '"Montserrat", "sans-serif"',
            fontSize: "1.65em",
            fontWeight: 500,
            letterSpacing: ".1rem",
            borderColor: theme.colors.base[1],
            borderStyle: "solid",
            borderWidth: "0px 0px 2px 0px",
            padding: "15px 20px 15px 15px",
            margin: "5px 5px 5px 5px",
          },
          modal: {
            backgroundColor: theme.colors.base[0],
          },
          close: {
            backgroundColor: theme.colors.base[1],
            color: theme.colors.primary[8],
          },
        })}
      >
        <Box
          sx={() => ({
            fontFamily: '"Montserrat", "sans-serif"',
            padding: "20px 25px 20px 10px",
          })}
        >
          <Text
            sx={(theme) => ({
              fontFamily: '"Montserrat", "sans-serif"',
              fontSize: "0.95em",
              fontWeight: 500,
              color: theme.colors.base[8],
            })}
          >
            Are you sure you want to permanently discard the unsaved changes?
          </Text>
          <Text
            sx={(theme) => ({
              fontFamily: '"Montserrat", "sans-serif"',
              fontSize: "0.85em",
              color: theme.colors.base[9],
              paddingTop: "1em",
            })}
          >
            You cannot undo this action.
          </Text>
        </Box>
        <Box
          sx={(theme) => ({
            backgroundColor: theme.colors.base[1],
            padding: theme.spacing.md,
            borderRadius: theme.radius.md,
            borderTopRightRadius: 0,
            borderTopLeftRadius: 0,
          })}
        >
          <Group position="right">
            <Button
              variant="outline"
              styles={() => ({
                root: {
                  backgroundColor: "white",
                },
              })}
              color="primary.5"
              onClick={() => setShowDiscard(false)}
            >
              Cancel
            </Button>
            <Button
              variant={"filled"}
              color="primary.8"
              onClick={() => discardChanges()}
            >
              Discard
            </Button>
          </Group>
        </Box>
      </Modal>
      <div className="border-opacity-0">
        {!hide_controls ? (
          <div className="flex justify-center items-center gap-2">
            <Button
              disabled={cohortSaved || !cohortModified}
              onClick={() => setShowDiscard(true)}
            >
              Discard Changes
            </Button>
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
                  input: "text-heading font-[500] text-primary-darkest ",
                  item: "text-heading font-[400] text-primary-darkest data-selected:bg-primary-lighter first:border-b-2 first:rounded-none first:border-primary",
                }}
                aria-label="Select cohort"
              />
              <div
                className={`ml-auto text-heading text-[0.65em] font-semibold pt-1 text-primary-contrast ${
                  // !cohortSaved || cohortModified ? "visible" : "invisible"
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
              disabled={startingId === DEFAULT_COHORT_ID}
              onClick={async () => {
                const addBody = {
                  name: cohortName,
                  type: "static",
                  filters: buildCohortGqlOperator(filters),
                  // modified: false,
                  // modified_date: new Date().toISOString(),
                };
                const data = await addCohort(addBody).unwrap();
                if (Object.keys(data).length > 0) {
                  coreDispatch(setSaved());
                  coreDispatch(setModifed());
                }
                // addCohort(addBody)
              }}
            >
              <SaveIcon size="1.5em" aria-label="Save cohort" />
            </CohortGroupButton>
            <CohortGroupButton onClick={() => newCohort()}>
              <AddIcon size="1.5em" aria-label="Add cohort" />
            </CohortGroupButton>
            <CohortGroupButton
              onClick={() => setShowDelete(true)}
              disabled={startingId === DEFAULT_COHORT_ID}
            >
              <DeleteIcon size="1.5em" aria-label="Delete cohort" />
            </CohortGroupButton>
            <CohortGroupButton>
              <UploadIcon size="1.5em" aria-label="Upload cohort" />
            </CohortGroupButton>
            <CohortGroupButton>
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
