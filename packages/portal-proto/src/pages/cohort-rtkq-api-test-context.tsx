// This page tests integration of the cohort API middleware with the existing
// analysis page. That page was copied in whole and then modified to grab
// cohorts from the API middleware instead of a static const.

// For this page to work, the mock cohort api must be started. See
// data/cohort-api-server.js for additional details.

import React, { useState } from "react";
import Select from "react-select";
import { NextPage } from "next";
import {
  useGetContextsQuery,
  useGetContextByIdQuery,
  useAddContextMutation,
} from "@gff/core";
import { useCookies } from "react-cookie";

const ContextApiTest: NextPage = () => {
  const button_class =
    "text-2xl border rounded bg-nci-gray-lighter opacity-75 hover:opacity-100";

  // for testing authorization via cookie
  const [cookie, setCookie] = useCookies(["context-id"]);
  const [currentContextId, setCurrentContextId] = useState();

  // mutations
  const [addContext] = useAddContextMutation();

  // un-comment set default cookie on page load
  // useEffect(() => {
  //   setCookie("context-id", "FAKE-UUID-FOR-TESTING");
  // }, []);

  // using rtkquery to get list of contexts
  const {
    data: contextsListData,
    isLoading: isContextsListLoading,
    isSuccess: isContextsListSuccess,
    isError: isContextsListError,
  } = useGetContextsQuery();

  // render list of context
  let contextsListContent;
  if (isContextsListLoading) {
    contextsListContent = <div>Context list loading</div>;
  } else if (isContextsListSuccess) {
    contextsListContent = contextsListData.map((context) => (
      <article key={context.id}>
        <p>context_id: {context.id}</p>
        <p>context_name: {context.name}</p>
        <br></br>
      </article>
    ));
  } else if (isContextsListError || !contextsListData) {
    contextsListContent = <div>Error loading context list</div>;
  }

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
        //value={currentContextName}
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

  // render specific cohort
  let contextContent;
  if (isContextLoading) {
    contextContent = <div>Loading context</div>;
  } else if (isContextSuccess) {
    contextContent = (
      <div>
        <article key={contextData.id}>
          <p>Cohort ID: {contextData.id}</p>
          <p>Cohort Name: {contextData.name}</p>
        </article>
      </div>
    );
  } else if (isContextError || !contextData) {
    contextContent = <div>Error occurred when getting context</div>;
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
      </div>

      <div className="font-montserrat text-xl text-nci-gray-darker p-4 shadow-md transition-colors">
        <h1>Current Context</h1>
        <br></br>
        {contextContent}
      </div>

      <div className="font-montserrat text-xl text-nci-gray-darker p-4 shadow-md transition-colors">
        <h1>Generate New Context</h1>
        <br></br>
        <button className={button_class} onClick={() => addContext()}>
          Generate
        </button>
      </div>

      <div className="font-montserrat text-xl text-nci-gray-darker p-4 shadow-md transition-colors">
        <h1>Contexts List</h1>
        <br></br>
        {contextsListContent}
      </div>
    </div>
  );
};

export default ContextApiTest;
