// import React from 'react'
import { NextPage } from "next";
import { useGetCohortByIdQuery } from "@gff/core";
//import { CoreProvider, useGetCohortByIdQuery } from "@gff/core";

//const CohortTest: NextPage = () => {
// const CohortTest = () => {
const CohortTest: NextPage = () => {
  console.log("Preparing to make call");

  //console.log(useGetCohortsQuery())
  // useEffect(() => {
  //   console.log(useGetCohortByIdQuery('f05d91d2-2f06-4b61-bbfe-5098e9464011'))
  // }, []);
  console.log(useGetCohortByIdQuery("f05d91d2-2f06-4b61-bbfe-5098e9464011"));
  //const { data, isLoading, isSuccess, isError } = useGetCohortByIdQuery('f05d91d2-2f06-4b61-bbfe-5098e9464011')
  //const { data, error, isLoading } = useGetCohortsQuery()
  //const {data, isFetching, refetch } = useGetCohortByIdQuery('f05d91d2-2f06-4b61-bbfe-5098e9464011')
  // let content

  // if (isLoading) {
  //   content = <div>Loading</div>
  // }
  // else if (isSuccess) {
  //   content = <div>{data}</div>
  // }
  // else if (isError || !data) {
  //   content = <div>Something went wrong</div>
  // }

  return (
    <div>
      <p>Testing</p>
    </div>
  );
  // return (
  //   <CoreProvider>
  //     <div><p>Testing</p></div>
  //   </CoreProvider>
  // )

  // return (
  //   <div>
  //     <p>{data}</p>
  //   </div>
  // );
};

export default CohortTest;
