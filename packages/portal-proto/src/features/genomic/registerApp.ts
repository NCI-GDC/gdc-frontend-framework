import { createGdcAppWithOwnStore } from "@gff/core";
import { AppContext, AppStore, id } from "@/features/genomic/appApi";
import GenesAndMutationFrequencyAnalysisTool from "@/features/genomic/GenesAndMutationFrequencyAnalysisTool";

export default createGdcAppWithOwnStore({
  App: GenesAndMutationFrequencyAnalysisTool,
  id: id,
  name: "Genes and MutationFrequency",
  version: "v1.0.0",
  requiredEntityTypes: [],
  store: AppStore,
  context: AppContext,
});

export const GenesAndMutationFrequencyAppId: string = id;
