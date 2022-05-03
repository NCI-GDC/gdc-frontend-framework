import React, { ChangeEvent, useState } from "react";
import { NextPage } from "next";
import { useGetCohortByIdQuery } from "@gff/core";

let CohortContent = ({ cohort }) => {
  return (
    <article key={cohort.id}>
      <h3>Cohort ID: {cohort.id}</h3>
      <div>Cohort Name: {cohort.name}</div>
    </article>
  );
};

const SingleCohortTest: NextPage = () => {
  const { data, isLoading, isSuccess, isError, error } = useGetCohortByIdQuery(
    "fa3ec4f4-5530-4e2e-9773-12ba16c95ff2",
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
  } else if (isError || !data) {
    content = <div>Something went wrong</div>;
  }

  return (
    <div>
      <h1>Testing Cohort - Single Cohort</h1>
      {content}
    </div>
  );
};

export default SingleCohortTest;
