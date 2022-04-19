import { NextPage } from "next";
import { MultipleImageViewer } from "@/components/MultipleImageViewer";
import { UserFlowVariedPages } from "@/features/layout/UserFlowVariedPages";
import { headerElements } from "./navigation-utils";

const ImageViewer: NextPage = () => {
  return (
    <UserFlowVariedPages
      {...{ indexPath: "/user-flow/workbench/analysis_page?app=", headerElements }}
    >
      <MultipleImageViewer />
    </UserFlowVariedPages>
  );
};

export default ImageViewer;
