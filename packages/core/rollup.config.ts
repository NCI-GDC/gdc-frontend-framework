import babel from "@rollup/plugin-babel";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import dts from "rollup-plugin-dts";

const config = [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.js",
        format: "cjs",
      },
      {
        file: "dist/index.min.js",
        format: "iife",
        name: "gffCore",
        plugins: [terser()],
      },
      {
        file: "dist/index.umd.js",
        format: "umd",
        name: "gffCore",
      },
      {
        file: "dist/index.esm.js",
        format: "esm",
        name: "gffCore",
      },
    ],
    plugins: [
      typescript(),
      babel({
        presets: ["@babel/preset-react"],
        babelHelpers: "runtime",
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
