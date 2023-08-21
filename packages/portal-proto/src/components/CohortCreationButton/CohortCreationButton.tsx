import React, { ReactNode } from "react";
import { Tooltip } from "@mantine/core";
import { FaPlus as PlusIcon } from "react-icons/fa";
import tw from "tailwind-styled-components";

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
  readonly handleClick: () => void;
}

const CohortCreationButton: React.FC<CohortCreationButtonProps> = ({
  label,
  numCases,
  handleClick,
}: CohortCreationButtonProps) => {
  const disabled = numCases === undefined || numCases === 0;

  return (
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
          onClick={handleClick}
          $fullWidth={React.isValidElement(label)} // if label is JSX.Element take the full width
        >
          <IconWrapper $disabled={disabled}>
            <PlusIcon color="white" size={12} />
          </IconWrapper>
          <span className="pr-2 self-center">{label}</span>
        </CohortCreationStyledButton>
      </span>
    </Tooltip>
  );
};

export default CohortCreationButton;
