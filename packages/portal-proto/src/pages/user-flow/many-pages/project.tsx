import { NextPage } from "next";
import {
  UserFlowVariedPages,
} from "../../../features/layout/UserFlowVariedPages";
import { ContextualProjectView } from "../../../features/projects/ProjectView";
import { headerElements } from "./navigation-utils";

const ProjectPage: NextPage = () => {

  return (
    <UserFlowVariedPages
      {...{ indexPath: "/user-flow/many-pages", headerElements }}
    >
      <div className="flex flex-col p-4 gap-y-4">
        <ContextualProjectView
          setCurrentProject={'TCGA-BRCA'}
        />
      </div>
    </UserFlowVariedPages>
  );
};

export default ProjectPage;
