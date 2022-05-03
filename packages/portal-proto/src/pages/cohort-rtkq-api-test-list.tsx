// import React from 'react'
import Select from "react-select";
import { useState } from "react";
import { NextPage } from "next";
import { useGetCohortByIdQuery } from "@gff/core";
import { useGetCohortsQuery } from "@gff/core";
import ContextBar from "../features/cohortBuilder/ContextBar";
//import { CoreProvider, useGetCohortByIdQuery } from "@gff/core";

//const CohortTest: NextPage = () => {
// const CohortTest = () => {

// let CohortExcerpt = ({ cohort }) => {
//   return (
//     <div key={cohort.id}>
//       <div>{cohort.id}</div>
//       <div>{cohort.name}</div>
//     </div>
//   )
// }

let CohortContent = ({ cohort }) => {
  return (
    <article key={cohort.id}>
      <h3>Cohort ID: {cohort.id}</h3>
      <div>Cohort Name: {cohort.name}</div>
    </article>
  );
};

const CohortTest: NextPage = () => {
  //const { data, isLoading, isSuccess, isError, error } = useGetCohortByIdQuery("fa3ec4f4-5530-4e2e-9773-12ba16c95ff2",);
  const { data, isLoading, isSuccess, isError, error } = useGetCohortsQuery();

  let content;

  //const [currentCohort, setCurrentCohort] = useState(data["fa3ec4f4-5530-4e2e-9773-12ba16c95ff2"]);

  if (isLoading) {
    content = <div>Loading</div>;
  } else if (isSuccess) {
    // content = <ContextBar cohorts={data} />
    // content =
    //   <Select
    //     inputId="cohort-select-test"
    //     components={{
    //       IndicatorSeparator: () => null,
    //     }}
    //     options={data}
    //     isSearchable={false}
    //     isClearable={false}
    //     value={currentCohort}
    //     onChange={(x) => {
    //       setCurrentCohort(x);
    //       //onSelectionChanged(x.value);
    //     }}
    //     className="border-nci-gray-light w-80 p-0"
    //     aria-label="Select cohort"
    //   />
    const renderedCohorts = data.map((cohort) => (
      <CohortContent key={cohort.id} cohort={cohort} />
    ));

    content = <div>{renderedCohorts}</div>;
    //content = <CohortExcerpt key={data.id} cohort={data} />
    // content =
    //   <div>
    //     <p>{data.id}</p>
    //     <p>{data.name}</p>
    //     <p>{data.facets}</p>
    //   </div>
    //content = <ContextBar cohorts={renderedCohorts} />
  } else if (isError || !data) {
    content = <div>Something went wrong</div>;
  }

  return (
    <div>
      <h1>Testing Cohort List</h1>
      {content}
    </div>
  );
};

export default CohortTest;
