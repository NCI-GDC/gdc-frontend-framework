import CountHookRegistry from "../countHooksRegistry";
import { useLazySequenceReadCaseCountsQuery } from "./sequenceReadCaseCount";

// register Default Hooks for Various Counts

// Path: packages/core/src/features/counts/hooks/registerHooks.ts

export const registerDefaultCountsHooks = () => {
  const instance = CountHookRegistry.getInstance();

  // Register hooks here
  instance.registerFunction(
    "sequenceReadCaseCount",
    useLazySequenceReadCaseCountsQuery,
  );
};
