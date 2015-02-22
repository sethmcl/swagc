var swagc = s.lib('swagc');

describe('swagc', function () {
  var client;

  beforeEach(function (done) {
    swagc({ spec: 'http://localhost:5000/api/spec' })
      .then(function (swaggerClient) {
        client = swaggerClient;
        done();
      })
      .catch(done);
  });

  it('should populate description', function () {
    s.assert.equal(client.description, 'API');
  });

  it('should populate swaggerVersion', function () {
    s.assert.equal(client.swaggerVersion, '1.2');
  });

  it('should populate basePath', function () {
    s.assert.equal(client.basePath, 'http://localhost:5000');
  });

  it('should print help', function () {
    client.print();
  });
});
