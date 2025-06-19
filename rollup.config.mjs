// rollup.config.mjs
import typescript from "@rollup/plugin-typescript";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";

export default {
  input: "src/index.tsx",
  output: [
    {
      file: "dist/index.js",
      format: "cjs", // CommonJS
      exports: "named",
      sourcemap: true,
    },
    {
      file: "dist/index.es.js",
      format: "esm", // ES Module
      exports: "named",
      sourcemap: true,
    },
  ],
  external: ["react", "react-dom", "gsap", "gsap/ScrollTrigger"],
  plugins: [
    peerDepsExternal(),
    nodeResolve({
      browser: true,
      preferBuiltins: false,
    }),
    commonjs(),
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: true,
      declarationDir: "dist",
      exclude: ["**/*.test.*", "**/*.spec.*"],
    }),
    postcss({
      modules: false,
      extract: "index.css",
      inject: false,
      minimize: true,
      use: ["sass"],
    }),
    terser(),
  ],
};
