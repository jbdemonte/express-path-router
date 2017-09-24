module.exports = {

  // beware of version of path-to-regexp used in ExpressJS
  // ExpressJS currently use version 0.1.7 which does not handle .* as a regex
  // when will be up to date, the pattern will have to be updated to (.*)
  pattern: '(*)'
};