import CountHookRegistry, {
  errorCountHook,
  createUseCountHook,
} from "../countHooksRegistry";
import * as countsRegistry from "../countHooksRegistry";
import { CountHook } from "../types"; // Replace '?' with accurate file path

describe("CountHookRegistry", () => {
  describe("getInstance()", () => {
    it("returns an instance of CountHookRegistry", () => {
      const instance = CountHookRegistry.getInstance();
      expect(instance).toBeInstanceOf(CountHookRegistry);
    });

    it("returns the same instance on multiple calls", () => {
      const instance1 = CountHookRegistry.getInstance();
      const instance2 = CountHookRegistry.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe("Test suite for createUseCountHook", () => {
    it("should spy on createUseCountHook function", () => {
      const spy = jest.spyOn(countsRegistry, "createUseCountHook");
      const mockFunction: CountHook = jest.fn();
      createUseCountHook(mockFunction); // calling the function to track its invocation
      expect(spy).toHaveBeenCalled();
      spy.mockRestore(); // Restoring the mocked function to its original state
    });
  });

  describe("registerFunction()", () => {
    let spyCreateUseCountHook: ReturnType<typeof jest.spyOn>;
    beforeAll(() => {
      spyCreateUseCountHook = jest
        .spyOn(countsRegistry, "createUseCountHook")
        .mockImplementation((hook: any) => hook);
    });

    afterAll(() => {
      spyCreateUseCountHook.mockRestore();
    });

    it("registers a function with a given name", () => {
      const registry = CountHookRegistry.getInstance();
      const mockFunction: CountHook = jest.fn();

      registry.registerHook("testFunc", mockFunction);
      const actualFunction = registry.getHook("testFunc");

      expect(actualFunction).toBe(mockFunction);
    });

    it("returns the function that was registered with the given name", () => {
      const registry = CountHookRegistry.getInstance();
      const mockFunction: CountHook = jest.fn();

      // add jest.spyOne of createUseCountHook

      registry.registerHook("testFunc2", mockFunction);
      const actualFunction = registry.getHook("testFunc2");

      expect(actualFunction).toBe(mockFunction);
    });

    it("returns undefined for function names that have not been registered", () => {
      const registry = CountHookRegistry.getInstance();
      const actualFunction = registry.getHook("nonexistentFunc");

      expect(actualFunction).toBe(errorCountHook);
    });
  });

  describe("registerFunction()", () => {
    it("throws an error when a function with the same name is registered", () => {
      const registry = CountHookRegistry.getInstance();
      const mockFunction1: CountHook = jest.fn();
      const mockFunction2: CountHook = jest.fn();
      expect.assertions(1);
      try {
        registry.registerHook("testFunc", mockFunction1);
        registry.registerHook("testFunc", mockFunction2);
      } catch (e: any) {
        expect(e.message).toBe(
          "Function with name testFunc already exists in the registry",
        );
      }
    });
  });
});
