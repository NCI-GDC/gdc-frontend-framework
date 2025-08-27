import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import dts from "rollup-plugin-dts";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import { swc } from "rollup-plugin-swc3";
import swcPreserveDirectives from "rollup-swc-preserve-directives";

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
  "js-cookie": "jsCookie",
  queue: "queue",
  "blueimp-md5": "blueimp-md5",
  "use-deep-compare": "use-deep-compare",
};

const config = [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.js",
        format: "cjs",
        globals,
        sourcemap: true,
      },
      {
        file: "dist/index.esm.js",
        format: "esm",
        name: "gffCore",
        globals,
        sourcemap: true,
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
      "js-cookie",
      "blueimp-md5",
      "queue",
      "use-deep-compare",
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
