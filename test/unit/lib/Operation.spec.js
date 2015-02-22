var Operation = s.lib('Operation');

describe('Operation', function () {
  var basePath = 'http://localhost:9898';
  var path = '/v1/{name}/foo';
  var op;

  beforeEach(function () {
    op = new Operation(basePath, path, {
      nickname: 'getFoo',
      method: 'GET',
      parameters: {
        dataType: 'string',
        name: 'name',
        paramType: 'path',
      }
    });
  });

  it('should calculate correct URL', function () {
    s.assert.equal(op.url({ name: 'bar' }), 'http://localhost:9898/v1/bar/foo');
  });

  it('should throw an error if parameter is missing', function () {
    var error = false;

    try {
      op.url();
    } catch (e) {
      error = true;
    }

    s.assert(error, true);
  });
});
