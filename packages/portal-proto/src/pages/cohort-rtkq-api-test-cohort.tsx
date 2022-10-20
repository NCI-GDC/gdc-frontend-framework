// This page tests the cohort API middleware

import React from "react";
import { NextPage } from "next";
import {
  useGetCohortsByContextIdQuery,
  useGetCohortByIdQuery,
  useAddCohortMutation,
  useUpdateCohortMutation,
  useDeleteCohortMutation,
} from "@gff/core";

// for displaying cohort data
const CohortContent = ({ cohort }) => {
  return (
    <article>
      <p>Cohort ID: {cohort.id}</p>
      <p>Cohort Name: {cohort.name}</p>
      <p>Cohort Type: {cohort.type}</p>
      <p>Filters: {JSON.stringify(cohort.filters)}</p>
      <p>Case IDs: {JSON.stringify(cohort.case_ids)}</p>
      <p>Data Release: {JSON.stringify(cohort.data_release)}</p>
    </article>
  );
};

const CohortApiTest: NextPage = () => {
  const button_class =
    "text-2xl border rounded bg-base-lighter opacity-75 hover:opacity-100";

  // redux state, queries and mutations
  const [addCohort, { data: addCohortData, isSuccess: isAddCohortSuccess }] =
    useAddCohortMutation();
  const [updateCohort] = useUpdateCohortMutation();
  const [deleteCohort] = useDeleteCohortMutation();

  // id for test and control cohorts, test id initially set to invalid value
  const testCohortId = isAddCohortSuccess
    ? addCohortData.id
    : "invalid-id-for-testing";

  // request body for creates
  const addBody = {
    name: "New Test Cohort",
    type: "static",
    filters: {
      content: { field: "cases.primary_site", value: "trachea" },
      op: "=" as const,
    },
  };

  // request body for updates
  const updateBody = {
    id: testCohortId,
    name: "Updated Test Cohort",
    type: "static",
    filters: {
      content: { field: "cases.primary_site", value: "lip" },
      op: "=" as const,
    },
  };

  // using rtkquery to get list of cohorts for a context
  const {
    data: cohortsListData,
    isLoading: isCohortsListLoading,
    isSuccess: isCohortsListSuccess,
    isError: isCohortsListError,
  } = useGetCohortsByContextIdQuery();

  // render list of cohorts for a context
  let cohortsListContent;
  if (isCohortsListLoading) {
    cohortsListContent = <div>Loading</div>;
  } else if (isCohortsListSuccess) {
    cohortsListContent = cohortsListData.map((cohort) => (
      <div key={cohort.id}>
        <CohortContent cohort={cohort} />
        <button
          className={button_class}
          onClick={() => deleteCohort(cohort.id)}
        >
          Delete
        </button>
        <br></br>
        <br></br>
      </div>
    ));
  } else if (isCohortsListError || !cohortsListData) {
    cohortsListContent = (
      <div>
        Error loading list, check if valid context cookie exists.
        <br></br>
        Adding a new cohort will provide a valid context cookie.
      </div>
    );
  }

  // use rtk query to get a specific target test cohort
  const {
    data: cohortData,
    isLoading: isCohortLoading,
    isSuccess: isCohortSuccess,
    isError: isCohortError,
  } = useGetCohortByIdQuery(testCohortId);

  // render specific cohort
  let cohortContent;
  if (isCohortLoading) {
    cohortContent = <div>Loading</div>;
  } else if (isCohortSuccess) {
    cohortContent = (
      <div>
        <CohortContent cohort={cohortData} />
      </div>
    );
  } else if (isCohortError || !cohortData) {
    cohortContent = <div>Cohort with id {testCohortId} does not exist</div>;
  }

  // render page
  return (
    <div>
      <div className="font-montserrat text-xl text-primary-content-darker p-4 shadow-md transition-colors">
        <h1>Test Cohort</h1>
        <br></br>
        {cohortContent}
        <br></br>
        <div className="flex flex-row gap-x-1">
          <button className={button_class} onClick={() => addCohort(addBody)}>
            Add
          </button>
          <button
            className={button_class}
            onClick={() => updateCohort(updateBody)}
          >
            Update
          </button>
          <button
            className={button_class}
            onClick={() => {
              deleteCohort(testCohortId);
              // setTestCohortName("");
            }}
          >
            Delete
          </button>
        </div>
        <br></br>
      </div>

      <div className="font-montserrat text-xl text-primary-content-darker p-4 shadow-md transition-colors">
        <h1>Context Specific Cohort List</h1>
        <p>List of cohorts associated with selected context</p>
        <br></br>
        {cohortsListContent}
      </div>
    </div>
  );
};

export default CohortApiTest;
