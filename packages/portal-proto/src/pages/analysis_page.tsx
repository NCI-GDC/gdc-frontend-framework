import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { UserFlowVariedPages } from "@/features/layout/UserFlowVariedPages";
import ContextBar from "@/features/cohortBuilder/ContextBar";
import { headerElements } from "@/features/user-flow/workflow/navigation-utils";
import AnalysisWorkspace from "@/features/user-flow/workflow/AnalysisWorkspace";
import { createContext, Dispatch, SetStateAction, useState } from "react";
import { SummaryModal } from "@/components/Modals/SummaryModal/SummaryModal";

export type entityType = null | "project" | "case" | "file";
export interface entityMetadataType {
  entity_type: entityType;
  entity_id: string;
  entity_name: string;
}
export const SummaryModalContext = createContext<{
  setEntityMetadata: Dispatch<SetStateAction<entityMetadataType>>;
}>(null);

const SingleAppsPage: NextPage = () => {
  const router = useRouter();
  const {
    query: { app },
  } = router;
  const [entityMetadata, setEntityMetadata] = useState<entityMetadataType>({
    entity_type: null,
    entity_id: null,
    entity_name: null,
  });

  return (
    <UserFlowVariedPages {...{ indexPath: "/", headerElements }}>
      <SummaryModalContext.Provider
        value={{
          setEntityMetadata,
        }}
      >
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
      </SummaryModalContext.Provider>

      {entityMetadata.entity_type !== null && (
        <SummaryModal
          opened
          onClose={() =>
            setEntityMetadata({
              entity_type: null,
              entity_id: null,
              entity_name: null,
            })
          }
          entityMetadata={entityMetadata}
        />
      )}
    </UserFlowVariedPages>
  );
};

export default SingleAppsPage;
