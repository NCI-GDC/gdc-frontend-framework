// import React from 'react'
import React, { ChangeEvent, useState } from "react";
import { NextPage } from "next";
import { useAddCohortMutation, useGetCohortByIdQuery } from "@gff/core";
import { nanoid } from "nanoid";

// let CohortContent = ({ cohort }) => {
//   return (
//     <article key={cohort.id}>
//       <h3>Cohort ID: {cohort.id}</h3>
//       <div>Cohort Name: {cohort.name}</div>
//     </article>
//   )
// }

const AddCohortTest: NextPage = () => {
  //console.log(useGetCohortByIdQuery("fa3ec4f4-5530-4e2e-9773-12ba16c95ff2"))
  const [newName, setNewName] = useState("");
  const [updateCohort] = useAddCohortMutation();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewName(event.target.value);
  };

  const handleSubmit = () => {
    updateCohort({
      id: nanoid(),
      name: newName,
      facets: [],
    });
  };

  return (
    <div>
      <input name="name" onChange={handleInputChange} />
      <button type="button" onClick={handleSubmit}>
        Save
      </button>
    </div>
  );
};

export default AddCohortTest;
