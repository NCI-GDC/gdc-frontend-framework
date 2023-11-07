import React, { useState, useEffect, useCallback } from "react";
import { useDeepCompareCallback } from "use-deep-compare";
import {
  useCreateCaseSetFromValuesMutation,
  useCreateCaseSetFromFiltersMutation,
  GqlOperation,
  useGetCasesQuery,
} from "@gff/core";
import {
  SelectCohortsModal,
  WithOrWithoutCohortType,
} from "./SelectCohortsModal";
import SaveCohortModal from "@/components/Modals/SaveCohortModal";
import { DropdownWithIcon } from "@/components/DropdownWithIcon/DropdownWithIcon";
import { CountsIcon } from "@/components/tailwindComponents";
import { Tooltip } from "@mantine/core";

interface CasesCohortButtonProps {
  readonly onCreateSet: () => void;
  readonly response: { isSuccess: boolean; data?: string };
  readonly cases: readonly string[];
  readonly numCases: number;
  readonly fetchingCases?: boolean;
}

export const CasesCohortButton: React.FC<CasesCohortButtonProps> = ({
  onCreateSet,
  response,
  cases,
  numCases,
  fetchingCases = false,
}: CasesCohortButtonProps) => {
  const [openSelectCohorts, setOpenSelectCohorts] = useState(false);
  const [showSaveCohort, setShowSaveCohort] = useState(false);
  const [withOrWithoutCohort, setWithOrWithoutCohort] =
    useState<WithOrWithoutCohortType>(undefined);

  useEffect(() => {
    if (response.isSuccess) {
      setShowSaveCohort(true);
    }
  }, [response.isSuccess]);

  return (
    <>
      <Tooltip label="Create a new unsaved cohort based on selection">
        <span>
          <DropdownWithIcon
            dropdownElements={
              fetchingCases
                ? [{ title: "Loading..." }]
                : [
                    {
                      title: "Only Selected Cases",
                      onClick: () => {
                        if (numCases > 1) {
                          onCreateSet();
                        }
                        setShowSaveCohort(true);
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
                  ]
            }
            TargetButtonChildren="Save New Cohort"
            disableTargetWidth={true}
            targetButtonDisabled={numCases == 0}
            LeftIcon={
              numCases ? (
                <CountsIcon $count={numCases}>
                  {numCases.toLocaleString()}
                </CountsIcon>
              ) : null
            }
            menuLabelText={`${numCases.toLocaleString()}
        ${numCases > 1 ? " Cases" : " Case"}`}
            menuLabelCustomClass="bg-primary text-primary-contrast font-heading font-bold mb-2"
            customPosition="bottom-start"
            zIndex={100}
          />
        </span>
      </Tooltip>
      {openSelectCohorts && (
        <SelectCohortsModal
          opened
          onClose={() => setOpenSelectCohorts(false)}
          withOrWithoutCohort={withOrWithoutCohort}
          pickedCases={cases}
        />
      )}
      {showSaveCohort && (
        <SaveCohortModal
          onClose={() => setShowSaveCohort(false)}
          filters={{
            mode: "and",
            root: {
              "cases.case_id": {
                operator: "includes",
                field: "cases.case_id",
                operands: [`set_id:${response.data}`],
              },
            },
          }}
        />
      )}
    </>
  );
};

interface CasesCohortButtonFromValuesProps {
  readonly pickedCases: string[];
}

export const CasesCohortButtonFromValues: React.FC<
  CasesCohortButtonFromValuesProps
> = ({ pickedCases }: CasesCohortButtonFromValuesProps) => {
  const [createSet, response] = useCreateCaseSetFromValuesMutation();
  const onCreateSet = useCallback(
    () => createSet({ values: pickedCases }),
    [createSet, pickedCases],
  );

  return (
    <CasesCohortButton
      onCreateSet={onCreateSet}
      response={response}
      cases={pickedCases}
      numCases={pickedCases.length}
    />
  );
};

interface CasesCohortButtonFromFilters {
  readonly filters?: GqlOperation;
  readonly numCases: number;
}

export const CasesCohortButtonFromFilters: React.FC<
  CasesCohortButtonFromFilters
> = ({ filters, numCases }: CasesCohortButtonFromFilters) => {
  const [createSet, response] = useCreateCaseSetFromFiltersMutation();
  const onCreateSet = useDeepCompareCallback(
    () => createSet({ filters }),
    [createSet, filters],
  );
  const { data, isSuccess, isLoading } = useGetCasesQuery(
    { filters, fields: ["case_id"], size: 50000 },
    { skip: filters === undefined },
  );

  return (
    <CasesCohortButton
      onCreateSet={onCreateSet}
      response={response}
      numCases={numCases}
      cases={isSuccess ? data.map((d) => d.case_id) : []}
      fetchingCases={isLoading}
    />
  );
};
