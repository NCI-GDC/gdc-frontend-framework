import {
  AnalysisWorkspace,
  AppRegistrationEntry,
} from "@gff/portal-components";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import SequenceReadsIcon from "public/apps/icons/SequenceReads.svg";
import ProjectsIcon from "public/layout/icons/crowd-of-users.svg";
import PageLayout from "@/components/PageLayout";

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
        width={64}
        height={64}
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
];

export const RECOMMENDED_APPS = ["Projects"];

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
