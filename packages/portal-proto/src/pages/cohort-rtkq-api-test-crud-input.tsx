// This page tests integration of the cohort API middleware with the existing
// analysis page. That page was copied in whole and then modified to grab
// cohorts from the API middleware instead of a static const.

// For this page to work, the mock cohort api must be started. See
// data/cohort-api-server.js for additional details.

import React, { useState } from "react";
import { NextPage } from "next";
import {
  useGetCohortsQuery,
  useGetCohortByIdQuery,
  useAddCohortMutation,
  useUpdateCohortMutation,
  useDeleteCohortMutation,
} from "@gff/core";
import { useCookies } from "react-cookie";

const CohortCrudTest: NextPage = () => {
  // for testing authorization via cookie
  const [cookies, setCookie] = useCookies(["context-id"]);
  setCookie("context-id", "FAKE-UUID-FOR-TESTING-CONTEXT-HEADER");

  // literals
  const cohortId = "CRUD-TEST-2";
  let button_class =
    "text-2xl border rounded bg-nci-gray-lighter opacity-75 hover:opacity-100";

  // page state
  const [cohortName, setCohortName] = useState("");
  const onCohortNameChanged = (e) => setCohortName(e.target.value);

  // rtk queries and mutations
  const [addCohort] = useAddCohortMutation();
  const [updateCohort] = useUpdateCohortMutation();
  const [deleteCohort] = useDeleteCohortMutation();

  // request body for creates
  const addBody = {
    id: cohortId,
    name: cohortName,
    facets: [],
  };

  // request body for updates
  const updateBody = {
    id: cohortId,
    name: cohortName,
    facets: [],
  };

  // using rtkquery to get list of cohorts
  const {
    data: cohortsListData,
    isLoading: isCohortsListLoading,
    isSuccess: isCohortsListSuccess,
    isError: isCohortsListError,
  } = useGetCohortsQuery();

  // render list of cohorts
  let cohortsListContent;
  if (isCohortsListLoading) {
    cohortsListContent = <div>Loading</div>;
  } else if (isCohortsListSuccess) {
    cohortsListContent = cohortsListData.map((cohort) => (
      <article key={cohort.id}>
        <p>Cohort ID: {cohort.id}</p>
        <p>Cohort Name: {cohort.name}</p>
        <br></br>
      </article>
    ));
  } else if (isCohortsListError || !cohortsListData) {
    cohortsListContent = <div>Error loading list</div>;
  }

  // use rtk query to get a specific target cohort
  const {
    data: cohortData,
    isLoading: isCohortLoading,
    isSuccess: isCohortSuccess,
    isError: isCohortError,
  } = useGetCohortByIdQuery(cohortId);

  // render specific cohort
  let cohortContent;
  if (isCohortLoading) {
    cohortContent = <div>Loading</div>;
  } else if (isCohortSuccess) {
    cohortContent = (
      <div>
        <article key={cohortData.id}>
          <p>Cohort ID: {cohortData.id}</p>
          <label htmlFor="updateCohortName">Cohort Name</label>
          <input
            id="updateCohortName"
            name="updateCohortName"
            type="text"
            value={cohortName}
            onChange={onCohortNameChanged}
          />
        </article>
      </div>
    );
  } else if (isCohortError || !cohortData) {
    cohortContent = (
      <div>
        <p>Cohort with id {cohortId} does not exist</p>
        <label htmlFor="newCohortName">Create w/ Cohort Name</label>
        <input
          id="newCohortName"
          name="newCohortName"
          type="text"
          value={cohortName}
          onChange={onCohortNameChanged}
        />
      </div>
    );
  }

  // use rtk query to get a control cohort that won't be refreshed when the target cohort is modified
  const {
    data: controlCohortData,
    isLoading: isControlCohortLoading,
    isSuccess: isControlCohortSuccess,
    isError: isControlCohortError,
  } = useGetCohortByIdQuery("2f70de91-7c5a-41d2-9620-90670dfdaddb");

  // render specific cohort
  let controlCohortContent;
  if (isControlCohortLoading) {
    controlCohortContent = <div>Loading</div>;
  } else if (isControlCohortSuccess) {
    controlCohortContent = (
      <div>
        <article key={controlCohortData.id}>
          <p>Cohort ID: {controlCohortData.id}</p>
          <p>Cohort Name: {controlCohortData.name}</p>
        </article>
      </div>
    );
  } else if (isControlCohortError || !controlCohortData) {
    controlCohortContent = <div>Error occurred when getting cohort</div>;
  }

  // render page
  return (
    <div>
      <div className="font-montserrat text-xl text-nci-gray-darker p-4 shadow-md transition-colors">
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
              deleteCohort(cohortId);
              setCohortName("");
            }}
          >
            Delete
          </button>
        </div>
        <br></br>
      </div>
      <div className="font-montserrat text-xl text-nci-gray-darker p-4 shadow-md transition-colors">
        <h1>Control Cohort</h1>
        <br></br>
        {controlCohortContent}
      </div>
      <div className="font-montserrat text-xl text-nci-gray-darker p-4 shadow-md transition-colors">
        <h1>Cohort List</h1>
        <br></br>
        {cohortsListContent}
      </div>
    </div>
  );
};

export default CohortCrudTest;
