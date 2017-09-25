var app = require('../app')();
var router = require('../../index');
var expect = require('chai').expect;

it('should handle the syntaxic sugar', function () {
  return router
    .load({
      app: app,
      path: __dirname + '/api'
    })
    .then(function () {
      expect(app.routes).to.have.all.keys([
        'get:/users',
        'put:/users',
        'get:/users/:id',
        'post:/users/:id'
      ]);

      expect(app.results('get:/users')).to.eql(['A', 'B', 'USER-GET']);
      expect(app.results('put:/users')).to.eql(['A', 'B', 'USER-PUT-1', 'USER-PUT-2']);
      expect(app.results('get:/users/:id')).to.eql(['A', 'B', 'C', 'USER-GET-ID']);
      expect(app.results('post:/users/:id')).to.eql(['A', 'B', 'C', 'USER-POST-ID-1', 'USER-POST-ID-2', 'USER-POST-ID-3']);
    });
});