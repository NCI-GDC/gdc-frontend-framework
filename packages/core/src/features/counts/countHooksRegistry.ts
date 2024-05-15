import { CountHookMap, CountHook } from "./types";
import { useCoreSelector } from "../../hooks";
import { selectCurrentCohortFilters } from "../cohort";
import { useDeepCompareEffect } from "use-deep-compare";
import {
  useDefaultCaseCountHook,
  useDefaultFileCountHook,
} from "./hooks/defaultCaseCounts";

/**
 * Represents a hook for error count. Returned in getHook if no hook by the passed name is found.
 * @returns - The hook object containing a count of 0 and isError set to True
 */
export const errorCountHook = () => {
  return {
    data: 0,
    isLoading: false,
    isSuccess: false,
    isError: true,
  };
};

/**
 * Creates a custom hook that uses a query hook and manages a count of its usage.
 * @param queryHook - The query hook to be used.
 * @returns - The created custom hook.
 */
export const createUseCountHook = (queryHook: any) => {
  return () => {
    const currentCohort = useCoreSelector(selectCurrentCohortFilters);
    const [trigger, { data, isFetching, isSuccess, isError }] = queryHook();

    useDeepCompareEffect(() => {
      trigger(currentCohort);
    }, [currentCohort, trigger]);
    return {
      data,
      isLoading: isFetching,
      isSuccess,
      isError,
    };
  };
};

/**
 * A class representing a registry for count hooks. This class is a Singleton
 * with two functions:
 *  registerHook
 *  getHook
 */
class CountHookRegistry {
  private static instance: CountHookRegistry;
  private registry: CountHookMap = {
    repositoryCaseCount: useDefaultCaseCountHook,
    fileCount: useDefaultFileCountHook,
  };

  private constructor() {}

  static getInstance(): CountHookRegistry {
    if (!CountHookRegistry.instance) {
      CountHookRegistry.instance = new CountHookRegistry();
    }
    return CountHookRegistry.instance;
  }

  registerHook(name: string, func: CountHook): void {
    if (this.registry[name]) {
      throw new Error(
        `Function with name ${name} already exists in the registry`,
      );
    }
    this.registry[name] = createUseCountHook(func);
  }

  getHook(name: string): CountHook {
    if (!Object.keys(this.registry).includes(name)) return errorCountHook;

    return this.registry[name];
  }
}

export default CountHookRegistry;
