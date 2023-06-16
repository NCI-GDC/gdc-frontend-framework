import React, { useState } from "react";
import { Tooltip } from "@mantine/core";
import { FaPlus as PlusIcon } from "react-icons/fa";
import tw from "tailwind-styled-components";
import {
  FilterSet,
  useCoreSelector,
  selectAvailableCohorts,
  useCoreDispatch,
  addNewCohortWithFilterAndMessage,
} from "@gff/core";
import { SaveOrCreateCohortModal } from "@/components/Modals/SaveOrCreateCohortModal";

const CohortCreationStyledButton = tw.button`
  flex
  items-center
  w-full
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

const IconWrapper = tw.span`
  ${(p) => (p.$disabled ? "bg-base-light" : "bg-accent")}
  border-r-1
  border-solid
  ${(p) => (p.$disabled ? "border-base-light" : "border-primary")}
  h-full
  min-h-[24px]
  flex
  items-center
  p-1
`;

interface CohortCreationButtonProps {
  readonly caseFilters: FilterSet;
  readonly label: string | number;
  readonly numCases: number;
}

const CohortCreationButton: React.FC<CohortCreationButtonProps> = ({
  caseFilters,
  label,
  numCases,
}: CohortCreationButtonProps) => {
  const [showCreateCohort, setShowCreateCohort] = useState(false);
  const coreDispatch = useCoreDispatch();
  const cohorts = useCoreSelector((state) => selectAvailableCohorts(state));
  const onNameChange = (name: string) =>
    cohorts.every((cohort) => cohort.name !== name);

  const createCohort = (name: string) => {
    coreDispatch(
      addNewCohortWithFilterAndMessage({
        filters: caseFilters,
        name,
        message: "newCasesCohort",
      }),
    );
  };

  const disabled = numCases === undefined || numCases === 0;

  return (
    <div className="p-1">
      <Tooltip
        label={
          disabled ? (
            "No cases available"
          ) : (
            <>
              Create a new cohort of{" "}
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
        <span>
          <CohortCreationStyledButton
            disabled={disabled}
            onClick={() => setShowCreateCohort(true)}
          >
            <IconWrapper $disabled={disabled}>
              <PlusIcon color="white" size={12} />
            </IconWrapper>
            <span className="pr-2 font-bold">{label}</span>
          </CohortCreationStyledButton>
        </span>
      </Tooltip>
      {showCreateCohort && (
        <SaveOrCreateCohortModal
          entity="cohort"
          action="create"
          opened
          onClose={() => setShowCreateCohort(false)}
          onActionClick={(newName: string) => {
            createCohort(newName);
          }}
          onNameChange={onNameChange}
        />
      )}
    </div>
  );
};

export default CohortCreationButton;
