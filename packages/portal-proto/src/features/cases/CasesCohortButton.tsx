import React from "react";
import { Button } from "@mantine/core";
import { useCoreSelector, selectSelectedCases } from "@gff/core";
import tw from "tailwind-styled-components";

interface CountsIconProps {
  $count?: number;
}

export const CountsIcon = tw.div<CountsIconProps>`
${(p: CountsIconProps) =>
  p.$count !== undefined && p.$count > 0 ? "bg-primary" : "bg-transparent"}
inline-flex
items-center
justify-center
w-8
h-5
text-primary-contrast
font-heading
rounded-md

`;

export const CasesCohortButton = (): JSX.Element => {
  const pickedCases: ReadonlyArray<string> = useCoreSelector((state) =>
    selectSelectedCases(state),
  );

  return (
    <Button
      variant="outline"
      color="primary"
      disabled={pickedCases.length == 0}
      leftIcon={
        pickedCases.length ? (
          <CountsIcon $count={pickedCases.length}>
            {" "}
            {pickedCases.length}{" "}
          </CountsIcon>
        ) : null
      }
    >
      Create New Cohort
    </Button>
  );
};
