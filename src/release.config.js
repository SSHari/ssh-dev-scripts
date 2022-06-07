module.exports = {
  branches: ['master', 'main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    ['@semantic-release/npm', { npmPublish: true }],
    [
      '@semantic-release/github',
      {
        assets: ['package.json', 'package-lock.json'],
      },
    ],
    '@semantic-release/git',
  ],
};
