import { NextPage } from "next";
import { MultipleImageViewer } from "../../../components/MultipleImageViewer";
import { UserFlowVariedPages } from "../../../features/layout/UserFlowVariedPages";
import { headerElements } from "@/features/user-flow/workflow/navigation-utils";
import { useRouter } from "next/router";

const MultipleImageViewerPage: NextPage = () => {
  const { query } = useRouter();

  return (
    <UserFlowVariedPages
      {...{
        indexPath: "/user-flow/workbench/analysis_page?app=",
        headerElements,
      }}
    >
      <MultipleImageViewer case_id={query.caseId as string} />
    </UserFlowVariedPages>
  );
};

export default MultipleImageViewerPage;
