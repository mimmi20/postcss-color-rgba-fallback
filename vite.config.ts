import { defineConfig } from 'vitest/config';
import { resolveToEsbuildTarget } from 'esbuild-plugin-browserslist';
import browserslist from 'browserslist';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';

const target = resolveToEsbuildTarget(browserslist('defaults'), {
  printUnknownTargets: false,
});

const pkg = JSON.parse(readFileSync(resolve('package.json'), 'utf-8'));
const dependencies = Object.keys(pkg.dependencies || {});
const peerDependencies = Object.keys(pkg.peerDependencies || {});

export default defineConfig({
  appType: 'custom',
  root: __dirname,
  test: {
    include: ['test/*.test.js'],
    setupFiles: ['test/setup.ts'],
    clearMocks: true,

    reporters: ['default', 'junit'],
    outputFile: {
      junit: './junit-report.xml',
      html: './json-report.html',
    },

    coverage: {
      provider: 'istanbul',
      enabled: true,
      reporter: ['clover', 'text', 'html', 'lcov', 'lcovonly'],
      reportsDirectory: '.reports',
      include: ['src'],
    },
    testTimeout: 20000,
  },
  build: {
    target: target,
    outDir: 'dist', // relative to the `root` folder
    emptyOutDir: true,
    copyPublicDir: false,
    minify: 'esbuild',
    manifest: false,
    assetsInlineLimit: 0,
    modulePreload: {
      polyfill: false,
    },
    lib: {
      entry: 'src/index.js',
      name: 'index',
      formats: ['es', 'cjs'],
      // the proper extensions will be added
      fileName: (format, entryName) => `${entryName}.${format}.js`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [...dependencies, ...peerDependencies],
      // output: {
      //   // Provide global variables to use in the UMD build
      //   // for externalized deps
      //   globals: {
      //     vue: 'Vue',
      //   },
      // },
    },
  },
});
