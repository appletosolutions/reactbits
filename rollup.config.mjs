// rollup.config.mjs
import typescript from "@rollup/plugin-typescript";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import postcss from "rollup-plugin-postcss";
import terser from "@rollup/plugin-terser";
import { createFilter } from "@rollup/pluginutils";

// Custom plugin to handle "use client" directives
function removeUseClientDirectives() {
  const filter = createFilter(['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx']);

  return {
    name: 'remove-use-client',
    transform(code, id) {
      if (!filter(id)) return null;

      // Remove "use client" directives to prevent bundling warnings
      const transformedCode = code.replace(/^['"]use client['"];?\s*/gm, '');

      if (transformedCode !== code) {
        return {
          code: transformedCode,
          map: null
        };
      }

      return null;
    }
  };
}

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
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    "gsap",
    "gsap/ScrollTrigger",
    "three",
    "three/examples/jsm/controls/OrbitControls",
    "three/examples/jsm/loaders/GLTFLoader",
    "@react-three/fiber",
    "@react-three/drei",
    "@react-three/postprocessing",
    "@react-three/rapier",
    "framer-motion",
    "@chakra-ui/react",
    "@emotion/react",
    "@emotion/styled",
    "matter-js",
    "postprocessing",
    "meshline",
    "ogl",
    "gl-matrix",
    "three-stdlib"
  ],
  onwarn(warning, warn) {
    // Suppress circular dependency warnings for known safe cases
    if (warning.code === 'CIRCULAR_DEPENDENCY') {
      // Allow circular dependencies in @internationalized/date as they are safe
      if (warning.message.includes('@internationalized/date')) {
        return;
      }
    }

    // Suppress "use client" directive warnings
    if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
      return;
    }

    // Show other warnings
    warn(warning);
  },
  plugins: [
    removeUseClientDirectives(),
    peerDepsExternal(),
    nodeResolve({
      browser: true,
      preferBuiltins: false,
      exportConditions: ['import', 'module', 'default'],
      skip: [
        'react',
        'react-dom',
        'three',
        '@react-three/fiber',
        '@react-three/drei',
        'framer-motion',
        '@chakra-ui/react',
        '@emotion/react',
        '@emotion/styled',
        'gsap'
      ]
    }),
    commonjs(),
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: true,
      declarationDir: "dist",
      exclude: ["**/*.test.*", "**/*.spec.*", "**/*.stories.*"],
      sourceMap: true,
      inlineSources: false,
    }),
    postcss({
      modules: false,
      extract: "index.css",
      inject: false,
      minimize: true,
      use: ["sass"],
    }),
    terser({
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
      format: {
        comments: false,
      },
      mangle: {
        reserved: ['React', 'ReactDOM'],
      },
    }),
  ],
};
