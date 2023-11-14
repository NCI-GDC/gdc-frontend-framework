import React, { ReactNode, useState } from "react";
import { Loader, Tooltip } from "@mantine/core";
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

export const IconWrapper = tw.span`
  ${(p) => (p.$disabled ? "bg-base-light" : "bg-accent")}
  border-r-1
  border-solid
  ${(p) => (p.$disabled ? "border-base-light" : "border-primary")}
  flex
  items-center
  p-1
`;

interface CohortCreationButtonProps {
  readonly label: ReactNode;
  readonly numCases: number;
  readonly filters?: FilterSet;
  readonly filtersCallback?: () => Promise<FilterSet>;
}

const CohortCreationButton: React.FC<CohortCreationButtonProps> = ({
  label,
  numCases,
  filters,
  filtersCallback,
}: CohortCreationButtonProps) => {
  const [showSaveCohort, setShowSaveCohort] = useState(false);
  const [cohortFilters, setCohortFilters] = useState<FilterSet>(filters);
  const [loading, setLoading] = useState(false);
  const disabled = numCases === undefined || numCases === 0;

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
          onClick={async () => {
            if (filtersCallback) {
              setLoading(true);
              const createdFilters = await filtersCallback();
              setCohortFilters(createdFilters);
              setLoading(false);
            }
            setShowSaveCohort(true);
          }}
          disabled={disabled || loading}
          $fullWidth={React.isValidElement(label)} // if label is JSX.Element take the full width
        >
          <IconWrapper $disabled={disabled} aria-hidden="true">
            {loading ? (
              <Loader size={12} />
            ) : (
              <PlusIcon color="white" size={12} />
            )}
          </IconWrapper>
          <span className="pr-2 self-center">{label ?? "--"}</span>
        </CohortCreationStyledButton>
      </Tooltip>
      {showSaveCohort && (
        <SaveCohortModal
          onClose={() => setShowSaveCohort(false)}
          filters={cohortFilters}
        />
      )}
    </div>
  );
};

export default CohortCreationButton;