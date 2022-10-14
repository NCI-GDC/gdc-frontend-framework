// creates and registers the App with the Analysis Tool Framework
import { createGdcAppWithOwnStore } from "@gff/core";
import { AppContext, AppStore, id } from "@/features/projectCenter/appApi";
import ProjectCenter from "@/features/projectCenter/ProjectCenter";

export default createGdcAppWithOwnStore({
  App: ProjectCenter,
  id: id,
  name: "Project Center",
  version: "v1.0.0",
  requiredEntityTypes: [],
  store: AppStore,
  context: AppContext,
});

export const ProjectCenterId: string = id;
