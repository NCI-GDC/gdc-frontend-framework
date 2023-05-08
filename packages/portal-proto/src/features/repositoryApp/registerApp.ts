// creates and registers the App with the Analysis Tool Framework
import { createGdcAppWithOwnStore } from "@gff/core";
import { AppContext, AppStore, id } from "@/features/repositoryApp/appApi";
import { RepositoryApp } from "@/features/repositoryApp/RepositoryApp";
export default createGdcAppWithOwnStore({
  App: RepositoryApp,
  id: id,
  name: "Repository Tool",
  version: "v1.0.0",
  requiredEntityTypes: ["file"],
  store: AppStore,
  context: AppContext,
});

export const RepositoryAppId: string = id;
