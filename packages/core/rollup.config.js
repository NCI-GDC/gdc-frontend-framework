import babel from "@rollup/plugin-babel";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import dts from "rollup-plugin-dts";
import peerDepsExternal from "rollup-plugin-peer-deps-external";

const globals = {
  react: "React",
  "react-redux": "reactRedux",
  "@reduxjs/toolkit": "toolkit",
  "@reduxjs/toolkit/query": "query",
  "@reduxjs/toolkit/query/react": "react",
  "@reduxjs/toolkit/dist/query/react": "react",
  redux: "redux",
  "redux-persist": "reduxPersist",
  "redux-persist/lib/storage/createWebStorage": "createWebStorage",
  uuid: "uuid",
  lodash: "lodash",
  immer: "immer",
  "redux-persist/integration/react": "integration",
  "react-cookie": "reactCookie",
};

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
        globals,
      },
      {
        file: "dist/index.umd.js",
        format: "umd",
        name: "gffCore",
        globals,
      },
      {
        file: "dist/index.esm.js",
        format: "esm",
        name: "gffCore",
      },
    ],
    external: [
      "lodash",
      "uuid",
      "immer",
      "isomorphic-fetch",
      "redux",
      "redux-toolkit",
      "react-cookie",
    ],
    plugins: [
      peerDepsExternal(),
      typescript(),
      babel({
        presets: ["@babel/preset-react"],
        plugins: ["@emotion"],
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
