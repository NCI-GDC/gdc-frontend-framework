import "@testing-library/jest-dom";
import { loadEnvConfig } from "@next/env";

class ResizeObserver {
  observe() {
    // do nothing.
  }
  unobserve() {
    // do nothing.
  }
  disconnect() {
    // do nothing.
  }
}

window.ResizeObserver = ResizeObserver;

window.URL.createObjectURL = (input: any) => "";

loadEnvConfig(__dirname, true, { info: () => null, error: console.error });

jest.mock("next/config", () => () => ({
  publicRuntimeConfig: {
    basePath: "/v2",
  },
}));
