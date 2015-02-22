var Client  = require('./Client');
var request = require('request');

module.exports = function (opts) {
return new Promise(function (resolve, reject) {
  if (!opts.spec) {
    throw Error('spec is required');
  }

  request(opts.spec, function (err, response, body) {
    try {
      resolve(new Client(JSON.parse(body)));
    } catch (e) {
      reject(e);
    }
  });
});
};
