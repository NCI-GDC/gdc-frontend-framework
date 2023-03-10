import { createGdcAppWithOwnStore } from "@gff/core";
import { AppContext, AppStore, id } from "@/features/projectsCenter/appApi";
import { ProjectsCenter } from "@/features/projectsCenter/ProjectsCenter";

export default createGdcAppWithOwnStore({
  App: ProjectsCenter,
  id: id,
  name: "Projects Center",
  version: "v1.0.0",
  requiredEntityTypes: [],
  store: AppStore,
  context: AppContext,
});

export const ProjectsCenterAppId: string = id;
