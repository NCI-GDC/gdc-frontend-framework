import React, { useCallback, useState } from "react";
import { Button, Group, Modal, Select, Text } from "@mantine/core";
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

  return (
    <div
      data-tour="cohort_management_bar"
      className="flex flex-row items-center justify-start gap-6 pl-4 h-20 shadow-lg bg-primary-darkest"
    >
      <Modal
        title="Delete Cohort"
        opened={showDelete}
        onClose={() => setShowDelete(false)}
      >
        <Text className="font-heading text-md">
          Are you sure you want to permanently delete the {cohortName}?
        </Text>
        <Text className="font-heading text-xs">
          You cannot undo this action
        </Text>
        <Group mt="md" position="right" className="bg-base-light">
          <Button variant="outline" onClick={() => setShowDelete(false)}>
            Cancel
          </Button>
          <Button variant="outline" onClick={() => deleteCohort()}>
            Delete
          </Button>
        </Group>
      </Modal>

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
