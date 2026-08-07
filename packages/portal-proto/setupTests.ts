import "@testing-library/jest-dom";
import { loadEnvConfig } from "@next/env";
import { configure } from "@testing-library/react";
import React from "react";

const { getComputedStyle } = window;
window.getComputedStyle = (elt) => getComputedStyle(elt);
window.HTMLElement.prototype.scrollIntoView = () => {};

jest.spyOn(React, "useId").mockImplementation(() => "react-test-id");

jest.mock("redux-persist/lib/storage", () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(() => Promise.resolve(null)),
    setItem: jest.fn(() => Promise.resolve()),
    removeItem: jest.fn(() => Promise.resolve()),
  },
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

window.ResizeObserver = ResizeObserver as any;

window.URL.createObjectURL = () => "";

loadEnvConfig(__dirname, true, { info: () => null, error: console.error });

jest.mock("url-join", () => ({
  urlJoin: jest.fn(),
}));

jest.mock("@datadog/browser-rum", () => ({
  datadogRum: { startView: jest.fn() },
}));

jest.mock("nanoid", () => ({
  nanoid: () => "mock-nanoid",
}));

const mockRouter = {
  pathname: "/",
  query: {},
  push: jest.fn(() => Promise.resolve(true)),
  replace: jest.fn(() => Promise.resolve(true)),
  prefetch: jest.fn(() => Promise.resolve()),
  reload: jest.fn(),
  asPath: "",
};

jest.mock("next/router", () => ({
  useRouter: jest.fn(() => mockRouter),

  withRouter: (Component: any) => {
    return function MockedWithRouter(props: any) {
      return React.createElement(Component, { ...props, router: mockRouter });
    };
  },
}));

jest.mock("@mantine/hooks", () => {
  const actual = jest.requireActual("@mantine/hooks");
  let count = 0;
  return {
    ...actual,
    useId: (id?: string) => id || `mantine-mock-${++count}`,
    _resetMantineCounter: () => {
      count = 0;
    },
  };
});

jest.mock("@reduxjs/toolkit", () => ({
  ...jest.requireActual("@reduxjs/toolkit"),
  nanoid: () => "mock-nanoid",
}));

beforeEach(() => {
  const { _resetMantineCounter } = jest.requireMock("@mantine/hooks");
  _resetMantineCounter();
});

// Mock fetch
global.fetch = jest.fn() as any;

configure({ defaultHidden: true });
