import { useCallback, useState } from "react";
import {
  addNewDefaultUnsavedCohort,
  buildCohortGqlOperator,
  Modals,
  selectCurrentCohortFilters,
  selectCurrentCohortModified,
  selectCurrentCohortName,
  selectCurrentCohortSaved,
  selectHasUnsavedCohorts,
  showModal,
  useCoreDispatch,
  useCoreSelector,
  useGetCasesQuery,
} from "@gff/core";
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
import { exportCohort } from "./cohortUtils";
import { useDeepCompareCallback, useDeepCompareEffect } from "use-deep-compare";

interface CohortActionsProps {
  onSave: () => void;
  onSaveAs: () => void;
  onDelete: () => void;
}

const CohortActions: React.FC<CohortActionsProps> = ({
  onSave,
  onSaveAs,
  onDelete,
}: CohortActionsProps) => {
  const coreDispatch = useCoreDispatch();
  const hasUnsavedCohorts = useCoreSelector(selectHasUnsavedCohorts);
  const currentCohortName = useCoreSelector(selectCurrentCohortName);
  const currentCohortSaved = useCoreSelector(selectCurrentCohortSaved);
  const currentCohortModified = useCoreSelector(selectCurrentCohortModified);
  const currentCohortFilters = useCoreSelector(selectCurrentCohortFilters);
  const [exportCohortPending, setExportCohortPending] = useState(false);
  const handleAdd = useDeepCompareCallback(() => {
    coreDispatch(addNewDefaultUnsavedCohort());
  }, [coreDispatch]);

  const handleImport = useDeepCompareCallback(() => {
    coreDispatch(showModal({ modal: Modals.ImportCohortModal }));
  }, [coreDispatch]);

  const handleExport = useCallback(() => {
    setExportCohortPending(true);
  }, []);

  const {
    data: caseIds,
    isFetching: isFetchingCaseIds,
    isError: isErrorCaseIds,
  } = useGetCasesQuery(
    {
      request: {
        case_filters: buildCohortGqlOperator(currentCohortFilters ?? undefined),
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
      exportCohort(caseIds?.hits, currentCohortName);
      setExportCohortPending(false);
    }
  }, [
    isFetchingCaseIds,
    isErrorCaseIds,
    exportCohortPending,
    caseIds,
    currentCohortName,
  ]);

  return (
    <div className="flex justify-center items-center gap-2 md:gap-4">
      <Tooltip label="Save Cohort" position="top" withArrow>
        <span className="h-12">
          <DropdownWithIcon
            customDataTestId="saveButton"
            dropdownElements={[
              {
                onClick: onSave,
                title: "Save",
                disabled: currentCohortSaved && !currentCohortModified,
              },
              {
                onClick: onSaveAs,
                title: "Save As",
                disabled: !currentCohortSaved,
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
          onClick={handleAdd}
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
          onClick={handleImport}
          aria-label="Upload cohort"
        >
          <UploadIcon size="1.5em" aria-hidden="true" />
        </CohortGroupButton>
      </Tooltip>

      <Tooltip label="Export Cohort" position="bottom" withArrow>
        <span>
          <CohortGroupButton
            data-testid="downloadButton"
            onClick={handleExport}
            aria-label="Download cohort"
          >
            {exportCohortPending ? (
              <Loader />
            ) : (
              <DownloadIcon size="1.5em" aria-hidden="true" />
            )}
          </CohortGroupButton>
        </span>
      </Tooltip>
    </div>
  );
};

export default CohortActions;
