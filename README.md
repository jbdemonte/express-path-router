# express-path-router

[![travis build](https://img.shields.io/travis/jbdemonte/express-path-router.svg)](https://travis-ci.org/jbdemonte/express-path-router)
[![Coverage Status](https://coveralls.io/repos/github/jbdemonte/express-path-router/badge.svg?branch=master)](https://coveralls.io/github/jbdemonte/express-path-router?branch=master)
[![NPM Version](https://img.shields.io/npm/v/express-path-router.svg)](https://www.npmjs.com/package/express-path-router)

## Description

This module allows to mount an express API based on a file architecture and facilitate the middleware reuse.

## Installation

```
yarn add express-path-router
```

## Usage

Following the classic express routing way, a huge service may end with a really fastidious bunch of code (even when splitted in multiple files).
This module allows to avoid this by loading the routing from file architecture.

Example:

API target:

```js
app.get('cities/:cityId', [... middlewares ...], callback);
app.post('companies', [... middlewares ...], callback);
app.get('companies/:companyId', [... middlewares ...], callback);

```

File system:

```
|-- index.js
|-- api
        |-- cities
        |        |-- :cityId
        |                   |-- get.js
        |-- companies
                    |-- post.js
                    |-- :companyId
                                |-- get.js
```

Then, you can load it automatically

```js
var router = require('express-path-router');

router.load({
    app: app,
    path: __dirname + '/api'
  });
```

## Documentation

Each API point (file like `.../api/companies/:companyId/get.js`) is based on the following structure:

```js
module.exports = {
    pattern: string,
    middlewares: [function, ..., function],
    callback: function
}
```

*  `pattern` - string - optional - pattern replacement (ie: '(*)' will replace a `get:/products/:id` by `get:/products/(*)`)
*  `middlewares` - function[] - optional - list of middlewares to add on the route
*  `callback` - function - API point payload

A syntactic sugar may be used in the module, by returning a function or an array of function. Thoses functions will be set as middleware and callback.

### _.js

Specials files `_.js` may be added everywhere in the file structure. Thoses files middlewares will be added on each API point in their sub-structure.

Example:

```
|-- companies
            |-- _.js    {middlewares: [A, B, C]}
            |-- post.js {middlewares: [D], callback: E}
            |-- :companyId
                        |-- _.js {middlewares: [F, G]}
                        |-- get.js {middlewares: [H, I, J], callback: K}
```

This example will produce the equivalent of:
```js
app.post('companies', A, B, C, D, E);
app.get('companies/:companyId', A, B, C, F, G, H, I, J, K);
```

### load(config, callback)

*  `config` - object
    *  `app` - object - express application
    *  `path` - string - path to load
    *  `prefix` - string - optional - prefix to add on the route
    *  `hook` - function - optional - function call before each route definition to modify the middleware stack

*  `callback` - function - optional

returns `undefined` when using callback, else a promise.

#### hook(middlewares, data)

*  `middlewares` - function[]
*  `data` - object
    *  `file` - string - working file (ie. `.../api/companies/:companyId/get.js`)
    *  `method` - string - http verb (ie. `get`)
    *  `module` - object - module loaded (ie. `get.js` module)
    *  `modules` - object[] - ordered list of module (ie. `_.js, ...., get.js` module list)
    *  `route` - string - target route (ie. `companies/:companyId`)

The hook function is useful to modify the middleware stack before adding the route.
You can either modify the middlewares parameters or return a new array.

Example:

```js
var auth = require('../middlewares/auth');
var token = require('../middlewares/adminToken');

router.load({
    app: app,
    prefix: 'admin',
    path: __dirname,
    hook: function (middlewares, data) {
      logger.info('    ADMIN: ' + data.route + ' [' + data.method + ']');
      middlewares.unshift(token);
      if (data.module.registered) {
        middlewares.unshift(auth);
      }
    }
  });
```

## License
[MIT](https://opensource.org/licenses/MIT)