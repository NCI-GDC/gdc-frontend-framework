import pkg from "./package.json" with { type: "json" };
import json from "@rollup/plugin-json";
import dts from "rollup-plugin-dts";
import alias from "@rollup/plugin-alias";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import { swc } from "rollup-plugin-swc3";
import swcPreserveDirectives from "rollup-swc-preserve-directives";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const external = [...Object.keys(pkg.dependencies ?? {})];

const config = [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.js",
        format: "cjs",
        sourcemap: true,
      },
      {
        file: "dist/index.esm.js",
        format: "esm",
        sourcemap: true,
      },
    ],
    external,
    plugins: [
      peerDepsExternal(),
      json(),
      swc({
        sourceMaps: true,
        include: /\.[mc]?[jt]sx?$/,
        exclude: /node_modules/,
        tsconfig: "tsconfig.json",
        jsc: {},
      }),
      swcPreserveDirectives(),
    ],
  },
  {
    input: "./dist/dts/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [
      alias({
        entries: [
          {
            find: /^src\/(.*)/,
            replacement: resolve(__dirname, "dist/dts/$1"),
          },
          {
            find: /^@\/core\/(.*)/,
            replacement: resolve(__dirname, "dist/dts/core/$1"),
          },
        ],
      }),
      dts(),
    ],
  },
];

export default config;
