import React, { ChangeEvent, useState } from "react";
import { NextPage } from "next";
import {
  useGetCohortByIdQuery,
  useDeleteCohortMutation,
  useAddCohortMutation,
} from "@gff/core";

let CohortContent = ({ cohort }) => {
  return (
    <article key={cohort.id}>
      <h3>Cohort ID: {cohort.id}</h3>
      <div>Cohort Name: {cohort.name}</div>
    </article>
  );
};

const SingleCohortTest: NextPage = () => {
  const { newDeletable } = useAddCohortMutation({
    id: "delete-001",
    name: "Delete this cohort",
    facets: [],
  });
  const [deleteId, setDeleteId] = useState("");
  const [deleteCohort] = useDeleteCohortMutation();
  const [addCohort] = useAddCohortMutation();

  const handleAddSubmit = () => {
    addCohort({
      id: "delete-001",
      name: "Delete this cohort",
      facets: [],
    });
  };

  const handleDelete = () => {
    //deleteCohort({deleteId});
    deleteCohort("46b46931-9235-4a5d-92e3-bf116dceb70c");
  };

  const { data, isLoading, isSuccess, isError, error } = useGetCohortByIdQuery(
    "46b46931-9235-4a5d-92e3-bf116dceb70c",
  );

  let content;

  if (isLoading) {
    content = <div>Loading</div>;
  } else if (isSuccess) {
    content = (
      <div>
        <CohortContent key={data.id} cohort={data} />
      </div>
    );
    //setDeleteId(data.id);
  } else if (isError || !data) {
    content = <div>Something went wrong</div>;
  }

  return (
    <div>
      <h1>Testing Cohort Delete</h1>
      {content}
      <button type="button" onClick={handleDelete}>
        Delete
      </button>
    </div>
  );
};

export default SingleCohortTest;
