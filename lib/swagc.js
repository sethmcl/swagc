var Client  = require('./Client');
var request = require('request');

module.exports = function (spec) {
return new Promise(function (resolve, reject) {
  if (!spec) {
    throw Error('spec is required');
  }

  request(spec, function (err, response, body) {
    try {
      resolve(new Client(JSON.parse(body)));
    } catch (e) {
      reject(e);
    }
  });
});
};
