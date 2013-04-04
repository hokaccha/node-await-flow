# node-await-flow

A simple async/await module, abstraction of node-fibers.

similar to

* [synchronize](https://github.com/alexeypetrushin/synchronize)
* [asyncblock](https://github.com/scriby/asyncblock)

## Usage:

basic

```javascript
var AwaitFlow = require('await-flow');
var fs = require('fs');

AwaitFlow.run(function(await) {
  // read file async
  var content = await(function(next) {
    fs.readFile('./package.json', 'utf8', next);
  });

  // wait 1000ms
  await(function(next) {
    setTimeout(next, 1000);
  });

  // output file content
  console.log(content);
});
```

error handling

```javascript
var AwaitFlow = require('await-flow');
var fs = require('fs');

AwaitFlow.run(function(await) {
  var content = await(function(next) {
    // not exists file
    fs.readFile('/foo/bar/baz', 'utf8', next);
  });

  console.log(content); // This line will not be executed
}, function(err) {
  console.log(err);
  //=> { [Error: ENOENT, open '/foo/bar/baz'] errno: 34, code: 'ENOENT', path: '/foo/bar/baz' }
});
```
