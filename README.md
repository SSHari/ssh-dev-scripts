# ssh-dev-scripts

A set of scripts and utilities to make setting up a consistent npm project easier.

## Included Packages and Configuration

- eslint
- husky
- jest
- prettier
- rollup
- semantic-release
- typescript
- @testing-library
  - jest-dom
  - react
  - react-hooks
  - user-event

## How to use

**Note:** The `ssh-dev-scripts` setup script expects that the `npm` version is 7+. While the configuration in this repo should work for lower versions, it's recommended to use a version that is supported.

```bash
# Install the dev scripts as a dev dependency
npm install --save-dev ssh-dev-scripts

# Run the setup script once to load the default configuration for all the packages
node ./node_modules/.bin/ssh-dev-scripts-setup
```
