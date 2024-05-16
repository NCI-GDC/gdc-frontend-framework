import CountHookRegistry from "../countHooksRegistry";
import { useLazySequenceReadCaseCountQuery } from "./sequenceReadCaseCount";
import { useLazySsmsCaseCountQuery } from "./ssmsCaseCount";
import { useLazyCnvOrSsmCaseCountQuery } from "./cnvOrSsmCaseCount";
import { useLazyGeneExpressionCaseCountQuery } from "./geneExpressionCaseCount";
import { useLazyMafFileCountQuery } from "./mafFileCount";

// register Default Hooks for various Counts
export const registerDefaultCountsHooks = () => {
  const instance = CountHookRegistry.getInstance();
  // register the default hooks.
  try {
    instance.registerHook(
      "sequenceReadCaseCount",
      useLazySequenceReadCaseCountQuery,
    );
    instance.registerHook("ssmCaseCount", useLazySsmsCaseCountQuery);
    instance.registerHook("cnvOrSsmCaseCount", useLazyCnvOrSsmCaseCountQuery);
    instance.registerHook(
      "geneExpressionCaseCount",
      useLazyGeneExpressionCaseCountQuery,
    );
    instance.registerHook("mafFileCount", useLazyMafFileCountQuery);
  } catch (error: any) {
    console.error(error.message);
  }
};
