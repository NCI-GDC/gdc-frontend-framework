import React from "react";
import { useDeepCompareMemo } from "use-deep-compare";
import { Select } from "@mantine/core";
import { UnsavedIcon, CustomCohortSelectItem } from "./CustomCohortSelectItem";
import { Cohort } from "./types";
import { DropdownIcon } from "src/commonIcons";

interface CohortSelectorProps {
  readonly selectAvailableCohorts: () => Cohort[];
  readonly selectCurrentCohort: () => Cohort;
  readonly setActiveCohort: (newCohort: string) => void;
}

const CohortSelector: React.FC<CohortSelectorProps> = ({
  selectAvailableCohorts,
  selectCurrentCohort,
  setActiveCohort,
}) => {
  const cohorts = selectAvailableCohorts();
  const currentCohort = selectCurrentCohort();

  const cohortStatusMessage = currentCohort.saved
    ? "Changes not saved"
    : "Cohort not saved";
  const isSavedUnchanged = currentCohort.saved && !currentCohort.modified;

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
        value={currentCohort.id}
        onChange={(id) => {
          if (id !== null) {
            setActiveCohort(id);
          }
        }}
        renderOption={CustomCohortSelectItem as any}
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
            <DropdownIcon size={20} className="text-primary" />
          </div>
        }
        rightSectionWidth={!isSavedUnchanged ? 45 : 30}
        styles={{ section: { pointerEvents: "none" } }}
      />
      <div
        data-testid="text-cohort-bar-message"
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
