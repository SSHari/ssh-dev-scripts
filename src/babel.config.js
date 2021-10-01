module.exports = (api) => {
  const isTest = api.env('test');

  const presetEnvOptions = isTest ? { targets: { node: 'current' } } : {};

  return {
    presets: [['@babel/preset-env', presetEnvOptions], '@babel/preset-typescript', '@babel/preset-react'],
    plugins: ['@babel/plugin-transform-runtime'],
  };
};
