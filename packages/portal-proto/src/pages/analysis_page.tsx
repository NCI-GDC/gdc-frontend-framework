import { useState } from "react";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  selectCurrentCohortId,
  selectCurrentCohortName,
  useCoreSelector,
} from "@gff/core";
import { LoadingOverlay } from "@mantine/core";
import { UserFlowVariedPages } from "@/features/layout/UserFlowVariedPages";
import ContextBar from "@/features/cohortBuilder/ContextBar";
import { headerElements } from "@/features/user-flow/workflow/navigation-utils";
import AnalysisWorkspace from "@/features/user-flow/workflow/AnalysisWorkspace";
import QueryExpressionSection from "@/features/cohortBuilder/QueryExpressionSection";
import { useCohortFacetFilters } from "@/features/cohortBuilder/utils";
import { useSetupInitialCohorts } from "@/features/cohortBuilder/hooks";

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
  const initialCohortsFetched = useSetupInitialCohorts();
  const filters = useCohortFacetFilters();
  const [isSticky, setIsSticky] = useState(true);

  return (
    <UserFlowVariedPages
      {...{ indexPath: "/", headerElements }}
      ContextBar={
        <ContextBar
          isSticky={isSticky}
          handleIsSticky={(isStickyParam: boolean) =>
            setIsSticky(isStickyParam)
          }
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
      <LoadingOverlay visible={!initialCohortsFetched} />
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
