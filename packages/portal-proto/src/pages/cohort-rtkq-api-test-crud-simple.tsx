// for this page to work, json-server must be started. To do this from the
// project root run: node data/server.js

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

let CohortContent = ({ cohort }) => {
  return (
    <article key={cohort.id}>
      <p>Cohort ID: {cohort.id}</p>
      <p>Cohort Name: {cohort.name}</p>
    </article>
  );
};

const CohortCrudTest: NextPage = () => {
  // literals
  const [cookies, setCookie] = useCookies(["cookie-x-context-id"]);

  setCookie("cookie-x-context-id", "FAKE-UUID-FOR-TESTING-CONTEXT-HEADER");
  const cohortId = 123456789;
  let button_class =
    "text-2xl border rounded bg-nci-gray-lighter opacity-75 hover:opacity-100";

  // rtk queries and mutations
  const [addCohort] = useAddCohortMutation();
  const [updateCohort] = useUpdateCohortMutation();
  const [deleteCohort] = useDeleteCohortMutation();

  // request body for creates
  const addBody = {
    id: cohortId,
    name: "Original Cohort Name",
    facets: [],
  };

  // request body for updates
  const updateBody = {
    id: cohortId,
    name: "Updated Cohort Name",
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
        <button
          className={button_class}
          onClick={() => deleteCohort(cohort.id)}
        >
          Delete
        </button>
      </article>
    ));
  } else if (isCohortsListError || !cohortsListData) {
    cohortsListContent = <div>Error loading list</div>;
  }

  // use rtk query to get a specific cohort
  const {
    data: cohortData,
    isLoading: isCohortLoading,
    isSuccess: isCohortSuccess,
    isError: isCohortError,
    //error: cohortError
  } = useGetCohortByIdQuery(cohortId);

  // render specific cohort
  let cohortContent;
  if (isCohortLoading) {
    cohortContent = <div>Loading</div>;
  } else if (isCohortSuccess) {
    cohortContent = (
      <div>
        <CohortContent key={cohortData.id} cohort={cohortData} />
      </div>
    );
  } else if (isCohortError || !cohortData) {
    cohortContent = <div>Cohort with id {cohortId} does not exist</div>;
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
        <CohortContent key={controlCohortData.id} cohort={controlCohortData} />
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
            onClick={() => deleteCohort(cohortId)}
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
