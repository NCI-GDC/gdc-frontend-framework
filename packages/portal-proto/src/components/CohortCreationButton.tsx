import React, { ReactNode, useState } from "react";
import { Tooltip } from "@mantine/core";
import { FaPlus as PlusIcon } from "react-icons/fa";
import tw from "tailwind-styled-components";
import { FilterSet } from "@gff/core";
import SaveCohortModal from "@/components/Modals/SaveCohortModal";

export const CohortCreationStyledButton = tw.button`
  flex
  items-stretch
  w-52
  h-full
  ${(p) => !p.$fullWidth && "max-w-[125px]"}
  gap-2
  rounded
  border-primary
  border-solid
  border-1
  text-primary
  bg-base-max
  hover:text-base-max
  hover:bg-primary
  disabled:opacity-50
  disabled:bg-base-lightest
  disabled:text-primary
  disabled:border-base-light
  disabled:text-base-light
`;

export const IconWrapperTW = tw.span`
  ${(p) => (p.$disabled ? "bg-base-light" : "bg-accent")}
  border-r-1
  border-solid
  ${(p) => (p.$disabled ? "border-base-light" : "border-primary")}
  flex
  items-center
  p-1
`;

/**
 * Props for the CohortCreationButton component
 * @category Buttons
 * @interface
 * @property label - the text label
 * @property numCases - the number of cases in the cohort
 * @property filters - the filters to use for the cohort
 * @property caseFilters - the case filters to use for the cohort
 * @property filtersCallback - callback to create filters, used when filters are too complicated for FilterSet
 * @property createStaticCohort - whether to create a case set from the filters so the cases in the cohort remain static
 */
interface CohortCreationButtonProps {
  readonly label: ReactNode;
  readonly numCases: number;
  readonly filters?: FilterSet;
  readonly caseFilters?: FilterSet;
  readonly filtersCallback?: () => Promise<FilterSet>;
  readonly createStaticCohort?: boolean;
}

/**
 * Button to create a new cohort
 * @param label - the text label
 * @param numCases - the number of cases in the cohort
 * @param filters - the filters to use for the cohort
 * @param caseFilters - the case filters to use for the cohort
 * @property filtersCallback - callback to create filters, used when filters are too complicated for FilterSet
 * @param createStaticCohort - whether to create a case set from the filters so the cases in the cohort remain static
 * @category Buttons
 */
const CohortCreationButton: React.FC<CohortCreationButtonProps> = ({
  label,
  numCases,
  filters,
  caseFilters,
  filtersCallback,
  createStaticCohort = false,
}: CohortCreationButtonProps) => {
  const [showSaveCohort, setShowSaveCohort] = useState(false);
  const [cohortFilters, setCohortFilters] = useState<FilterSet>(filters);
  const [loading, setLoading] = useState(false);
  const disabled = numCases === undefined || numCases === 0;
  const tooltipText = disabled
    ? "No cases available"
    : `Save a new cohort of ${
        numCases > 1 ? `these ${numCases.toLocaleString()} cases` : "this case"
      }`;

  return (
    <div className="p-1">
      <Tooltip
        label={
          disabled ? (
            "No cases available"
          ) : (
            <>
              Save a new cohort of{" "}
              {numCases > 1 ? (
                <>
                  these <b>{numCases.toLocaleString()}</b> cases
                </>
              ) : (
                "this case"
              )}
            </>
          )
        }
        withArrow
      >
        <CohortCreationStyledButton
          data-testid="button-save-filtered-cohort"
          onClick={async () => {
            if (loading) {
              return;
            }

            if (filtersCallback) {
              setLoading(true);
              const createdFilters = await filtersCallback();
              setCohortFilters(createdFilters);
              setLoading(false);
            }
            setShowSaveCohort(true);
          }}
          disabled={disabled}
          $fullWidth={React.isValidElement(label)} // if label is JSX.Element take the full width
          aria-label={tooltipText}
        >
          <IconWrapperTW $disabled={disabled} aria-hidden="true">
            <PlusIcon color="white" size={12} />
          </IconWrapperTW>
          <span className="pr-2 self-center">{label ?? "--"}</span>
        </CohortCreationStyledButton>
      </Tooltip>

      <SaveCohortModal
        onClose={() => setShowSaveCohort(false)}
        opened={showSaveCohort}
        filters={cohortFilters}
        caseFilters={caseFilters}
        createStaticCohort={createStaticCohort}
      />
    </div>
  );
};

export default CohortCreationButton;
