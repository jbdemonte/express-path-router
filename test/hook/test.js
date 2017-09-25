var App = require('../app');
var router = require('../../index');
var expect = require('chai').expect;
var modules = {
  get: require('./api/users/get'),
  put: require('./api/users/put'),
  _: require('./api/_')
};

it('should be called before each API point with all data', function () {
  var app = new App();
  var called = 0;
  return router
    .load({
      app: app,
      path: __dirname + '/api',
      hook: function (middlewares, data) {
        called++;
        expect(middlewares).to.be.an('array');

        if (data.method === 'get') {
          expect(data.route).to.eql('/users');
          expect(data.file).to.eql(__dirname + '/api/users/get.js');
          expect(data.module).to.equal(modules.get);
          expect(data.modules).to.eql([modules._, modules.get]);
          expect(middlewares).to.eql([].concat(modules._.middlewares, modules.get.middlewares));
        } else if (data.method === 'put') {
          expect(data.route).to.eql('/users');
          expect(data.file).to.eql(__dirname + '/api/users/put.js');
          expect(data.module).to.equal(modules.put);
          expect(data.modules).to.eql([modules._, modules.put]);
          expect(middlewares).to.eql(modules._.middlewares);
        } else {
          throw new Error('method mismatch');
        }
      }
    })
    .then(function () {
      expect(app.routes).to.have.all.keys([
        'get:/users',
        'put:/users'
      ]);
      expect(called).to.eql(2);
    });

});

it('should let modify middlewares source array', function () {
  var app = new App();
  return router
    .load({
      app: app,
      path: __dirname + '/api',
      hook: function (middlewares, data) {
        if (data.method === 'get') {
          middlewares.unshift(function () {
            return '0';
          });
          middlewares.push(function () {
            return '1';
          });
        } else {
          // remove last middleware (_.js => 'B')
          middlewares.pop();
        }
      }
    })
    .then(function () {
      expect(app.routes).to.have.all.keys([
        'get:/users',
        'put:/users'
      ]);
      expect(app.results('get:/users')).to.eql(['0', 'A', 'B', 'C', '1', 'CB']);
      expect(app.results('put:/users')).to.eql(['A', 'CB']);
    });
});

it('should handle middlewares result array', function () {
  var app = new App();
  return router
    .load({
      app: app,
      path: __dirname + '/api',
      hook: function (middlewares, data) {
        if (data.method === 'get') {
          return [
            middlewares[0],
            function () {
              return '0';
            }
          ];
        }
      }
    })
    .then(function () {
      expect(app.routes).to.have.all.keys([
        'get:/users',
        'put:/users'
      ]);
      expect(app.results('get:/users')).to.eql(['A', '0', 'CB']);
      expect(app.results('put:/users')).to.eql(['A', 'B', 'CB']);
    });
});

it('should not accept non-array as middlewares result', function () {
  var app = new App();
  return router
    .load({
      app: app,
      path: __dirname + '/api',
      hook: function (middlewares, data) {
        if (data.method === 'get') {
          return true;
        }
      }
    })
    .then(function () {
      return Promise.reject('Should have thrown');
    })
    .catch(function (err) {
      expect(err.message).to.eql('array expected');
    });
});
