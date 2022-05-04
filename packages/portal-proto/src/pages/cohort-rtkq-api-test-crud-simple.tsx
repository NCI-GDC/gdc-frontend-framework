// import React from 'react'
import { NextPage } from "next";
import {
  useAddCohortMutation,
  useUpdateCohortMutation,
  useDeleteCohortMutation,
} from "@gff/core";
import { nanoid } from "nanoid";

const EditCohortTest: NextPage = () => {
  const cohort_id = 123456789;

  const [addCohort] = useAddCohortMutation();
  const [updateCohort] = useUpdateCohortMutation();
  const [deleteCohort] = useDeleteCohortMutation();

  const addBody = {
    id: cohort_id,
    name: "Original Cohort Name",
    facets: [],
  };

  const updateBody = {
    id: cohort_id,
    name: "Updated Cohort Name",
    facets: [],
  };

  return (
    <div>
      <label>{cohort_id}</label>
      <br></br>
      <button onClick={() => addCohort(addBody)}>Add</button>
      <button onClick={() => updateCohort(updateBody)}>Update</button>
      <button onClick={() => deleteCohort(cohort_id)}>Delete</button>
      <br></br>
    </div>
  );
};

export default EditCohortTest;
