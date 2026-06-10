import pkg from "./package.json" with { type: "json" };
import dts from "rollup-plugin-dts";
import alias from "@rollup/plugin-alias";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import { swc } from "rollup-plugin-swc3";
import swcPreserveDirectives from "rollup-swc-preserve-directives";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const packageNames = [...Object.keys(pkg.dependencies ?? {})];

const external = [
  ...packageNames,
  // match subpath imports like react-icons/fi, react-icons/md, etc.
  ...packageNames.map((name) => new RegExp(`^${name}/`)),
];

const config = [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.js",
        format: "cjs",
      },
      {
        file: "dist/index.es.js",
        format: "esm",
        exports: "named",
      },
    ],
    external,
    plugins: [
      peerDepsExternal(),
      swc({
        sourceMaps: true,
        include: /\.[mc]?[json]?[jt]sx?$/,
        exclude: /node_modules/,
        tsconfig: "tsconfig.json",
        jsc: {},
      }),
      swcPreserveDirectives(),
    ],
    onwarn(warning, warn) {
      if (
        warning.code === "UNUSED_EXTERNAL_IMPORT" &&
        warning.exporter?.startsWith("react-icons")
      ) {
        return;
      }
      warn(warning);
    },
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
            find: /^@\/cohort\/(.*)/,
            replacement: resolve(__dirname, "dist/dts/cohort/$1"),
          },
          {
            find: /^@\/common\/(.*)/,
            replacement: resolve(__dirname, "dist/dts/common/$1"),
          },
          {
            find: /^@\/modals\/(.*)/,
            replacement: resolve(__dirname, "dist/dts/modals/$1"),
          },
          {
            find: /^@\/layout\/(.*)/,
            replacement: resolve(__dirname, "dist/dts/layout/$1"),
          },
        ],
      }),
      dts(),
    ],
  },
];

export default config;
