import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  useCoreSelector,
  selectSelectedCases,
  useCoreDispatch,
  FilterSet,
  resetSelectedCases,
  addNewCohortWithFilterAndMessage,
  selectAvailableCohorts,
} from "@gff/core";
import tw from "tailwind-styled-components";
import {
  SelectCohortsModal,
  WithOrWithoutCohortType,
} from "./SelectCohortsModal";
import { SaveOrCreateCohortModal } from "@/components/Modals/SaveOrCreateCohortModal";
import { DropdownWithIcon } from "@/components/DropdownWithIcon/DropdownWithIcon";

interface CountsIconProps {
  $count?: number;
}

export const CountsIcon = tw.div<CountsIconProps>`
${(p: CountsIconProps) =>
  p.$count !== undefined && p.$count > 0 ? "bg-accent" : "bg-transparent"}
inline-flex
items-center
justify-center
w-8
h-5
text-accent-contrast
font-heading
rounded-md

`;

export const CasesCohortButton = (): JSX.Element => {
  const pickedCases: ReadonlyArray<string> = useCoreSelector((state) =>
    selectSelectedCases(state),
  );

  const cohorts = useCoreSelector((state) => selectAvailableCohorts(state));
  const coreDispatch = useCoreDispatch();

  const onNameChange = (name: string) =>
    cohorts.every((cohort) => cohort.name !== name);

  const createCohortFromCases = (name: string) => {
    const filters: FilterSet = {
      mode: "and",
      root: {
        "cases.case_id": {
          operator: "includes",
          field: "cases.case_id",
          operands: pickedCases,
        },
      },
    };
    coreDispatch(resetSelectedCases());
    coreDispatch(
      addNewCohortWithFilterAndMessage({
        filters: filters,
        message: "newCasesCohort",
        name,
        group: {
          ids: [...pickedCases],
          field: "cases.case_id",
          groupId: uuidv4(),
        },
      }),
    );
  };

  const [openSelectCohorts, setOpenSelectCohorts] = useState(false);
  const [showCreateCohort, setShowCreateCohort] = useState(false);
  const [withOrWithoutCohort, setWithOrWithoutCohort] =
    useState<WithOrWithoutCohortType>(undefined);

  return (
    <>
      <DropdownWithIcon
        dropdownElements={[
          {
            title: "Only Selected Cases",
            onClick: () => {
              setShowCreateCohort(true);
            },
          },
          {
            title: " Existing Cohort With Selected Cases",
            onClick: () => {
              setWithOrWithoutCohort("with");
              setOpenSelectCohorts(true);
            },
          },
          {
            title: " Existing Cohort Without Selected Cases",
            onClick: () => {
              setWithOrWithoutCohort("without");
              setOpenSelectCohorts(true);
            },
          },
        ]}
        TargetButtonChildren="Create New Cohort"
        disableTargetWidth={true}
        targetButtonDisabled={pickedCases.length == 0}
        LeftIcon={
          pickedCases.length ? (
            <CountsIcon $count={pickedCases.length}>
              {pickedCases.length}
            </CountsIcon>
          ) : null
        }
        menuLabelText={`${pickedCases.length}
        ${pickedCases.length > 1 ? " Cases" : " Case"}`}
        menuLabelCustomClass="bg-primary text-primary-contrast font-heading font-bold mb-2"
        customPosition="bottom-start"
      />

      {openSelectCohorts && (
        <SelectCohortsModal
          opened
          onClose={() => setOpenSelectCohorts(false)}
          withOrWithoutCohort={withOrWithoutCohort}
          pickedCases={pickedCases}
        />
      )}
      {showCreateCohort && (
        <SaveOrCreateCohortModal
          entity="cohort"
          action="create"
          opened
          onClose={() => setShowCreateCohort(false)}
          onActionClick={(newName: string) => {
            createCohortFromCases(newName);
          }}
          onNameChange={onNameChange}
        />
      )}
    </>
  );
};
