import babel from "@rollup/plugin-babel";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser";
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
        exports: "named",
      },
    ],
    plugins: [
      peerDepsExternal(),
      typescript(),
      json(),
      babel({
        presets: ["@babel/preset-react", { runtime: "automatic" }],
        babelHelpers: "bundled",
      }),
      terser(),
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
        extract: true,
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
