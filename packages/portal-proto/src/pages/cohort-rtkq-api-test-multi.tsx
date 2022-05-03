import { NextPage } from "next";
import { useGetCohortsQuery, useAddCohortMutation } from "@gff/core";
import React, { ChangeEvent, useState } from "react";
import { nanoid } from "nanoid";

let CohortContent = ({ cohort }) => {
  return (
    <article key={cohort.id}>
      <h3>Cohort ID: {cohort.id}</h3>
      <div>Cohort Name: {cohort.name}</div>
    </article>
  );
};

const CohortMultiTest: NextPage = () => {
  let CohortInput = ({ cohort }) => {
    return (
      <div>
        <input
          name="Cohort ID"
          value={cohort.id}
          onChange={handleInputChange}
        />
        <br />
        <input name="Cohort Name" value={cohort.name} />
        <br />
        <button type="button">Update</button>
      </div>
    );
  };

  const [newName, setNewName] = useState("");
  const [addCohort] = useAddCohortMutation();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewName(event.target.value);
  };

  const handleSaveSubmit = () => {
    addCohort({
      id: nanoid(),
      name: newName,
      facets: [],
    });
  };

  const { data, isLoading, isSuccess, isError, error } = useGetCohortsQuery();

  let content;

  if (isLoading) {
    content = <div>Loading</div>;
  } else if (isSuccess) {
    const renderedCohorts = data.map((cohort) => (
      <CohortInput key={cohort.id} cohort={cohort} />
    ));

    content = <div>{renderedCohorts}</div>;
  } else if (isError || !data) {
    content = <div>Something went wrong</div>;
  }

  return (
    <div>
      <h1>Existing Cohort List</h1>
      {content}
      <h1>Add Item to List</h1>
      <input name="name" onChange={handleInputChange} />
      <button type="button" onClick={handleSaveSubmit}>
        Save
      </button>
    </div>
  );
};

export default CohortMultiTest;
