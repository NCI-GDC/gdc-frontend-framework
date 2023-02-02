import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { UserFlowVariedPages } from "@/features/layout/UserFlowVariedPages";
import ContextBar from "@/features/cohortBuilder/ContextBar";
import { headerElements } from "@/features/user-flow/workflow/navigation-utils";
import AnalysisWorkspace from "@/features/user-flow/workflow/AnalysisWorkspace";
import { createContext, useState } from "react";
import { Modal } from "@mantine/core";
import { CaseSummary } from "@/features/cases/CaseSummary";
import { ProjectSummary } from "@/features/projects/ProjectSummary";
import { ContextualFileView } from "@/features/files/FileSummary";

export const SummaryModalContext = createContext(null);

const SingleAppsPage: NextPage = () => {
  const router = useRouter();
  const {
    query: { app },
  } = router;
  const [entityMetadata, setEntityMetadata] = useState<{
    entity: null | string;
    entity_id: string;
  }>({
    entity: null,
    entity_id: "",
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

      {entityMetadata.entity !== null && (
        <Modal
          opened
          onClose={() => setEntityMetadata({ entity: null, entity_id: "" })}
          size="xl"
          withinPortal={false}
          zIndex={400}
          classNames={
            {
              // root: "w-96",
            }
          }
        >
          {/* <ProjectSummary projectId={entityMetadata.entity_id} isModal={true} /> */}
          {/* <CaseSummary
            case_id={entityMetadata.entity_id}
            bio_id=""
            isModal={true}
          /> */}
          <ContextualFileView
            setCurrentFile={entityMetadata.entity_id}
            isModal={true}
          />
        </Modal>
      )}
    </UserFlowVariedPages>
  );
};

export default SingleAppsPage;
