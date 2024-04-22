import babel from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import copy from "rollup-plugin-copy";
import { dts } from "rollup-plugin-dts";

const globals = {
  d3: "d3",
};

const config = [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.js",
        format: "es",
      },
      {
        file: "dist/index.min.js",
        format: "iife",
        name: "sapien",
        plugins: [terser()],
        globals,
      },
      {
        file: "dist/index.umd.js",
        format: "umd",
        name: "sapien",
        globals,
      },
      {
        file: "dist/index.esm.js",
        format: "esm",
        name: "sapien",
      },
    ],
    external: ["d3"],
    plugins: [
      typescript(),
      babel({
        presets: ["@babel/preset-react"],
        exclude: "**/node_modules/**",
        babelHelpers: "bundled",
      }),
      copy({
        targets: [{ src: "style/bodyplot.css", dest: "dist" }],
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
