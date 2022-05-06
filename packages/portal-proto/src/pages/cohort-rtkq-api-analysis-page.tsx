// for this page to work, json-server must be started. To do this from the
// project root run: node data/server.js

import { NextPage } from "next";
import { useRouter } from "next/router";
import { UserFlowVariedPages } from "../features/layout/UserFlowVariedPages";
import ContextBar from "../features/cohortBuilder/ContextBar";
import { headerElements } from "@/features/user-flow/workflow/navigation-utils";
import AnalysisWorkspace from "@/features/user-flow/workflow/AnalysisWorkspace";
import { COHORTS } from "@/features/user-flow/workflow/registeredApps";
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
    cohort_data = data;
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
