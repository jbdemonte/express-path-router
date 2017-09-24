var App = require('../app');
var router = require('../../index');
var expect = require('chai').expect;

it('should handle pattern replacement', function () {
  var app = new App();
  return router
    .load({
      app: app,
      path: __dirname + '/api'
    })
    .then(function () {
      expect(app.routes).to.have.all.keys([
        'get:/products/(*)',
        'get:/users/(*)'
      ]);
    });
});


it('should handle pattern replacement without being affected by a prefix', function () {
  var app = new App();
  return router
    .load({
      app: app,
      path: __dirname + '/api',
      prefix: 'path1/path2'
    })
    .then(function () {
      expect(app.routes).to.have.all.keys([
        'get:/path1/path2/products/(*)',
        'get:/path1/path2/users/(*)'
      ]);
    });
});
