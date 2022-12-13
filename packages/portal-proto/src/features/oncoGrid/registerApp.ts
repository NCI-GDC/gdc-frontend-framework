import { createGdcAppWithOwnStore } from "@gff/core";
import { AppContext, AppStore, id } from "@/features/oncoGrid/appApi";
import OncoGridAnalysisTools from "@/features/oncoGrid/OncoGridAnalysisTool";

export default createGdcAppWithOwnStore({
  App: OncoGridAnalysisTools,
  id: id,
  name: "Oncogrid",
  version: "v1.0.0",
  requiredEntityTypes: [],
  store: AppStore,
  context: AppContext,
});

export const OncoGridAppId: string = id;
