import { CountHookMap, CountHook } from "./types";

class CountHookRegistry {
  private static instance: CountHookRegistry;
  private registry: CountHookMap = {};

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
    this.registry[name] = func;
  }

  getFunction(name: string): CountHook | undefined {
    return this.registry[name];
  }
}

export default CountHookRegistry;
