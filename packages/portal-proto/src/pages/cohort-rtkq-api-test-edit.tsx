// import React from 'react'
import { NextPage } from "next";
import { useEditCohortMutation, useGetCohortByIdQuery } from "@gff/core";

let CohortContent = ({ cohort }) => {
  return (
    <article key={cohort.id}>
      <h3>Cohort ID: {cohort.id}</h3>
      <div>Cohort Name: {cohort.name}</div>
    </article>
  );
};

const EditCohortTest: NextPage = () => {
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
  //console.log(useGetCohortByIdQuery("fa3ec4f4-5530-4e2e-9773-12ba16c95ff2"))

  //const [updateCohort] = useEditCohortMutation();

  // const handleSubmit = () => {
  //   updateCohort({
  //     id: "2f70de91-7c5a-41d2-9620-90670dfdaddb",
  //     data: {
  //       name: "Mike's Cohort Name Changed",
  //       facets: []
  //     }
  //   })
  // }
  // const { data, isLoading, isSuccess, isError, error } = useEditCohortMutation({
  //   id: "2f70de91-7c5a-41d2-9620-90670dfdaddb",
  //   data: {
  //     name: "Mike's Cohort Name Changed",
  //     facets: []
  //   }
  // })

  // let content;

  // if (isLoading) {
  //   content = <div>Loading</div>;
  // } else if (isSuccess) {
  //   content = <div><CohortContent key={data.id} cohort={data} /></div>
  // } else if (isError || !data) {
  //   content = <div>Something went wrong</div>;
  // }

  // return (
  //   <div>
  //     <h1>Testing Cohort - Edit Cohort</h1>
  //     {content}
  //   </div>
  // );
};

export default EditCohortTest;

// const SingleCohortTest: NextPage = () => {
//   //const { data, isLoading, isSuccess, isError, error } = useGetCohortByIdQuery("fa3ec4f4-5530-4e2e-9773-12ba16c95ff2",);
//   const [cohortId, setCohortId] = useState('');
//   const [getCohort] = useGetCohortByIdQuery();

//   const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
//     setCohortId(event.target.value);
//   };

//   let content;

//   const handleSubmit = () => {
//     const { data, isLoading, isSuccess, isError, error } = getCohort(cohortId)

//     if (isLoading) {
//       content = <div>Loading</div>;
//     } else if (isSuccess) {
//       content = <div><CohortContent key={data.id} cohort={data} /></div>
//     } else if (isError || !data) {
//       content = <div>Something went wrong</div>;
//     }

//   };

//   return (
//     <div>
//       <input name="id" onChange={handleInputChange} />
//       <button type="button" onClick={handleSubmit}>
//         Get
//       </button>
//       <div>
//         <h1>Cohort Retrieved</h1>
//         {content}
//       </div>
//     </div>

//   );

// };
