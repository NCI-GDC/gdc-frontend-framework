import "@testing-library/jest-dom";
import { loadEnvConfig } from "@next/env";

window.URL.createObjectURL = (input: any) => "";

export default async () => {
  const projectDir = process.cwd();
  loadEnvConfig(projectDir);
};

// loadEnvConfig(process.cwd());
loadEnvConfig(__dirname, true, { info: () => null, error: console.error });

jest.mock("next/config", () => () => ({
  publicRuntimeConfig: {
    basePath: "/v2",
  },
}));
