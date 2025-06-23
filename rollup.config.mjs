// rollup.config.mjs
import typescript from "@rollup/plugin-typescript";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import postcss from "rollup-plugin-postcss";
import terser from "@rollup/plugin-terser";
import { createFilter } from "@rollup/pluginutils";

// List of external dependencies that should never be bundled
const EXTERNAL_DEPS = [
  // React core
  "react",
  "react-dom",
  "react/jsx-runtime",

  // Animation libraries
  "gsap",
  "gsap/ScrollTrigger",
  "gsap/TextPlugin",
  "framer-motion",

  // Three.js ecosystem
  "three",
  "three-stdlib",
  "@react-three/fiber",
  "@react-three/drei",
  "@react-three/postprocessing",
  "@react-three/rapier",

  // UI libraries
  "@chakra-ui/react",
  "@emotion/react",
  "@emotion/styled",

  // Physics and graphics
  "matter-js",
  "postprocessing",
  "meshline",
  "ogl",
  "gl-matrix",

  // Motion types
  "@motionone/types"
];

// Function to determine if a module should be external
function isExternal(id) {
  // Check exact matches
  if (EXTERNAL_DEPS.includes(id)) return true;

  // Check for three.js submodules
  if (id.startsWith('three/examples/jsm/')) return true;

  // Check for any of our external packages
  return EXTERNAL_DEPS.some(dep => id.startsWith(dep + '/'));
}

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
  external: (id) => {
    // Use our function first
    if (isExternal(id)) return true;

    // Additional explicit checks for problematic packages
    const problematicPackages = [
      'matter-js',
      '@react-three/fiber',
      '@react-three/drei',
      'ogl',
      'three-stdlib',
      'gl-matrix',
      '@react-three/postprocessing',
      'postprocessing'
    ];

    return problematicPackages.some(pkg => id === pkg || id.startsWith(pkg + '/'));
  },
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
    peerDepsExternal({
      includeDependencies: true
    }),
    nodeResolve({
      browser: true,
      preferBuiltins: false,
      exportConditions: ['import', 'module', 'default'],
      skip: [
        // React core
        'react',
        'react-dom',

        // Animation libraries
        'gsap',
        'framer-motion',

        // Three.js ecosystem
        'three',
        'three-stdlib',
        '@react-three/fiber',
        '@react-three/drei',
        '@react-three/postprocessing',
        '@react-three/rapier',

        // UI libraries
        '@chakra-ui/react',
        '@emotion/react',
        '@emotion/styled',

        // Physics and graphics
        'matter-js',
        'postprocessing',
        'meshline',
        'ogl',
        'gl-matrix',

        // Motion types
        '@motionone/types'
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
