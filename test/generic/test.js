var app = require('../app')();
var router = require('../../index');
var expect = require('chai').expect;

it('should load the API', function () {

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
        'post:/users/:id',
        'get:/products/:id'
      ]);

      expect(app.results('get:/users')).to.eql(['USER-GET-1', 'USER-GET-2', 'USER-GET-3']);
      expect(app.results('put:/users')).to.eql(['USER-PUT-1', 'USER-PUT-2', 'USER-PUT-3']);
      expect(app.results('get:/users/:id')).to.eql(['USER-GET-ID-1', 'USER-GET-ID-2', 'USER-GET-ID-3']);
      expect(app.results('post:/users/:id')).to.eql(['USER-POST-ID-1', 'USER-POST-ID-2', 'USER-POST-ID-3']);
      expect(app.results('get:/products/:id')).to.eql(['PRODUCT-GET-ID-1', 'PRODUCT-GET-ID-2', 'PRODUCT-GET-ID-3']);

    });

});