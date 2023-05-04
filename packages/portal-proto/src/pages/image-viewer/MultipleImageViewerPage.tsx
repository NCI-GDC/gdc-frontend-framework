import { NextPage } from "next";
import { MultipleImageViewer } from "@/components/ImageViewer/MultipleImageViewer";
import { UserFlowVariedPages } from "@/features/layout/UserFlowVariedPages";
import { headerElements } from "@/features/user-flow/workflow/navigation-utils";
import { useRouter } from "next/router";

const MultipleImageViewerPage: NextPage = () => {
  const { query } = useRouter();
  return (
    <UserFlowVariedPages
      {...{
        indexPath: "/analysis_page?app=",
        headerElements,
      }}
    >
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
