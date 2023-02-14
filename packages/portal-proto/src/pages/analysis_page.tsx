import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { UserFlowVariedPages } from "@/features/layout/UserFlowVariedPages";
import ContextBar from "@/features/cohortBuilder/ContextBar";
import { headerElements } from "@/features/user-flow/workflow/navigation-utils";
import AnalysisWorkspace from "@/features/user-flow/workflow/AnalysisWorkspace";

const SingleAppsPage: NextPage = () => {
  const router = useRouter();
  const {
    query: { app },
  } = router;

  return (
    <UserFlowVariedPages {...{ indexPath: "/", headerElements }}>
      <Head>
        <title>GDC Analysis Center</title>
        <meta
          property="og:title"
          content="GDC Analysis Centere"
          key="gdc-analysis-center"
        />
      </Head>
      <ContextBar />
      <AnalysisWorkspace
        app={app && app.length > 0 ? app.toString() : undefined}
      />
    </UserFlowVariedPages>
  );
};

export default SingleAppsPage;
