import { NextPage } from "next";
import React, { useCallback, useEffect, useState } from "react";
import { UserFlowVariedPages } from "@/features/layout/UserFlowVariedPages";
import { headerElements } from "@/features/user-flow/workflow/navigation-utils";

import {
  addNewCohortWithFilterAndMessage,
  FilterSet,
  useCoreDispatch,
  useCreateCaseSetFromValuesMutation,
} from "@gff/core";

import { Text, Tooltip } from "@mantine/core";
import CreateCohortModal from "@/components/Modals/CreateCohortModal";
import CohortCreationButton from "../components/CohortCreationButton/CohortCreationButton";

interface CreateCohortFromCasesProps {
  readonly pickedCases: string[];
}

const CreateCohortFromCases = ({ pickedCases }: CreateCohortFromCasesProps) => {
  // get the RTK query hooks needed to create a caseSet
  const [createSet, response] = useCreateCaseSetFromValuesMutation();
  const onCreateSet = useCallback(
    () => createSet({ values: pickedCases }),
    [createSet, pickedCases],
  );

  return (
    <CreateCohortButtonFromCases
      onCreateSet={onCreateSet}
      response={response}
      numCases={pickedCases.length}
      fetchingCases={response.isLoading}
    />
  );
};

interface CreateCohortButtonFromCasesProps {
  readonly onCreateSet: () => void;
  readonly response: { isSuccess: boolean; data?: string };
  readonly numCases: number;
  readonly fetchingCases?: boolean;
}

export const CreateCohortButtonFromCases: React.FC<
  CreateCohortButtonFromCasesProps
> = ({
  onCreateSet,
  response,
  numCases,
  fetchingCases = false,
}: CreateCohortButtonFromCasesProps) => {
  const [name, setName] = useState(undefined);
  const coreDispatch = useCoreDispatch();

  // once the caseSet is created, create a cohort using
  // filters that include the caseSet
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
      // create the cohort
      coreDispatch(
        addNewCohortWithFilterAndMessage({
          filters: filters,
          message: "newCasesCohort",
          name,
        }),
      );
    }
  }, [response.isSuccess, name, coreDispatch, response.data]);

  const [showCreateCohort, setShowCreateCohort] = useState(false);

  return (
    <>
      <div className="p-1 w-96">
        <Tooltip label="Create a new unsaved cohort based on selection">
          <CohortCreationButton
            label={
              // passing a component as the label will esure the test is on one lioe
              <Text> {fetchingCases ? "Loading..." : "Create New Cohort"}</Text>
            }
            numCases={numCases}
            handleClick={() => {
              // once clicked will show the CreateCohortModal
              setShowCreateCohort(true);
            }}
          />
        </Tooltip>

        {showCreateCohort && (
          <CreateCohortModal // Show the modal, create cohort when create button is clicked
            // this will call the create set mutation in the parent component
            // and add the cohort to the store
            onClose={() => setShowCreateCohort(false)}
            onActionClick={(newName: string) => {
              setName(newName);
              if (numCases > 1) {
                onCreateSet();
              }
            }}
          />
        )}
      </div>
    </>
  );
};

const ExampleCreateCohort: NextPage = () => {
  const pickedCases = [
    "d3e93d76-6565-454a-a085-4492024350e9",
    "3348a7aa-f5c3-4fba-9968-68da5cedfd7e",
    "5693302a-4548-4c0b-8725-0cb7c67bc4f8",
    "e6183a43-24b9-4fe1-95c3-4cff67e6c1ed",
    "3f305a1f-1020-4ebb-82ab-fd132bcaea02",
    "b60f22ac-a659-4f33-b01d-820e86a9a5c9",
    "d72264ec-d4d7-423a-9216-ae4485f81aba",
    "545ba049-b7c1-4b46-9ec2-9331dccd6c60",
    "48ab48a5-30e7-4f2e-8d0f-9bad7b8dc7db",
    "3052065a-b8b1-48d3-971d-9d605292249c",
  ];

  return (
    <UserFlowVariedPages {...{ indexPath: "/", headerElements }}>
      <div className="w-full">
        <CreateCohortFromCases pickedCases={pickedCases} />
      </div>
    </UserFlowVariedPages>
  );
};

export default ExampleCreateCohort;
