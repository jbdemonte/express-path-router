var App = require('../app');
var router = require('../../index');
var expect = require('chai').expect;

it('should prefix the API', function () {
  var app = new App();
  return router
    .load({
      app: app,
      path: __dirname + '/api',
      prefix: 'path1/path2'
    })
    .then(function () {
      expect(app.routes).to.have.all.keys([
        'get:/path1/path2/users',
        'put:/path1/path2/users',
        'get:/path1/path2/users/:id',
        'post:/path1/path2/users/:id',
        'get:/path1/path2/products/:id'
      ]);

    });

});

it('should prefix the API without ignoring starting or ending /', function () {
  var app = new App();
  return router
    .load({
      app: app,
      path: __dirname + '/api',
      prefix: '/path1/path2/'
    })
    .then(function () {
      expect(app.routes).to.have.all.keys([
        'get:/path1/path2/users',
        'put:/path1/path2/users',
        'get:/path1/path2/users/:id',
        'post:/path1/path2/users/:id',
        'get:/path1/path2/products/:id'
      ]);

    });

});