import React, { useState, useEffect, useCallback } from "react";
import { useDeepCompareCallback } from "use-deep-compare";
import {
  useCreateCaseSetFromValuesMutation,
  useCreateCaseSetFromFiltersMutation,
  GqlOperation,
  useGetCasesQuery,
  useCoreDispatch,
  showModal,
  Modals,
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
  readonly response: { isSuccess: boolean; isError: boolean; data?: string };
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
  const dispatch = useCoreDispatch();

  useEffect(() => {
    if (response.isSuccess) {
      setShowSaveCohort(true);
    } else if (response.isError) {
      dispatch(showModal({ modal: Modals.SaveCohortErrorModal }));
    }
  }, [response.isSuccess, response.isError, dispatch]);

  const dropDownIcon = (
    <DropdownWithIcon
      customDataTestId="button-save-new-cohort-cases-table"
      dropdownElements={
        fetchingCases
          ? [{ title: "Loading..." }]
          : [
              {
                title: "Only Selected Cases",
                onClick: () => {
                  if (numCases > 1) {
                    onCreateSet();
                  } else {
                    setShowSaveCohort(true);
                  }
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
      targetButtonDisabled={numCases === 0}
      LeftSection={
        numCases ? (
          <CountsIcon $count={numCases}>{numCases.toLocaleString()}</CountsIcon>
        ) : null
      }
      menuLabelText={`${numCases.toLocaleString()}
        ${numCases > 1 ? " Cases" : " Case"}`}
      menuLabelCustomClass="bg-primary text-primary-contrast font-heading font-bold mb-2"
      customPosition="bottom-start"
      tooltip={"Save a new cohort based on selection"}
    />
  );
  return (
    <>
      <span>
        {numCases === 0 ? (
          <Tooltip label={"Save a new cohort based on selection"}>
            <span>{dropDownIcon}</span>
          </Tooltip>
        ) : (
          <span>{dropDownIcon}</span>
        )}
      </span>

      <SelectCohortsModal
        opened={openSelectCohorts}
        onClose={() => setOpenSelectCohorts(false)}
        withOrWithoutCohort={withOrWithoutCohort}
        pickedCases={cases}
      />

      <SaveCohortModal
        opened={showSaveCohort}
        onClose={() => setShowSaveCohort(false)}
        filters={{
          mode: "and",
          root: {
            "cases.case_id": {
              operator: "includes",
              field: "cases.case_id",
              operands: [numCases > 1 ? `set_id:${response.data}` : cases[0]],
            },
          },
        }}
      />
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
    () =>
      createSet({ values: pickedCases, intent: "portal", set_type: "frozen" }),
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
  readonly case_filters?: GqlOperation;
  readonly numCases: number;
}

export const CasesCohortButtonFromFilters: React.FC<
  CasesCohortButtonFromFilters
> = ({ filters, case_filters, numCases }: CasesCohortButtonFromFilters) => {
  const [createSet, response] = useCreateCaseSetFromFiltersMutation();
  const onCreateSet = useDeepCompareCallback(
    () =>
      createSet({
        case_filters,
        filters,
        intent: "portal",
        set_type: "frozen",
      }),
    [case_filters, createSet, filters],
  );
  const { data, isSuccess, isLoading } = useGetCasesQuery(
    { request: { filters, fields: ["case_id"], size: 50000 } },
    { skip: filters === undefined },
  );

  return (
    <CasesCohortButton
      onCreateSet={onCreateSet}
      response={response}
      numCases={numCases}
      cases={isSuccess ? data?.hits.map((d) => d.case_id) : []}
      fetchingCases={isLoading}
    />
  );
};
