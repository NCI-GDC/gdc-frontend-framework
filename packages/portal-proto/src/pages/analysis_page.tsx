import { useState } from "react";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { datadogRum } from "@datadog/browser-rum";
import { LoadingOverlay } from "@mantine/core";
import { UserFlowVariedPages } from "@/features/layout/UserFlowVariedPages";
import ContextBar from "@/features/cohortBuilder/ContextBar";
import { headerElements } from "@/features/user-flow/workflow/navigation-utils";
import AnalysisWorkspace from "@/features/user-flow/workflow/AnalysisWorkspace";
import QueryExpressionSection from "@/features/cohortBuilder/QueryExpressionSection";
import { useSetupInitialCohorts } from "@/features/cohortBuilder/hooks";
import { REGISTERED_APPS } from "@/features/user-flow/workflow/registeredApps";

const SingleAppsPage: NextPage = () => {
  const router = useRouter();
  const {
    query: { app },
  } = router;

  const initialCohortsFetched = useSetupInitialCohorts();
  const [isSticky, setIsSticky] = useState(true);
  const appInfo = REGISTERED_APPS.find((a) => a.id === app);

  datadogRum.startView({
    name: appInfo?.name ?? "Analysis Center",
  });

  return (
    <UserFlowVariedPages
      {...{ indexPath: "/", headerElements }}
      ContextBar={
        <ContextBar
          isSticky={isSticky}
          handleIsSticky={(isStickyParam: boolean) =>
            setIsSticky(isStickyParam)
          }
          isFetchingCohorts={!initialCohortsFetched}
        />
      }
      isContextBarSticky={isSticky}
    >
      <Head>
        <title>GDC Analysis Center</title>
        <meta
          property="og:title"
          content="GDC Analysis Center"
          key="gdc-analysis-center"
        />
      </Head>
      <LoadingOverlay
        data-testid="loading-spinner"
        visible={!initialCohortsFetched}
      />
      <QueryExpressionSection />
      <AnalysisWorkspace
        app={app && app.length > 0 ? app.toString() : undefined}
      />
    </UserFlowVariedPages>
  );
};

export default SingleAppsPage;
