import "@testing-library/jest-dom";
import { loadEnvConfig } from "@next/env";

window.ResizeObserver =
  window.ResizeObserver ||
  jest.fn().mockImplementation(() => ({
    disconnect: jest.fn(),
    observe: jest.fn(),
    unobserve: jest.fn(),
  }));

window.URL.createObjectURL = (input: any) => "";

loadEnvConfig(__dirname, true, { info: () => null, error: console.error });

jest.mock("url-join", () => ({
  urlJoin: jest.fn(),
}));

jest.mock("next/config", () => () => ({
  publicRuntimeConfig: {
    basePath: "/v2",
  },
}));

jest.mock("dom-to-svg", () => ({
  elementToSVG: jest.fn(),
}));

jest.mock("url-join", () => ({
  urlJoin: jest.fn(),
}));
