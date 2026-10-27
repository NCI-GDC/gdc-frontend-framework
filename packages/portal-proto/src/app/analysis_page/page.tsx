"use client";
import { useSearchParams } from "next/navigation";
import { datadogRum } from "@datadog/browser-rum";
import { LoadingOverlay } from "@mantine/core";
import AnalysisWorkspace from "@/features/user-flow/workflow/AnalysisWorkspace";
import QueryExpressionSection from "@/features/cohortBuilder/QueryExpressionSection";
import { useSetupInitialCohorts } from "@/features/cohortBuilder/hooks";
import { REGISTERED_APPS } from "@/features/user-flow/workflow/registeredApps";

const AnalysisPage = () => {
  const searchParams = useSearchParams();
  const app = searchParams.get("app");
  const initialCohortsFetched = useSetupInitialCohorts();
  const appInfo = REGISTERED_APPS.find((a) => a.id === app);

  datadogRum.startView({
    name: appInfo?.name ?? "Analysis Center",
  });

  return (
    <>
      <LoadingOverlay
        data-testid="loading-spinner"
        visible={!initialCohortsFetched}
      />
      <QueryExpressionSection />
      <AnalysisWorkspace
        app={app && app.length > 0 ? app.toString() : undefined}
      />
    </>
  );
};

export default AnalysisPage;
