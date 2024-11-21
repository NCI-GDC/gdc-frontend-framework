import { swc } from "rollup-plugin-swc3";
import swcPreserveDirectives from "rollup-swc-preserve-directives";
import json from "@rollup/plugin-json";
import babel from "@rollup/plugin-babel";
import dts from "rollup-plugin-dts";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";

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
        format: "es",
      },
    ],
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
      babel({
        presets: ["@babel/preset-react", { runtime: "automatic" }],
        babelHelpers: "bundled",
      }),
    ],
  },
  {
    input: "src/styles.css",
    output: {
      file: "dist/styles.css",
      format: "es",
    },
    plugins: [
      postcss({
        modules: false,
        extract: "dist/style.css",
      }),
    ],
  },
  {
    input: "./dist/dts/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [dts()],
  },
];

export default config;
