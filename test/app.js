module.exports = function App() {
  var self = this;
  if (!(self instanceof App)) {
    return new App();
  }
  self.routes = {};

  function handle(verb) {
    self[verb] = function () {
      var route = verb + ':' + arguments[0];
      if (self.routes[route]) {
        throw new Error('Route already exists');
      }
      self.routes[route] = Array.prototype.slice.call(arguments, 1);
    }
  }

  'get put delete post patch'.split(' ').forEach(handle);

  self.results = function (route) {
    return (self.routes[route] || []).map(function (fn) {
      return fn();
    })
  };
};