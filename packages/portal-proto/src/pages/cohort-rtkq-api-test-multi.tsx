import { NextPage } from "next";
import {
  useGetCohortsQuery,
  useAddCohortMutation,
  useDeleteCohortMutation,
  useUpdateCohortMutation,
} from "@gff/core";
import React, { ChangeEvent, useState } from "react";
import { nanoid } from "nanoid";
import { SimpleLayout } from "../features/layout/Simple";

// let CohortContent = ({ cohort }) => {
//   return (
//     <article key={cohort.id}>
//       <h3>Cohort ID: {cohort.id}</h3>
//       <div>Cohort Name: {cohort.name}</div>
//     </article>
//   );
// };

const CohortMultiTest: NextPage = () => {
  const [newName, setNewName] = useState("");
  const [existingName, setExistingName] = useState("");

  const { data, isLoading, isSuccess, isError, error } = useGetCohortsQuery();
  const [addCohort] = useAddCohortMutation();
  const [updateCohort] = useUpdateCohortMutation();
  const [deleteCohort] = useDeleteCohortMutation();

  const handleAddSubmit = () => {
    addCohort({
      id: nanoid(),
      name: newName,
      facets: [],
    });
  };

  const handleNewNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewName(event.target.value);
  };

  const handleExistingNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setExistingName(event.target.value);
  };

  const addCohortSection = (
    <form onSubmit={handleAddSubmit}>
      <div>
        <label>New Cohort Name</label>
        <input name="newName" onChange={handleNewNameChange} />
      </div>
      <button className="submit">Add</button>
    </form>
  );

  // const addCohortSection =
  // <form onSubmit={handleAddSubmit}>
  //   <ul>
  //    <label>New Cohort Name</label>
  //    <input name="newName" onChange={handleInputChange} />
  //   </ul>
  //   <button className="submit">Add</button>
  // </form>

  let content;

  if (isLoading) {
    content = <div>Loading</div>;
  } else if (isSuccess) {
    content = data.map((cohort) => {
      return (
        <article key={cohort.id}>
          <div>
            <label>Cohort ID </label>
            <label>{cohort.id}</label>
          </div>
          <form>
            <div>
              <label>Cohort Name: {cohort.name}</label>
              <br></br>
              <label>New Name</label>
              <input
                name="currentName"
                onChange={handleExistingNameChange}
              ></input>
            </div>
            <div>
              <button
                onClick={() => updateCohort(cohort.id, { name: existingName })}
              >
                Update
              </button>
              <button onClick={() => deleteCohort(cohort.id)}>Delete</button>
              <br></br>
            </div>
          </form>
        </article>
      );
    });
  } else if (isError || !data) {
    content = <div>The following error occurred: {error}</div>;
  }

  return (
    <div className="border p-4 border-gray-400">
      <h1>Add Cohort to List</h1>
      {addCohortSection}
      <h1>Existing Cohort List</h1>
      {content}
    </div>
  );
};

export default CohortMultiTest;
