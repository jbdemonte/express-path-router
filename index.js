var glob = require('glob');


/**
 * Read files
 * @param {string} path
 * @return {Promise<string[]>}
 */
function getFiles(path) {
  return  new Promise(function (resolve, reject) {
    glob(path, function (err, files) {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
}

/**
 * Compare two files and prioritize words against params at same position
 * ie:
 *      api/companies/:companyId/get.js   =>    api/companies/find/get.js
 *      api/companies/find/get.js               api/companies/:companyId/get.js
 *
 * else, route using ":companyId" will always match for "find"
 * @param {string} dir1
 * @param {string} dir2
 * @return {number}
 */
function compare(dir1, dir2) {
  if (dir1 === dir2) {
    return 0;
  }
  if (!dir1 || !dir2) {
    return dir1 ? 1 : -1;
  }
  if (dir1[0] === ':') {
    if (dir2[0] === ':') {
      return dir1 < dir2 ? -1 : 1;
    }
    return 1;
  }
  if (dir2[0] === ':') {
    return -1;
  }
  return dir1 < dir2 ? -1 : 1;
}

exports.load = function (config, callback) {
  var ujsRe = /^((.*)\/)?_\.js$/;
  var path = config.path + '/';
  var promise = getFiles(path + '**/*.js').then(function (files) {
    var prefix = config.prefix ? config.prefix.replace(/^\/+/, '').replace(/\/+$/, '') : '';
    var params = [];

    // handle all _.js files
    files.forEach(function (file) {
      var module;
      var match = file.replace(path, '').match(ujsRe);
      if (match) {
        module = require(file);
        params.push({
          path: match[2] || '',
          module: module
        });
      }
    });

    files.sort(function (file1, file2) {
      var result;
      file1 = file1.split('/');
      file2 = file2.split('/');
      do {
        result = compare(file1.shift(), file2.shift());
      } while (!result && (file1.length || file2.length));
      return result;
    });
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    files
      .filter(function (file) {
        // ignore _.js files
        return !file.match(ujsRe);
      })
      .forEach(function (file) {

        var method;
        var args = [];
        var modules = [];
        var middlewares = [];
        var module = require(file);
        var apiPath = file.replace(path, '');
        var splitPath = apiPath.split('/');

        params.forEach(function (item) {
          if (!item.path || apiPath.indexOf(item.path) === 0) {
            if (item.module.pattern) {
              splitPath[item.path.split('/').length - 1] = item.module.pattern;
            }
            if (item.module.middlewares) {
              // use concat instead of push to allows array of array in middlewares
              middlewares = Array.prototype.concat.apply(middlewares, item.module.middlewares);
            }
            modules.push(item.module);
          }
        });

        if (module.pattern) {
          splitPath[splitPath.length - 2] = module.pattern;
        }

        modules.push(module);

        // extract method (get, put, delete...)
        method = splitPath.pop().replace('.js', '');

        // create args array to bind the express method with

        // 1) path
        // ---------------

        if (prefix) {
          splitPath.unshift(prefix);
        }

        args.push('/' + splitPath.join('/'));

        // 2) middlewares
        // ---------------
        if (module.middlewares) {
          // use concat instead of push to allows array of array in middlewares
          middlewares = Array.prototype.concat.apply(middlewares, module.middlewares);
        }

        if (config.hook) {
          middlewares = config.hook(middlewares, {
            method: method,
            route: splitPath.join('/'),
            modules: modules,
            module: module,
            file: file
          }) || middlewares;
        }

        if (middlewares.length) {
          Array.prototype.push.apply(args, middlewares);
        }

        // 3) callback
        // ---------------
        args.push(module.callback);

        config.app[method].apply(config.app, args);
      });
  });

  if (callback) {
    promise
      .then(function () {
        callback();
      })
      .catch(callback);
  } else {
    return promise.then(function () {
      return config.app;
    });
  }
};