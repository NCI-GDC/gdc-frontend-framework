import "@testing-library/jest-dom";
import { loadEnvConfig } from "@next/env";

window.URL.createObjectURL = (input: any) => "";

loadEnvConfig(__dirname, true, { info: () => null, error: console.error });
