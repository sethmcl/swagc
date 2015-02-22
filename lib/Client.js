var Operation = require('./Operation');

module.exports = Client;

function Client(spec) {
  this.description = spec.description;
  this.basePath = spec.basePath;
  this.swaggerVersion = spec.swaggerVersion;

  this.api = {};
  spec.apis.forEach(function (api) {
    api.operations.forEach(function (op) {
      var operation = new Operation(this.basePath, api.path, op);
      this.api[operation.name] = operation.run.bind(operation);
      this.api[operation.name].help = operation.help.bind(operation);
    }, this);
  }, this);
}

Client.prototype.usage = function () {
  Object.keys(this.api).forEach(function (key) {
    console.log(this.api[key].help());
  }, this);
};
