import { Select } from "@mantine/core";
import { CustomCohortSelectItem, UnsavedIcon } from "./CustomCohortSelectItem";
import { FaCaretDown as DownArrowIcon } from "react-icons/fa";

interface CohortSelectorProps {
  cohortId: string;
  cohortList: {
    value: string;
    label: string;
    isSavedUnchanged: boolean;
    cohortStatusMessage: string;
  }[];
  isSavedUnchanged: boolean;
  cohortStatusMessage: string;
  onCohortChange: (cohortId: string) => void;
}

const CohortSelector: React.FC<CohortSelectorProps> = ({
  cohortId,
  cohortList,
  isSavedUnchanged,
  cohortStatusMessage,
  onCohortChange,
}: CohortSelectorProps) => {
  return (
    <div className="flex flex-col pt-5" data-testid="cohort-list-dropdown">
      <Select
        data={cohortList}
        searchable
        clearable={false}
        value={cohortId}
        onChange={(cohortId) => {
          if (cohortId !== null) {
            onCohortChange(cohortId);
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
