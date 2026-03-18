'use strict';
const { Octokit } = require('@octokit/rest');

// Fetch changed files from a push event
exports.getChangedFiles = async function(payload, accessToken) {
  var octokit = new Octokit({ auth: accessToken });

  var owner  = payload.repository.owner.login;
  var repo   = payload.repository.name;
  var before = payload.before;
  var after  = payload.after;

  // Get the diff between before and after commits
  var comparison = await octokit.repos.compareCommits({
    owner: owner,
    repo:  repo,
    base:  before,
    head:  after,
  });

  // Filter to only modified/added code files
  var CODE_EXTENSIONS = ['.js','.ts','.jsx','.tsx','.py','.java','.cpp','.go','.rs'];

  var files = comparison.data.files.filter(function(f) {
    return CODE_EXTENSIONS.some(function(ext) { return f.filename.endsWith(ext); })
      && f.status !== 'removed'
      && f.patch; // has actual changes
  });

  return files.slice(0, 3); // limit to 3 files per push to control costs
};

// Detect language from file extension
exports.detectLanguage = function(filename) {
  var ext = filename.split('.').pop().toLowerCase();
  var map = {
    'js':'javascript', 'jsx':'javascript',
    'ts':'typescript', 'tsx':'typescript',
    'py':'python', 'java':'java',
    'cpp':'cpp', 'go':'go', 'rs':'rust',
  };
  return map[ext] || 'javascript';
};
