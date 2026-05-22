import terser from "@rollup/plugin-terser";

const globals = {
  d3: "d3",
  lodash: "lodash",
};

const config = [
  {
    input: "src/index.js",
    output: [
      {
        file: "dist/index.js",
        format: "cjs",
      },
      {
        file: "dist/index.min.js",
        format: "iife",
        name: "surivalplot",
        plugins: [terser()],
        globals,
      },
      {
        file: "dist/index.umd.js",
        format: "umd",
        name: "surivalplot",
        globals,
      },
      {
        file: "dist/index.esm.js",
        format: "esm",
        name: "surivalplot",
      },
    ],
    external: ["d3"],
  },
];

export default config;
