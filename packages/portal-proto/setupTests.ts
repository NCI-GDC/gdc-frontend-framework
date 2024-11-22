import "@testing-library/jest-dom";
import { loadEnvConfig } from "@next/env";
import "@testing-library/jest-dom/extend-expect";

const { getComputedStyle } = window;
window.getComputedStyle = (elt) => getComputedStyle(elt);
window.HTMLElement.prototype.scrollIntoView = () => {};

const createNoopStorage = () => {
  return {
    getItem(_key) {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem(_key) {
      return Promise.resolve();
    },
  };
};

jest.mock("redux-persist/lib/storage", () => ({
  default: createNoopStorage(),
}));

Object.defineProperty(window, "localStorage", {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true,
});

Object.defineProperty(window, "sessionStorage", {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true,
});

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
