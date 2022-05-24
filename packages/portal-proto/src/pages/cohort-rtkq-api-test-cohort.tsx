// This page tests integration of the cohort API middleware with the existing
// analysis page. That page was copied in whole and then modified to grab
// cohorts from the API middleware instead of a static const.

// For this page to work, the mock cohort api must be started. See
// data/cohort-api-server.js for additional details.

/* eslint-disable react/prop-types */

//import React, { useEffect, useState } from "react";
import React, { useState } from "react";
import { NextPage } from "next";
import Select from "react-select";
import {
  useGetCohortsQuery,
  useGetCohortsByContextIdQuery,
  useGetCohortByIdQuery,
  useAddCohortMutation,
  useUpdateCohortMutation,
  useDeleteCohortMutation,
  useGetContextsQuery,
  useGetContextByIdQuery,
  useAddContextMutation,
} from "@gff/core";
import { useCookies } from "react-cookie";

// for displaying cohort data
const CohortContent = ({ cohort }) => {
  return (
    <article>
      <p>Cohort ID: {cohort.id}</p>
      <p>Context ID: {cohort.context_id}</p>
      <p>Cohort Name: {cohort.name}</p>
      <p>
        Frozen:{" "}
        {cohort.frozen === true
          ? "Yes"
          : cohort.frozen === false
          ? "No"
          : "Missing"}
      </p>
    </article>
  );
};

const CohortApiTest: NextPage = () => {
  const button_class =
    "text-2xl border rounded bg-nci-gray-lighter opacity-75 hover:opacity-100";

  // redux state, queries and mutations
  const [cookie, setCookie] = useCookies(["context-id"]);
  const [testCohortName, setTestCohortName] = useState("");
  const [currentContextId, setCurrentContextId] = useState("");
  const [addCohort, { data: addCohortData, isSuccess: isAddCohortSuccess }] =
    useAddCohortMutation();
  const [updateCohort] = useUpdateCohortMutation();
  const [deleteCohort] = useDeleteCohortMutation();
  const [addContext] = useAddContextMutation();

  const onCohortNameChanged = (e) => setTestCohortName(e.target.value);

  // id for test and control cohorts, test id initially set to invalid value
  const testCohortId = isAddCohortSuccess
    ? addCohortData.id
    : "invalid-id-for-testing";
  const controlCohortId = "2f70de91-7c5a-41d2-9620-90670dfdaddb";

  // request body for creates
  const addBody = {
    context_id: currentContextId,
    name: testCohortName,
    facets: [],
    frozen: false,
  };

  // request body for updates
  const updateBody = {
    id: testCohortId,
    name: testCohortName,
  };

  // using rtkquery to get list of contexts
  const {
    data: contextsListData,
    isLoading: isContextsListLoading,
    isSuccess: isContextsListSuccess,
    isError: isContextsListError,
  } = useGetContextsQuery();

  // select list for context
  let contextSelectContent;
  if (isContextsListLoading) {
    contextSelectContent = <div>Context list loading</div>;
  } else if (isContextsListSuccess) {
    const menu_items = contextsListData.map((context) => {
      return { value: context.id, label: context.name };
    });

    contextSelectContent = (
      <Select
        inputId="context_select"
        components={{
          IndicatorSeparator: () => null,
        }}
        options={menu_items}
        isSearchable={false}
        isClearable={false}
        onChange={(menu_item) => {
          setCurrentContextId(menu_item.value);
          setCookie("context-id", menu_item.value);
        }}
        className="border-nci-gray-light w-80 p-0"
        aria-label="Select context"
      />
    );
  } else if (isContextsListError || !contextsListData) {
    contextSelectContent = <div>Error loading context list</div>;
  }

  // use rtk query to get details of the currently selected context
  const {
    data: contextData,
    isLoading: isContextLoading,
    isSuccess: isContextSuccess,
    isError: isContextError,
  } = useGetContextByIdQuery(currentContextId);

  // render specific context
  let contextContent;
  if (isContextLoading) {
    contextContent = <div>Loading context</div>;
  } else if (isContextSuccess) {
    contextContent = (
      <div>
        <article>
          <p>Context ID: {contextData.id}</p>
          <p>Context Name: {contextData.name}</p>
        </article>
      </div>
    );
  } else if (isContextError || !contextData) {
    contextContent = <div>Error occurred when getting context</div>;
  }

  // using rtkquery to get list of cohorts for a context
  const {
    data: cohortsListData,
    isLoading: isCohortsListLoading,
    isSuccess: isCohortsListSuccess,
    isError: isCohortsListError,
  } = useGetCohortsByContextIdQuery(currentContextId);

  // render list of cohorts for a context
  let cohortsListContent;
  if (isCohortsListLoading) {
    cohortsListContent = <div>Loading</div>;
  } else if (isCohortsListSuccess) {
    cohortsListContent = cohortsListData.map((cohort) => (
      <div key={cohort.id}>
        <CohortContent cohort={cohort} />
        <button
          className={button_class}
          onClick={() => deleteCohort(cohort.id)}
        >
          Delete
        </button>
        <br></br>
        <br></br>
      </div>
    ));
  } else if (isCohortsListError || !cohortsListData) {
    cohortsListContent = <div>Error loading list</div>;
  }

  // using rtkquery to get list of all cohorts regardless of context
  const {
    data: allCohortsListData,
    isLoading: isAllCohortsListLoading,
    isSuccess: isAllCohortsListSuccess,
    isError: isAllCohortsListError,
  } = useGetCohortsQuery();

  // render list of cohorts regardless of context
  let allCohortsListContent;
  if (isAllCohortsListLoading) {
    allCohortsListContent = <div>Loading</div>;
  } else if (isAllCohortsListSuccess) {
    allCohortsListContent = allCohortsListData.map((cohort) => (
      <div key={cohort.id}>
        <CohortContent cohort={cohort} />
        <br></br>
      </div>
    ));
  } else if (isAllCohortsListError || !allCohortsListData) {
    allCohortsListContent = <div>Error loading list</div>;
  }

  // use rtk query to get a specific target test cohort
  const {
    data: cohortData,
    isLoading: isCohortLoading,
    isSuccess: isCohortSuccess,
    isError: isCohortError,
    //error: cohortError
  } = useGetCohortByIdQuery(testCohortId);

  // render specific cohort
  let cohortContent;
  if (isCohortLoading) {
    cohortContent = <div>Loading</div>;
  } else if (isCohortSuccess) {
    cohortContent = (
      <div>
        <CohortContent cohort={cohortData} />
      </div>
    );
  } else if (isCohortError || !cohortData) {
    cohortContent = <div>Cohort with id {testCohortId} does not exist</div>;
  }

  // use rtk query to get a control cohort that won't be refreshed when the target cohort is modified
  const {
    data: controlCohortData,
    isLoading: isControlCohortLoading,
    isSuccess: isControlCohortSuccess,
    isError: isControlCohortError,
  } = useGetCohortByIdQuery(controlCohortId);

  // render specific cohort
  let controlCohortContent;
  if (isControlCohortLoading) {
    controlCohortContent = <div>Loading</div>;
  } else if (isControlCohortSuccess) {
    controlCohortContent = (
      <div>
        <CohortContent cohort={controlCohortData} />
      </div>
    );
  } else if (isControlCohortError || !controlCohortData) {
    controlCohortContent = <div>Error occurred when getting cohort</div>;
  }

  // render page
  return (
    <div>
      <div className="font-montserrat text-xl text-nci-gray-darker p-4 shadow-md transition-colors">
        <h1>Cookie Settings</h1>
        <br></br>
        Current Context-ID in Cookie: {cookie["context-id"]}
      </div>

      <div className="font-montserrat text-xl text-nci-gray-darker p-4 shadow-md transition-colors">
        <h1>Context Selector</h1>
        <br></br>
        {contextSelectContent}
        {contextContent}
        <button className={button_class} onClick={() => addContext()}>
          Generate New Context
        </button>
      </div>

      <div className="font-montserrat text-xl text-nci-gray-darker p-4 shadow-md transition-colors">
        <h1>Test Cohort</h1>
        <br></br>
        {cohortContent}
        <br></br>
        <label htmlFor="testCohortName">Cohort Name </label>
        <input
          id="testCohortName"
          name="testCohortName"
          type="text"
          value={testCohortName}
          onChange={onCohortNameChanged}
        />
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
            onClick={() => {
              deleteCohort(testCohortId);
              setTestCohortName("");
            }}
          >
            Delete
          </button>
        </div>
        <br></br>
      </div>

      <div className="font-montserrat text-xl text-nci-gray-darker p-4 shadow-md transition-colors">
        <h1>Context Specific Cohort List</h1>
        <p>List of cohorts associated with selected context</p>
        <br></br>
        {cohortsListContent}
      </div>

      <div className="font-montserrat text-xl text-nci-gray-darker p-4 shadow-md transition-colors">
        <h1>All Cohorts List</h1>
        <p>List of all cohorts</p>
        <br></br>
        {allCohortsListContent}
      </div>

      <div className="font-montserrat text-xl text-nci-gray-darker p-4 shadow-md transition-colors">
        <h1>Control Cohort</h1>
        <br></br>
        {controlCohortContent}
      </div>
    </div>
  );
};

export default CohortApiTest;
