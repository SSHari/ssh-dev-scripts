const fs = require('fs');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

/* File Contents */
const eslintIgnore = `node_modules
babel.config.js
release.config.js
rollup.config.js
**/__tests__/**
dist`;

const babelConfig = `module.exports = require('ssh-dev-scripts/src/babel.config');`;

const eslintConfig = `module.exports = require('ssh-dev-scripts/src/eslint.config');`;

const prettierConfig = `module.exports = require('ssh-dev-scripts/src/prettier.config');`;

const releaseConfig = `module.exports = require('ssh-dev-scripts/src/release.config');`;

const rollupConfig = `import { createFileConfig, createExternalDeps } from 'ssh-dev-scripts/src/rollup.config';
export default createFileConfig({ external: createExternalDeps({ '@babel/runtime': 'version' }) });`;

const tsConfig = `{
  "extends": "ssh-dev-scripts/src/tsconfig.json",
  "compilerOptions": {
    "baseUrl": "src",
    "declarationDir": "dist/types",
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}`;

const tsConfigBuild = `{
  "extends": "./tsconfig.json",
  "exclude": ["src/**/*.spec.ts*", "src/**/__tests__/**"]
}`;

async function setup() {
  const { stdout } = await exec('npm -v');
  const [major] = stdout?.split('.');

  if (Number(major) < 7) {
    console.warn(`This script expects npm to be on version 7+, but the npm major version in this environment is ${major}`);
    process.exitCode = 1;
  } else {
    // Set up scripts
    await exec('npm set-script build "npm-run-all --parallel build:app build:types"');
    await exec('npm set-script build:app "rollup -c"');
    await exec('npm set-script build:types "tsc -p tsconfig.build.json"');
    await exec('npm set-script format:files "prettier --ignore-path .gitignore ."');
    await exec('npm set-script format:check "npm run format:files -- --check"');
    await exec('npm set-script format "npm run format:files -- --write"');
    await exec('npm set-script lint "eslint ."');
    await exec('npm set-script prepare "husky install"');
    await exec('npm set-script test "jest"');
    await exec('npm set-script typecheck "tsc --noEmit --emitDeclarationOnly false"');
    await exec('npm set-script validate "npm-run-all --parallel format:check lint test typecheck"');

    // Set up config files
    writeFile('.eslintignore', eslintIgnore);
    writeFile('babel.config.js', babelConfig);
    writeFile('eslint.config.js', eslintConfig);
    writeFile('prettier.config.js', prettierConfig);
    writeFile('release.config.js', releaseConfig);
    writeFile('rollup.config.js', rollupConfig);
    writeFile('tsconfig.build.json', tsConfigBuild);
    writeFile('tsconfig.json', tsConfig);

    // Set up husky
    try {
      await exec('mkdir .husky');
      await exec('npx husky add .husky/pre-commit "npm run validate"');
    } catch (error) {
      console.error('Failed to set up husky');
    }
  }
}

function writeFile(fileName, content) {
  try {
    fs.writeFileSync(fileName, content);
  } catch (error) {
    console.error(`Failed to write the file ${fileName}.`);
  }
}

setup();
