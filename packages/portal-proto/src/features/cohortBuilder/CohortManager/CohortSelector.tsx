import {
  selectAvailableCohorts,
  selectCurrentCohortId,
  selectCurrentCohortModified,
  selectCurrentCohortSaved,
  setActiveCohort,
  useCoreDispatch,
  useCoreSelector,
} from "@gff/core";
import { Select } from "@mantine/core";
import { CustomCohortSelectItem, UnsavedIcon } from "./CustomCohortSelectItem";
import { FaCaretDown as DownArrowIcon } from "react-icons/fa";
import { useDeepCompareCallback, useDeepCompareMemo } from "use-deep-compare";

const CohortSelector = () => {
  const coreDispatch = useCoreDispatch();
  const cohorts = useCoreSelector(selectAvailableCohorts);
  const currentCohortId = useCoreSelector(selectCurrentCohortId);
  const currentCohortModified = useCoreSelector(selectCurrentCohortModified);
  const currentCohortSaved = useCoreSelector(selectCurrentCohortSaved);
  const handleCohortChange = useDeepCompareCallback(
    (id: string) => {
      coreDispatch(setActiveCohort(id));
    },
    [coreDispatch],
  );

  const cohortStatusMessage = currentCohortSaved
    ? "Changes not saved"
    : "Cohort not saved";
  const isSavedUnchanged = currentCohortSaved && !currentCohortModified;

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

  return (
    <div className="flex flex-col pt-5" data-testid="cohort-list-dropdown">
      <Select
        data={cohortList}
        searchable
        clearable={false}
        value={currentCohortId}
        onChange={(id) => {
          if (id !== null) {
            handleCohortChange(id);
          }
        }}
        renderOption={CustomCohortSelectItem}
        classNames={{
          root: "border-secondary-darkest w-56 md:w-80 z-[290]",
          input:
            "text-heading font-medium text-primary-darkest rounded-l-none h-[50px] border-primary border-l-2",
          option:
            "text-heading font-normal text-primary-darkest data-selected:bg-primary-lighter hover:bg-accent-lightest hover:text-accent-contrast-lightest my-0.5",
        }}
        aria-label="Select cohort"
        data-testid="switchButton"
        rightSection={
          <div className="flex gap-1 items-center">
            {!isSavedUnchanged && <UnsavedIcon label={cohortStatusMessage} />}
            <DownArrowIcon size={20} className="text-primary" />
          </div>
        }
        rightSectionWidth={!isSavedUnchanged ? 45 : 30}
        styles={{ section: { pointerEvents: "none" } }}
      />
      <div
        className={`ml-auto text-heading text-sm font-semibold mt-0.85 text-primary-contrast ${
          !isSavedUnchanged ? "visible" : "invisible"
        }`}
      >
        {cohortStatusMessage}
      </div>
    </div>
  );
};

export default CohortSelector;
