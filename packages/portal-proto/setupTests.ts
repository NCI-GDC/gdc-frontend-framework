import "@testing-library/jest-dom";
import { loadEnvConfig } from "@next/env";
import "@testing-library/jest-dom/extend-expect";

const { getComputedStyle } = window;
window.getComputedStyle = (elt) => getComputedStyle(elt);
window.HTMLElement.prototype.scrollIntoView = () => {};

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserver;

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
