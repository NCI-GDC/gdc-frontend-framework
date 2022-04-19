import { NextPage } from "next";
import { MultipleImageViewer } from "@/components/MultipleImageViewer";
import { UserFlowVariedPages } from "@/features/layout/UserFlowVariedPages";

import { headerElements } from "../many-pages/navigation-utils";

const ImageViewer: NextPage = () => {
  return (
    <UserFlowVariedPages
      {...{ indexPath: "/user-flow/workbench/", headerElements }}
    >
      <MultipleImageViewer />
    </UserFlowVariedPages>
  );
};

export default ImageViewer;
