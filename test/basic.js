var AwaitFlow = require('../');
var expect = require('expect.js');
var fs = require('fs');

describe('AwaitFlow.run', function() {
  it('should be a function', function() {
    expect(AwaitFlow.run).to.be.a(Function);
  });

  it('should wait async', function(done) {
    var result = [];

    AwaitFlow.run(function(await) {
      result.push(1);

      var res = await(function(next) {
        setTimeout(function() {
          result.push(2);
          next(null, 3);
        }, 100);
      });

      result.push(res);

      expect(result).to.eql([1, 2, 3]);

      done();
    });
  });

  it('should run callback', function(done) {
    var result = [];

    AwaitFlow.run(function(await) {
      var res = await(function(next) {
        setTimeout(function() {
          result.push(1);
          next();
        }, 100);
      });
    }, function(err) {
      expect(result).to.eql([1]);
      done(err);
    });
  });

  it('should catch error', function(done) {
    AwaitFlow.run(function(await) {
      throw new Error('foo');
    }, function(err) {
      expect(err).to.be.a(Error);
      done();
    });
  });

  it('should catch await error', function(done) {
    AwaitFlow.run(function(await) {
      await(function(next) {
        throw new Error('foo');
      });
    }, function(err) {
      expect(err).to.be.a(Error);
      done();
    });
  });

  it('should catch next error', function(done) {
    AwaitFlow.run(function(await) {
      await(function(next) {
        next(new Error('foo'));
      });
    }, function(err) {
      expect(err).to.be.a(Error);
      done();
    });
  });

  it('should be async', function(done) {
    var result = [];

    AwaitFlow.run(function() {
      result.push(2);
    }, function(err) {
      expect(result).to.eql([1, 2]);
      done(err);
    });

    result.push(1);
  });

  it('should be able to nest', function(done) {
    var result = [];
    AwaitFlow.run(function(await) {
      await(function(next) {
        result.push(1);
        setTimeout(function() {
          result.push(2);
          AwaitFlow.run(function(await2) {
            result.push(3);
            await2(function(next2) {
              result.push(4);
              setTimeout(function() {
                result.push(5);
                next2();
              }, 100);
            });
          }, function() {
            next();
          });
        }, 10);
      });
    }, function(err) {
      result.push(6);
      expect(result).to.eql([1, 2, 3, 4, 5, 6]);
      done(err);
    });
  });

  it('should pass return value to callback',  function(done) {
    AwaitFlow.run(function(await) {
      return 'foo';
    }, function(err, result) {
      expect(result).to.be('foo');
      done();
    });
  });
});
