import React, { useState } from "react";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  AnalysisWorkspace,
  AppRegistrationEntry,
  QueryExpressionSection,
} from "@gff/portal-components";
import SequenceReadsIcon from "public/apps/icons/SequenceReads.svg";
import ProjectsIcon from "public/layout/icons/crowd-of-users.svg";
import CohortBuilderIcon from "public/apps/icons/CohortBuilder.svg";
import PageLayout from "@/components/PageLayout";
import CohortManager from "@/features/cohort/CohortManager";
import { EXAMPLE_COHORTS } from "@/features/cohort/cohorts";

const ActiveAnalysisToolNoSSR = dynamic(
  () => import("@/features/analysis/ActiveAnalysisTool"),
  {
    ssr: false,
  },
);

export const REGISTERED_APPS: AppRegistrationEntry[] = [
  {
    name: "Projects",
    icon: (
      <ProjectsIcon
        width={48}
        height={48}
        viewBox="0 -20 128 128"
        aria-hidden="true"
      />
    ),
    tags: [],
    hasDemo: false,
    id: "Projects",
    countsField: "caseCount",
    description:
      "View the Projects available within the Enclave and select them for further exploration and analysis.",
  },
  {
    name: "My test App",
    icon: <SequenceReadsIcon aria-hidden="true" />,
    hasDemo: true,
    description: "A test app for testing things",
    id: "TestApp",
    countsField: "caseCount",
    tags: [],
  },
  {
    name: "Cohort Builder",
    icon: (
      <CohortBuilderIcon
        width={64}
        height={64}
        viewBox="0 0 60 60"
        aria-hidden="true"
      />
    ),
    tags: ["generalUtility"],
    hasDemo: false,
    id: "CohortBuilder",
    countsField: "caseCount",
    description:
      "Build and define your custom cohorts using a variety of clinical and biospecimen features.",
  },
];

export const RECOMMENDED_APPS = ["CohortBuilder"];

const AnalysisCenter: NextPage = () => {
  const router = useRouter();
  const {
    query: { app, demoMode },
  } = router;

  const isDemoMode = demoMode === "true";
  const skipSelectionScreen =
    router?.query?.skipSelectionScreen === "true" || isDemoMode;

  const handleAppSelected = (app?: string, demoMode?: boolean) => {
    router.push({ query: { app, ...(demoMode && { demoMode }) } });
  };

  const [cohorts, setCohorts] = useState(EXAMPLE_COHORTS);
  const [currentCohort, setCurrentCohort] = useState(EXAMPLE_COHORTS[0].id);

  return (
    <PageLayout>
      <Head>
        <title>Analysis Center</title>
        <meta
          property="og:title"
          content="Analysis Center"
          key="analysis-center"
        />
      </Head>
      <CohortManager
        cohorts={cohorts}
        setCohorts={setCohorts}
        currentCohort={currentCohort}
        setCurrentCohort={setCurrentCohort}
      />
      <QueryExpressionSection
        filters={cohorts.find((c) => c.id === currentCohort)?.filters}
        hooks={{
          useSelectCurrentCohort: () =>
            cohorts.find((c) => c.id === currentCohort) || cohorts[0],
          useClearCohortFilters: () => () => {},
          useRemoveCohortFilter: () => () => {},
          useUpdateCohortFilter: () => () => {},
          useFieldNameToTitle: () => (field) =>
            field
              .split(".")
              .slice(-1)
              .map((s) => s.split("_"))
              .flat()
              .join(" "),
          useFormatValue: () => (value) => Promise.resolve(value),
        }}
      />
      <AnalysisWorkspace
        registeredApps={REGISTERED_APPS}
        recommendedApps={RECOMMENDED_APPS}
        CountHookRegistry={{
          getInstance: () => ({
            getHook: () => () => ({ isSuccess: true, data: 100 }),
          }),
        }}
        app={app && app.length > 0 ? app.toString() : undefined}
        isDemoMode={isDemoMode}
        skipSelectionScreen={skipSelectionScreen}
        handleAppSelected={handleAppSelected}
        ActiveAnalysisTool={ActiveAnalysisToolNoSSR}
      />
    </PageLayout>
  );
};

export default AnalysisCenter;
