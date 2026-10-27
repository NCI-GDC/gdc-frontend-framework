"use client";
import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
  const path = usePathname();
  const query = useSearchParams();
  const isDemoMode = useIsDemoApp();

  const skipSelectionScreen =
    query.get("skipSelectionScreen") === "true" || isDemoMode;

  const handleAppSelected = (app: string, demoMode?: boolean) => {
    const newQuery = new URLSearchParams(query.toString());
    if (demoMode) {
      newQuery.set("demoMode", "true");
    }

    newQuery.set("app", app);

    router.push(`${path}?${newQuery.toString()}`);
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
