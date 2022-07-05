// This page tests the basic CRUD functionality of the cohort API mock
// middleware.

// For this page to work, the mock cohort api must be started. See
// data/cohort-api-server.js for additional details.

import { NextPage } from "next";
import { useRouter } from "next/router";
import { UserFlowVariedPages } from "../features/layout/UserFlowVariedPages";
import ContextBar from "../features/cohortBuilder/ContextBar";
import { headerElements } from "@/features/user-flow/workflow/navigation-utils";
import AnalysisWorkspace from "@/features/user-flow/workflow/AnalysisWorkspace";
import { useGetCohortsQuery } from "@gff/core";

const SingleAppsPage: NextPage = () => {
  const router = useRouter();
  const {
    query: { app },
  } = router;

  const { data, isLoading, isSuccess } = useGetCohortsQuery();
  let cohort_data;
  if (isLoading) {
    cohort_data = [];
  } else if (isSuccess) {
    // this map transformation is only necessary until ContextBar is updated
    // to use the property name of filters instead of facets
    cohort_data = data.map((elm) => ({
      id: elm.id,
      context_id: elm.context_id,
      name: elm.name,
      facets: elm.filters,
      frozen: elm.frozen,
    }));

    // TODO: remove map transformation and use the following instead
    //cohort_data = data;
  }

  return (
    <UserFlowVariedPages
      {...{ indexPath: "/user-flow/workbench", headerElements }}
    >
      <ContextBar cohorts={cohort_data} />
      <AnalysisWorkspace
        app={app && app.length > 0 ? app.toString() : undefined}
      />
    </UserFlowVariedPages>
  );
};

export default SingleAppsPage;
