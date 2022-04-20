import { NextPage } from "next";
import { UserFlowVariedPages } from "../../../features/layout/UserFlowVariedPages";
import { ContextualProjectView } from "../../../features/projects/ProjectView";
import { headerElements } from "./navigation-utils";

const ProjectPage: NextPage = () => {
  return (
    <UserFlowVariedPages
      {...{ indexPath: "/user-flow/many-pages", headerElements }}
    >
      <ContextualProjectView setCurrentProject={"TCGA-BRCA"} />
    </UserFlowVariedPages>
  );
};

export default ProjectPage;
