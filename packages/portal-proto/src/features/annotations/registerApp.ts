import { createGdcAppWithOwnStore } from "@gff/core";
import { AppContext, AppStore, id } from "./appApi";
import AnnotationsBrowser from "./AnnotationBrowser";

export default createGdcAppWithOwnStore({
  App: AnnotationsBrowser,
  id: id,
  name: "Annotations Browser",
  version: "v1.0.0",
  requiredEntityTypes: [],
  store: AppStore,
  context: AppContext,
});

export const AnnotationBrowserAppId: string = id;
