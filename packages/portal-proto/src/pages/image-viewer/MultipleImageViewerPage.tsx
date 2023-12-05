import { NextPage } from "next";
import { MultipleImageViewer } from "@/components/ImageViewer/MultipleImageViewer";
import { UserFlowVariedPages } from "@/features/layout/UserFlowVariedPages";
import { headerElements } from "@/features/user-flow/workflow/navigation-utils";
import { useRouter } from "next/router";
import Head from "next/head";

const MultipleImageViewerPage: NextPage = () => {
  const { query } = useRouter();
  return (
    <UserFlowVariedPages
      {...{
        indexPath: "/analysis_page?app=",
        headerElements,
      }}
    >
      <Head>
        <title>Slide Image Viewer</title>
        <meta
          property="og:title"
          content="GDC Slide Image Viewer"
          key="gdc-slide-Image-viewer"
        />
      </Head>
      <MultipleImageViewer
        case_id={query.caseId as string}
        selectedId={query.selectedId as string}
        isCohortCentric={(query.isCohortCentric as string) === "true"}
        additionalFilters={query.additionalFilters as string}
      />
    </UserFlowVariedPages>
  );
};

export default MultipleImageViewerPage;
