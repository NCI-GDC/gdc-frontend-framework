import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { UserFlowVariedPages } from "@/features/layout/UserFlowVariedPages";
import ContextBar from "@/features/cohortBuilder/ContextBar";
import { headerElements } from "@/features/user-flow/workflow/navigation-utils";
import AnalysisWorkspace from "@/features/user-flow/workflow/AnalysisWorkspace";
import {
  selectCurrentCohortId,
  selectCurrentCohortName,
  useCoreSelector,
} from "@gff/core";
import { useCohortFacetFilters } from "@/features/cohortBuilder/CohortGroup";
import QueryExpressionSection from "@/features/cohortBuilder/QueryExpressionSection";

const SingleAppsPage: NextPage = () => {
  const router = useRouter();
  const {
    query: { app },
  } = router;

  const currentCohortId = useCoreSelector((state) =>
    selectCurrentCohortId(state),
  );
  const currentCohortName = useCoreSelector((state) =>
    selectCurrentCohortName(state),
  );
  const filters = useCohortFacetFilters();

  return (
    <UserFlowVariedPages
      {...{ indexPath: "/", headerElements }}
      ContextBar={<ContextBar />}
    >
      <Head>
        <title>GDC Analysis Center</title>
        <meta
          property="og:title"
          content="GDC Analysis Centere"
          key="gdc-analysis-center"
        />
      </Head>

      <QueryExpressionSection
        filters={filters}
        currentCohortName={currentCohortName}
        currentCohortId={currentCohortId}
      />
      <AnalysisWorkspace
        app={app && app.length > 0 ? app.toString() : undefined}
      />
    </UserFlowVariedPages>
  );
};

export default SingleAppsPage;
