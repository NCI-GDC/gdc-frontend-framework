import React, { useState } from "react";
import { Tooltip } from "@mantine/core";
import { FaPlus as PlusIcon } from "react-icons/fa";
import tw from "tailwind-styled-components";
import {
  FilterSet,
  useCoreDispatch,
  addNewCohortWithFilterAndMessage,
} from "@gff/core";
import CreateCohortModal from "./Modals/CreateCohortModal";

export const CohortCreationStyledButton = tw.button`
  flex
  items-center
  w-full
  max-w-[125px]
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
              Create a new unsaved cohort of{" "}
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
            <span className="pr-2">{label}</span>
          </CohortCreationStyledButton>
        </span>
      </Tooltip>
      {showCreateCohort && (
        <CreateCohortModal
          onClose={() => setShowCreateCohort(false)}
          onActionClick={(newName: string) => {
            createCohort(newName);
          }}
        />
      )}
    </div>
  );
};

export default CohortCreationButton;
