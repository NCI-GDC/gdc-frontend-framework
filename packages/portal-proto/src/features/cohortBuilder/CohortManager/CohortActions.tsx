import { Loader, Tooltip } from "@mantine/core";
import { DropdownWithIcon } from "@/components/DropdownWithIcon/DropdownWithIcon";
import {
  MdAdd as AddIcon,
  MdDelete as DeleteIcon,
  MdFileDownload as DownloadIcon,
  MdFileUpload as UploadIcon,
  MdSave as SaveIcon,
} from "react-icons/md";
import { CohortGroupButton } from "../style";

interface CohortActionsProps {
  onSave: () => void;
  onSaveAs: () => void;
  onAdd: () => void;
  onDelete: () => void;
  onImport: () => void;
  onExport: () => void;
  isModified: boolean;
  isSaved: boolean;
  hasUnsavedCohorts: boolean;
  isExporting: boolean;
}

const CohortActions: React.FC<CohortActionsProps> = ({
  onSave,
  onSaveAs,
  onAdd,
  onDelete,
  onImport,
  onExport,
  isModified,
  isSaved,
  hasUnsavedCohorts,
  isExporting,
}: CohortActionsProps) => (
  <div className="flex justify-center items-center gap-2 md:gap-4">
    <Tooltip label="Save Cohort" position="top" withArrow>
      <span className="h-12">
        <DropdownWithIcon
          customDataTestId="saveButton"
          dropdownElements={[
            {
              onClick: onSave,
              title: "Save",
              disabled: isSaved && !isModified,
            },
            {
              onClick: onSaveAs,
              title: "Save As",
              disabled: !isSaved,
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
      <CohortGroupButton
        onClick={onAdd}
        data-testid="addButton"
        disabled={hasUnsavedCohorts}
        aria-label="Add cohort"
      >
        <AddIcon size="1.5em" aria-hidden="true" />
      </CohortGroupButton>
    </Tooltip>

    <Tooltip label="Delete Cohort" position="bottom" withArrow>
      <CohortGroupButton
        data-testid="deleteButton"
        onClick={onDelete}
        aria-label="Delete cohort"
      >
        <DeleteIcon size="1.5em" aria-hidden="true" />
      </CohortGroupButton>
    </Tooltip>

    <Tooltip label="Import New Cohort" position="bottom" withArrow>
      <CohortGroupButton
        data-testid="uploadButton"
        onClick={onImport}
        aria-label="Upload cohort"
      >
        <UploadIcon size="1.5em" aria-hidden="true" />
      </CohortGroupButton>
    </Tooltip>

    <Tooltip label="Export Cohort" position="bottom" withArrow>
      <span>
        <CohortGroupButton
          data-testid="downloadButton"
          onClick={onExport}
          aria-label="Download cohort"
        >
          {isExporting ? (
            <Loader />
          ) : (
            <DownloadIcon size="1.5em" aria-hidden="true" />
          )}
        </CohortGroupButton>
      </span>
    </Tooltip>
  </div>
);

export default CohortActions;
