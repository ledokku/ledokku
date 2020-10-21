module.exports = {
  skip: {
    // This is handled by the bash script
    commit: true,
    tag: true,
  },
  // Where we read the current version
  packageFiles: 'server/package.json',
  // Empty array as we update the version in the release bash script
  bumpFiles: [],
  // Configuration passed down to the preset
  types: [
    {
      type: 'feat',
      section: 'Features',
    },
    {
      type: 'fix',
      section: 'Bug Fixes',
    },
    {
      type: 'perf',
      section: 'Performance Improvements',
    },
    {
      type: 'revert',
      section: 'Reverts',
    },
    {
      type: 'docs',
      section: 'Documentation',
    },
    {
      type: 'style',
      section: 'Styles',
    },
    {
      type: 'chore',
      section: 'Miscellaneous Chores',
    },
    {
      type: 'refactor',
      section: 'Code Refactoring',
    },
    {
      type: 'test',
      section: 'Tests',
    },
    {
      type: 'build',
      section: 'Build System',
    },
    {
      type: 'ci',
      section: 'Continuous Integration',
    },
  ],
};
