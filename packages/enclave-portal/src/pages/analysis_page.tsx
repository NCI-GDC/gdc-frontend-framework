import { AnalysisGrid } from "@gff/portal-components";
import { NextPage } from "next";
import Head from "next/head";
import SequenceReadsIcon from "public/apps/icons/SequenceReads.svg";
import ProjectsIcon from "public/layout/icons/crowd-of-users.svg";
import PageLayout from "@/components/PageLayout";

export const REGISTERED_APPS = [
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
    href: {
      pathname: "/analysis_page",
      query: { app: "Projects" },
    },
    tags: [],
    hasDemo: false,
    id: "Projects",
    countsField: "caseCount",
    description:
      "View the Projects available within the GDC and select them for further exploration and analysis.",
  },
  {
    name: "Sequence Reads",
    icon: <SequenceReadsIcon aria-hidden="true" />,
    tags: ["sequenceAnalysis"],
    hasDemo: false,
    countsField: "sequenceReadCaseCount",
    description:
      "Visualize sequencing reads for a given gene, position, SNP, or variant.",
    id: "SequenceReadApp",
    noDataTooltip:
      "Current cohort does not have available BAMs for visualization.",
    optimizeRules: ["data format = BAM"],
  },
];

export const RECOMMENDED_APPS = ["Projects"];

const AnalysisCenter: NextPage = () => {
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
      <AnalysisGrid
        registeredApps={REGISTERED_APPS}
        recommendedApps={RECOMMENDED_APPS}
        CountHookRegistry={{
          getInstance: () => ({ getHook: () => () => ({ isSuccess: true }) }),
        }}
      />
    </PageLayout>
  );
};

export default AnalysisCenter;
