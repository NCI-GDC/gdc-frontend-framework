import { CountHookMap, CountHook } from "./types";
import { useCoreSelector } from "../../hooks";
import { selectCurrentCohortFilters } from "../cohort";
import { useDeepCompareEffect } from "use-deep-compare";
import {
  useDefaultCaseCountHook,
  useDefaultFileCountHook,
} from "./hooks/defaultCaseCounts";

export const defaultCountHook = () => {
  return {
    data: 0,
    isLoading: false,
    isSuccess: false,
    isError: true,
  };
};

const createUseCountHook = (queryHook: any) => {
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

  registerFunction(name: string, func: CountHook): void {
    if (this.registry[name]) {
      throw new Error(
        `Function with name ${name} already exists in the registry`,
      );
    }
    this.registry[name] = createUseCountHook(func);
  }

  getHook(name: string): CountHook {
    if (!Object.keys(this.registry).includes(name)) return defaultCountHook;

    return this.registry[name];
  }
}

export default CountHookRegistry;
