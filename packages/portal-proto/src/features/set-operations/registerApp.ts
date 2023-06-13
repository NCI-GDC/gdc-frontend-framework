import { createGdcAppWithOwnStore } from "@gff/core";
import { AppContext, AppStore, id } from "@/features/set-operations/appApi";
import SetOperationsApp from "@/features/set-operations/SetOperationsApp";

export default createGdcAppWithOwnStore({
  App: SetOperationsApp,
  id: id,
  name: "Set Operations",
  version: "v1.0.0",
  requiredEntityTypes: [],
  store: AppStore,
  context: AppContext,
});

export const SetOperationsAppId: string = id;
