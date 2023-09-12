import React, { useState, useEffect, useCallback } from "react";
import { useDeepCompareCallback } from "use-deep-compare";
import {
  useCoreSelector,
  selectSelectedCases,
  useCoreDispatch,
  FilterSet,
  resetSelectedCases,
  addNewCohortWithFilterAndMessage,
  useCreateCaseSetFromValuesMutation,
  useCreateCaseSetFromFiltersMutation,
  GqlOperation,
  useGetCasesQuery,
} from "@gff/core";
import {
  SelectCohortsModal,
  WithOrWithoutCohortType,
} from "./SelectCohortsModal";
import CreateCohortModal from "@/components/Modals/CreateCohortModal";
import { DropdownWithIcon } from "@/components/DropdownWithIcon/DropdownWithIcon";
import { CountsIcon } from "@/features/shared/tailwindComponents";

interface CasesCohortButtonProps {
  readonly onCreateSet: () => void;
  readonly response: { isSuccess: boolean; data?: string };
  readonly cases: readonly string[];
  readonly numCases: number;
}

export const CasesCohortButton: React.FC<CasesCohortButtonProps> = ({
  onCreateSet,
  response,
  cases,
  numCases,
}: CasesCohortButtonProps) => {
  const [name, setName] = useState(undefined);
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
      coreDispatch(resetSelectedCases());
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
        targetButtonDisabled={numCases == 0}
        LeftIcon={
          numCases ? (
            <CountsIcon $count={numCases}>{numCases}</CountsIcon>
          ) : null
        }
        menuLabelText={`${numCases}
        ${numCases > 1 ? " Cases" : " Case"}`}
        menuLabelCustomClass="bg-primary text-primary-contrast font-heading font-bold mb-2"
        customPosition="bottom-start"
        zIndex={100}
      />

      {openSelectCohorts && (
        <SelectCohortsModal
          opened
          onClose={() => setOpenSelectCohorts(false)}
          withOrWithoutCohort={withOrWithoutCohort}
          pickedCases={cases}
        />
      )}
      {showCreateCohort && (
        <CreateCohortModal
          onClose={() => setShowCreateCohort(false)}
          onActionClick={(newName: string) => {
            setName(newName);
            if (numCases > 1) {
              onCreateSet();
            }
          }}
        />
      )}
    </>
  );
};

export const CasesCohortButtonFromValues: React.FC = () => {
  const pickedCases: ReadonlyArray<string> = useCoreSelector((state) =>
    selectSelectedCases(state),
  );
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
  const { data, isSuccess } = useGetCasesQuery(
    { filters, fields: ["case_id"], size: 50000 },
    { skip: filters === undefined },
  );

  return (
    <CasesCohortButton
      onCreateSet={onCreateSet}
      response={response}
      numCases={numCases}
      cases={isSuccess ? data.map((d) => d.case_id) : []}
    />
  );
};
