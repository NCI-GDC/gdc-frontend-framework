import dts from "rollup-plugin-dts";
import external from "rollup-plugin-peer-deps-external";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import { swc } from "rollup-plugin-swc3";
import swcPreserveDirectives from "rollup-swc-preserve-directives";

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
    external: ["react", "@mantine/core", "@mantine/hooks"],
    plugins: [
      external(),
      resolve(),
      commonjs(),
      swc(
        {
          sourceMaps: true,
          include: /\.[mc]?[json]?[jt]sx?$/,
          exclude: /node_modules/,
          tsconfig: "tsconfig.json",
          jsc: {},
        },
        swcPreserveDirectives(),
      ),
    ],
    onwarn(warning, warn) {
      // Ignore warnings about 'use client' directives
      if (
        warning.code === "MODULE_LEVEL_DIRECTIVE" &&
        warning.message.includes('"use client"')
      ) {
        return;
      }
      warn(warning);
    },
  },
  {
    input: "./dist/dts/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [dts()],
    onwarn(warning, warn) {
      // Ignore warnings about 'use client' directives
      if (
        warning.code === "MODULE_LEVEL_DIRECTIVE" &&
        warning.message.includes('"use client"')
      ) {
        return;
      }
      warn(warning);
    },
  },
];

export default config;
