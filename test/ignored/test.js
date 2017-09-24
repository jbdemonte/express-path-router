var app = require('../app')();
var router = require('../../index');
var expect = require('chai').expect;

it('should ignore tools.js for the API discovery', function () {

  return router
    .load({
      app: app,
      path: __dirname + '/api'
    })
    .then(function () {
      expect(app.routes).to.have.all.keys([
        'get:/products/:id'
      ]);

      expect(app.results('get:/products/:id')).to.eql(['PRODUCT-GET-ID-1', 'PRODUCT-GET-ID-2', 'PRODUCT-GET-ID-3']);

    });

});