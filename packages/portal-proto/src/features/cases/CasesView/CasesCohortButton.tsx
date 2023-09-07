import React, { useState, useEffect } from "react";
import {
  useCoreDispatch,
  FilterSet,
  addNewCohortWithFilterAndMessage,
  useCreateCaseSetFromValuesMutation,
} from "@gff/core";
import {
  SelectCohortsModal,
  WithOrWithoutCohortType,
} from "./SelectCohortsModal";
import CreateCohortModal from "@/components/Modals/CreateCohortModal";
import { DropdownWithIcon } from "@/components/DropdownWithIcon/DropdownWithIcon";
import { CountsIcon } from "@/features/shared/tailwindComponents";

export const CasesCohortButton = ({
  pickedCases,
}: {
  pickedCases: string[];
}): JSX.Element => {
  const [name, setName] = useState(undefined);
  const [createSet, response] = useCreateCaseSetFromValuesMutation();

  const coreDispatch = useCoreDispatch();

  useEffect(() => {
    if (response.isSuccess) {
      const filters: FilterSet = {
        mode: "and",
        root: {
          "cases.case_id": {
            operator: "includes",
            field: "cases.case_id",
            operands: [`set_id:${response.data}`],
          },
        },
      };
      coreDispatch(
        addNewCohortWithFilterAndMessage({
          filters: filters,
          message: "newCasesCohort",
          name,
        }),
      );
    }
  }, [response.isSuccess, name, coreDispatch, response.data]);

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
        zIndex={10}
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
        <CreateCohortModal
          onClose={() => setShowCreateCohort(false)}
          onActionClick={(newName: string) => {
            setName(newName);
            if (pickedCases.length > 1) {
              createSet({ values: pickedCases });
            }
          }}
        />
      )}
    </>
  );
};
