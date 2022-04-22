import { NextPage } from "next";
import { MultipleImageViewer } from "../../../components/MultipleImageViewer";
import { UserFlowVariedPages } from "../../../features/layout/UserFlowVariedPages";
import { headerElements } from "@/features/user-flow/workflow/navigation-utils";

const MultipleImageViewerPage: NextPage = () => {
  return (
    <UserFlowVariedPages
      {...{
        indexPath: "/user-flow/workbench/analysis_page?app=",
        headerElements,
      }}
    >
      <MultipleImageViewer />
    </UserFlowVariedPages>
  );
};

export default MultipleImageViewerPage;
