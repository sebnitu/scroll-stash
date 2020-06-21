const config = require('conventional-changelog-conventionalcommits');

module.exports = config({
  'types': [
    {'type': 'feat', 'section': 'Features'},
    {'type': 'fix', 'section': 'Bug Fixes'},
    {'type': 'imp', 'section': 'Improvements'},
    {'type': 'refactor', 'section': 'Improvements'},
    {'type': 'chore', 'section': 'Chores'},
    {'type': 'docs', 'section': 'Documentation'},
    {'type': 'perf', 'section': 'Performance'},
    {'type': 'test', 'section': 'Tests'}
  ]
});
