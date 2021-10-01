const { DEFAULT_EXTENSIONS } = require('@babel/core');
const { babel } = require('@rollup/plugin-babel');
const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');
const resolve = require('@rollup/plugin-node-resolve').default;
const { terser } = require('rollup-plugin-terser');

const extensions = [...DEFAULT_EXTENSIONS, '.ts', '.tsx'];

const baseConfig = {
  input: 'src/index.js',
  output: [
    { file: `dist/index.esm.js`, format: 'esm', sourcemap: true },
    { file: 'dist/index.cjs.js', format: 'cjs', sourcemap: true },
  ],
  plugins: [json(), resolve({ extensions }), commonjs(), babel({ babelHelpers: 'runtime', extensions }), terser()],
};

function createExternalDeps(deps) {
  return Object.keys(deps).map((dep) => new RegExp(dep));
}

function createFileConfig(overrides) {
  return { ...baseConfig, ...overrides };
}

module.exports = { createExternalDeps, createFileConfig };
