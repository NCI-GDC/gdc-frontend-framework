import CountHookRegistry from "../countHooksRegistry";
import { useLazySequenceReadCaseCountQuery } from "./sequenceReadCaseCount";
import { useLazySsmsCaseCountQuery } from "./ssmsCaseCount";
import { useLazyCnvOrSsmCaseCountQuery } from "./cnvOrSsmCaseCount";
import { useLazyGeneExpressionCaseCountQuery } from "./geneExpressionCaseCount";
import { useLazyMafFileCountQuery } from "./mafFileCount";

// register Default Hooks for Various Counts

// Path: packages/core/src/features/counts/hooks/registerHooks.ts

export const registerDefaultCountsHooks = () => {
  const instance = CountHookRegistry.getInstance();

  // Register hooks here
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
};
