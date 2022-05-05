// import React from 'react'
import React, { useState } from "react";
import { NextPage } from "next";
import {
  useGetCohortsQuery,
  useGetCohortByIdQuery,
  useAddCohortMutation,
  useUpdateCohortMutation,
  useDeleteCohortMutation,
} from "@gff/core";
import { nanoid } from "nanoid";

let CohortContent = ({ cohort }) => {
  return (
    <article key={cohort.id}>
      <p>Cohort ID: {cohort.id}</p>
      <p>Cohort Name: {cohort.name}</p>
    </article>
  );
};

const EditCohortTest: NextPage = () => {
  const cohortId = 123456789;
  let button_class =
    "text-2xl border rounded bg-nci-gray-lighter opacity-75 hover:opacity-100";
  // let button_class = "px-2 py-1 border rounded bg-nci-gray-lighter opacity-75 hover:opacity-100"

  // rtk queries and mutations
  const [addCohort] = useAddCohortMutation();
  const [updateCohort] = useUpdateCohortMutation();
  const [deleteCohort] = useDeleteCohortMutation();

  const addBody = {
    id: cohortId,
    name: "Original Cohort Name",
    facets: [],
  };

  const updateBody = {
    id: cohortId,
    name: "Updated Cohort Name",
    facets: [],
  };

  const {
    data: cohortsListData,
    isLoading: isCohortsListLoading,
    isSuccess: isCohortsListSuccess,
    isError: isCohortsListError,
  } = useGetCohortsQuery();

  let cohortsListContent;
  if (isCohortsListLoading) {
    cohortsListContent = <div>Loading</div>;
  } else if (isCohortsListSuccess) {
    cohortsListContent = cohortsListData.map((cohort) => (
      <div>
        <CohortContent key={cohort.id} cohort={cohort} />
        <button
          className={button_class}
          onClick={() => deleteCohort(cohort.id)}
        >
          Delete
        </button>
      </div>
    ));
  } else if (isCohortsListError || !cohortsListData) {
    cohortsListContent = <div>Error loading list</div>;
  }

  const {
    data: cohortData,
    isLoading: isCohortLoading,
    isSuccess: isCohortSuccess,
    isError: isCohortError,
    //error: cohortError
  } = useGetCohortByIdQuery(cohortId);

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

  return (
    <div>
      <div className="font-montserrat text-xl text-nci-gray-darker p-4 shadow-md transition-colors">
        <h1>Cohort</h1>
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
        <h1>Cohort List</h1>
        <br></br>
        {cohortsListContent}
      </div>
    </div>
  );
};

export default EditCohortTest;
