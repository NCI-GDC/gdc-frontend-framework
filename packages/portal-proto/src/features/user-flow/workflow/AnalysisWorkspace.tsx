import React from "react";
import { useRouter } from "next/router";
import {
  REGISTERED_APPS,
  RECOMMENDED_APPS,
} from "@/features/user-flow/workflow/registeredApps";
import dynamic from "next/dynamic";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";

import { CountHookRegistry } from "@gff/core";
import { AnalysisWorkspace as CommonWorkspace } from "@gff/portal-components";

const ActiveAnalysisToolNoSSR = dynamic(
  () => import("@/features/user-flow/workflow/ActiveAnalysisTool"),
  {
    ssr: false,
  },
);

interface AnalysisWorkspaceProps {
  readonly app: string | undefined;
}

const AnalysisWorkspace: React.FC<AnalysisWorkspaceProps> = ({
  app,
}: AnalysisWorkspaceProps) => {
  const router = useRouter();
  const isDemoMode = useIsDemoApp();

  const skipSelectionScreen =
    router?.query?.skipSelectionScreen === "true" || isDemoMode;

  const handleAppSelected = (app: string, demoMode?: boolean) => {
    router.push({ query: { app, ...(demoMode && { demoMode }) } });
  };

  return (
    <CommonWorkspace
      app={app}
      registeredApps={REGISTERED_APPS}
      recommendedApps={RECOMMENDED_APPS}
      isDemoMode={isDemoMode}
      ActiveAnalysisTool={ActiveAnalysisToolNoSSR}
      CountHookRegistry={CountHookRegistry}
      skipSelectionScreen={skipSelectionScreen}
      handleAppSelected={handleAppSelected}
    />
  );
};

export default AnalysisWorkspace;
