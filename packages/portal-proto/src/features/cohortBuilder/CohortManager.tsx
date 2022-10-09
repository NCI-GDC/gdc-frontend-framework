import React, { useCallback, useState } from "react";
import {
  Box,
  Button,
  Group,
  Modal,
  Select,
  Text,
  MantineProvider,
  createEmotionCache,
} from "@mantine/core";
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
  useCoreDispatch,
  useCoreSelector,
} from "@gff/core";

const CohortGroupButton = tw(Button)`
p-2
bg-base-lightest
transition-colors
text-primary-content-darkest
hover:bg-primary
hover:text-primary-content-lightest
disabled:opacity-50
`;

const CohortManager: React.FC<CohortManagerProps> = ({
  cohorts,
  onSelectionChanged,
  startingId,
  hide_controls = false,
}: CohortManagerProps) => {
  const menu_items = cohorts
    .sort((a, b) => {
      if (a.id == DEFAULT_COHORT_ID) return -1; // Put DEFAULT_COHORT_ID first
      if (b.id == DEFAULT_COHORT_ID) return -1;
      if (a.modifiedDate < b.modifiedDate) return 1;
      else return -1;
    })
    .map((x) => {
      return { value: x.id, label: x.name };
    });
  const coreDispatch = useCoreDispatch();
  const cohortName = useCoreSelector((state) => selectCurrentCohortName(state));
  const newCohort = useCallback(() => {
    coreDispatch(addNewCohort());
  }, []);
  const [showDelete, setShowDelete] = useState(false);

  const deleteCohort = () => {
    coreDispatch(removeCohort());
  };

  const appendCache = createEmotionCache({ key: "mantine", prepend: false });

  return (
    <div
      data-tour="cohort_management_bar"
      className="flex flex-row items-center justify-start gap-6 pl-4 h-20 shadow-lg bg-primary-darkest"
    >
      {" "}
      {
        // Wrap modal in own theme provider to permit overriding of backgroundColor from tailwind
      }
      <MantineProvider
        emotionCache={appendCache}
        withGlobalStyles
        withNormalizeCSS
        inherit
      >
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
              fontSize: "1.25em",
              fontWeight: 500,
              "letter-spacing": ".1rem",
              "border-color": theme.colors.base[1],
              "border-style": "solid",
              "border-width": "0px 0px 2px 0px",
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
                fontSize: "0.8em",
                fontWeight: 500,
                color: theme.colors.base[8],
              })}
            >
              Are you sure you want to permanently delete <b>{cohortName}</b>b?
            </Text>
            <Text
              sx={(theme) => ({
                fontFamily: '"Montserrat", "sans-serif"',
                fontSize: "0.6em",
                color: theme.colors.base[9],
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
      </MantineProvider>
      <div className="border-opacity-0">
        {!hide_controls ? (
          <Select
            data={menu_items}
            searchable
            clearable={false}
            value={startingId}
            onChange={(x) => {
              onSelectionChanged(x);
            }}
            classNames={{
              root: "border-base-light w-80 p-0 z-10 ",
              input: "text-heading font-[500] text-primary-darkest ",
              item: "text-heading font-[400] text-primary-darkest data-selected:bg-primary-lighter first:border-b-2 first:rounded-none first:border-primary",
            }}
            aria-label="Select cohort"
          />
        ) : (
          <div>
            <h2>{cohortName}</h2>
          </div>
        )}
      </div>
      {!hide_controls ? (
        <>
          <CohortGroupButton>
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
      )}
    </div>
  );
};

export default CohortManager;
