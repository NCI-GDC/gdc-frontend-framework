import React, { useContext } from "react";
import { Loader, Tooltip, Button } from "@mantine/core";
import DropdownMenu from "@/common/DropdownMenu";
import {
  AddIcon,
  DeleteIcon,
  DownloadIcon,
  SaveIcon,
  UploadIcon,
} from "src/commonIcons";
import { Cohort } from "./types";
import { CohortNotificationContext } from "./CohortNotificationProvider";
import { DataFetchingStatus } from "src/types";

interface CohortActionsProps {
  readonly onSave: () => void;
  readonly onSaveAs: () => void;
  readonly onDelete: () => void;
  readonly selectCurrentCohort: () => Cohort;
  readonly selectAvailableCohorts: () => Cohort[];
  readonly addNewDefaultUnsavedCohort: () => void;
  readonly useExportCohort: () => {
    readonly handleExport: (() => void) | undefined;
    readonly status: DataFetchingStatus;
  };
  readonly useImportCohort: () => (() => void) | undefined;
  readonly defaultCohortName: string;
}

const CohortActions: React.FC<CohortActionsProps> = ({
  onSave,
  onSaveAs,
  onDelete,
  selectCurrentCohort,
  selectAvailableCohorts,
  addNewDefaultUnsavedCohort,
  useExportCohort,
  useImportCohort,
  defaultCohortName,
}: CohortActionsProps) => {
  const currentCohort = selectCurrentCohort();
  const availableCohorts = selectAvailableCohorts();
  const hasUnsavedCohorts =
    availableCohorts.filter((c) => !c.saved).length >= 1;

  const { handleExport, status } = useExportCohort();
  const { isFetching: exportCohortPending = false } = status;
  const handleImport = useImportCohort();
  const setCohortMessage = useContext(CohortNotificationContext);

  return (
    <div className="flex justify-center items-center gap-2 md:gap-4">
      <Tooltip label="Save Cohort" position="top" withArrow>
        <span className="h-12">
          <DropdownMenu
            customDataTestId="saveButton"
            dropdownElements={[
              {
                onClick: onSave,
                title: "Save",
                disabled: currentCohort.saved && !currentCohort.modified,
              },
              {
                onClick: onSaveAs,
                title: "Save As",
                disabled: !currentCohort.saved,
              },
            ]}
            LeftSection={
              <SaveIcon size="1.5em" className="-mr-2.5" aria-hidden="true" />
            }
            TargetButtonChildren=""
            fullHeight
            disableTargetWidth
            buttonAriaLabel="Save cohort"
          />
        </span>
      </Tooltip>

      <Tooltip
        label={
          hasUnsavedCohorts
            ? "There is already an unsaved cohort"
            : "Create New Unsaved Cohort"
        }
        position="bottom"
        withArrow
      >
        <Button
          onClick={() => {
            addNewDefaultUnsavedCohort();
            setCohortMessage &&
              setCohortMessage([
                { cmd: "newCohort", param1: defaultCohortName },
              ]);
          }}
          data-testid="addButton"
          disabled={hasUnsavedCohorts}
          aria-label="Add cohort"
          variant="action"
        >
          <AddIcon size="1.5em" aria-hidden="true" />
        </Button>
      </Tooltip>

      <Tooltip label="Delete Cohort" position="bottom" withArrow>
        <Button
          data-testid="deleteButton"
          onClick={onDelete}
          aria-label="Delete cohort"
          variant="action"
        >
          <DeleteIcon size="1.5em" aria-hidden="true" />
        </Button>
      </Tooltip>
      {handleImport && (
        <Tooltip label="Import New Cohort" position="bottom" withArrow>
          <Button
            data-testid="uploadButton"
            onClick={handleImport}
            aria-label="Upload cohort"
            variant="action"
          >
            <UploadIcon size="1.5em" aria-hidden="true" />
          </Button>
        </Tooltip>
      )}
      {handleExport && (
        <Tooltip label="Export Cohort" position="bottom" withArrow>
          <span>
            <Button
              data-testid="downloadButton"
              onClick={handleExport}
              aria-label="Download cohort"
              variant="action"
            >
              {exportCohortPending ? (
                <Loader />
              ) : (
                <DownloadIcon size="1.5em" aria-hidden="true" />
              )}
            </Button>
          </span>
        </Tooltip>
      )}
    </div>
  );
};

export default CohortActions;
