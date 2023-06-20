import { createGdcApp, createAppID } from "@gff/core";
import SetOperationsApp from "@/features/set-operations/SetOperationsApp";

export default createGdcApp({
  App: SetOperationsApp,
  name: "Set Operations",
  version: "v1.0.0",
  requiredEntityTypes: [],
});

export const SetOperationsAppId: string = createAppID(
  "Set Operations",
  "v1.0.0",
);
