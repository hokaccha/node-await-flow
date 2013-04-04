var Fiber = require('fibers');

/**
 * expose
 */
module.exports = AwaitFlow;


/**
 * @class AwaitFlow
 * @constructor
 */
function AwaitFlow() {
}


/**
 * @method run
 * @param {Function} fn
 * @param {Function} [options] done
 */
AwaitFlow.prototype.run = function awaitFlow_run(fn, done) {
  var self = this;

  if (typeof done !== 'function') done = noop;

  var fiber = Fiber(function() {
    var result;

    try {
      result = fn(await);
      done(null, result);
    }
    catch (e) {
      done(e);
    }
  });

  function await(_fn) {
    if (typeof _fn === 'function') {
      try {
        _fn(next);
      }
      catch (e) {
        done(e);
      }
    }

    return Fiber.yield();
  }

  function next(err, arg) {
    if (err) {
      done(err);
    }
    else {
      fiber.run(arg);
    }
  }

  process.nextTick(function() {
    fiber.run();
  });
};

/**
 * @method run
 * @param {Function} fn
 * @param {Function} [options] done
 * @static
 */
AwaitFlow.run = function AwaitFlow_run(fn, done) {
  var awaitFlow =  new AwaitFlow();

  awaitFlow.run(fn, done);
};


/**
 * @method noop
 * @private
 */
function noop() {}
