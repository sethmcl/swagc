var request = require('request');
var Promise = require('bluebird');

module.exports = Operation;

/**
 * @constructor
 * @param {string} basePath API base path
 * @param {string} path API path
 * @param {object} op Operation data
 * @param {string} op.method HTTP method
 * @param {string} op.nickname Operation alias
 * @param {array} op.parameters Operation parameters
 */
function Operation(basePath, path, op) {
  this.urlTokens = this.tokenizeUrl(basePath, path);
  this.method = op.method.toLowerCase();
  this.name = op.nickname;
  this.params = op.parameters;
}

/**
 * Run operation
 */
Operation.prototype.run = function (params) {
  return new Promise(function (resolve, reject) {
    var url = this.url(params);
    request[this.method](url, function (err, response, body) {
      var result = {
        status: response.statusCode,
        body: JSON.parse(body)
      };

      if (err) {
        return reject(err);
      }

      return resolve(result);
    });
  }.bind(this));
};

/**
 * Get usage information
 */
Operation.prototype.help = function () {
  var text = [`${this.name}(params)`];

  return text.concat(this.params.map(function (param) {
    return `  {${param.dataType}} params.${param.name} -- ${param.description}`;
  })).join('\n');
};

/**
 * Calculate URL for a request
 * @param {object} params
 * @return {string} url string
 */
Operation.prototype.url = function (params) {
  params = params || {};

  return this.urlTokens.map(function (token) {
    return token.value(params);
  }).join('/');
};

/**
 * Turn an API url string in to a set of tokens
 * @param {string} basePath API base path
 * @param {string} path API path
 * @returns {array} tokens
 */
Operation.prototype.tokenizeUrl = function (basePath, path) {
  var tokens = [];

  tokens.push(this.createStrToken(basePath));

  return tokens.concat(
    path.split('/').filter(function (part) {
      return part.length;
    }).map(function (part) {
      var match = part.match(/^\{(.*)\}$/);

      if (!match) {
        return this.createStrToken(part);
      }

      return this.createParamToken(match[1]);
    }, this)
  );
};

/**
 * Create a simple string token
 * @param {string} value
 */
Operation.prototype.createStrToken = function (value) {
  return {
    value: function () {
      return value;
    }
  };
};

/**
 * Create a parameter token
 * @param {string} param Name of parameter
 */
Operation.prototype.createParamToken = function (param) {
  return {
    value: function (ctx) {
      var value = ctx[param];

      if (typeof value === 'undefined') {
        throw Error(`${param} is not defined`);
      }

      if (typeof value === 'function') {
        return value.call(ctx);
      }

      return value;
    }
  };
};
