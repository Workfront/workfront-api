# attask-api
[![NPM version][npm-version-image]][npm-url] [![NPM downloads][npm-downloads-image]][npm-url] [![Apache v2 License][license-image]][license-url] [![Build Status][travis-image]][travis-url] [![Coverage][coveralls-image]][coveralls-url]

An AtTask API for the Node and Web


## Status

This is currently work in progress. Package will be published to NPM registry once everything will be ready. Use source code at your own risk.


## Usage

#### Server-side

Install as a dependency:
	
    npm install --save attask-api
	
Then `require('attask-api')` in your code. For example:
```javascript
var attask = require('attask-api'),
	util = require('util');

/**
 * The console.log statement below will output the following:
 * { 
 *    Api: [Function: Api],
 *    ApiFactory: [Object],
 *    ApiUtil: [Object],
 *    ApiConstants: [Object] 
 * }
 */
console.log(util.inspect(attask, {depth:0})); 
```

#### In a browser

This package uses [Browserify](http://browserify.org) to generate [dist/attask.min.js](dist/attask.min.js). Loading that script will create `window.AtTask` object which will contain all the classes and methods just as in the server-side environment (see [Server-side](#server-side) section).
This package makes use of [Promises](https://www.promisejs.org). Promises are not currently supported by all browsers (see [kangax compatibility tables](http://kangax.github.io/compat-table/es6/#Promise) but there are many polyfills available, including one listed in [www.promisejs.org](https://www.promisejs.org). Load polyfill before `attask.min.js` and everything will work just fine.  
Although the lack of CORS support may prevent you from sending request to AtTask servers, there are some usage examples in [examples/browser](examples/browser) folder to give you an idea.


## Documentation

API documentation is available at [http://bhovhannes.github.io/attask-api/](http://bhovhannes.github.io/attask-api/).


## Examples

A number of examples can be found under [examples](examples) directory. It includes examples for both [node](examples/node) and [browser](examples/browser) environments.  
In order to run these examples clone a copy of attask-api repository:

    git clone git://github.com/bhovhannes/attask-api.git

#### Running [node](examples/node) examples

First enter into `attask-api` directory and install all the dependencies:

    cd attask-api
    npm install

Use `node` to run the examples. For examples:

    node examples/node/get-use-count.js

Each example script outputs all its results into console and contains comments in the source code explaining what is happenning in more details.

#### Running [browser](examples/browser) examples

There is a separate [Gulp](http://gulpjs.com) task for starting web server.
To start webserver type:

    node ./node_modules/gulp/bin/gulp.js serve

or, if you have Gulp installed globally, just:

    gulp serve

Visit [http://localhost:8000/examples/browser/](http://localhost:8000/examples/browser/) to see list of all examples available for browser.


[license-image]: http://img.shields.io/badge/license-APv2-blue.svg?style=flat
[license-url]: LICENSE

[npm-url]: https://www.npmjs.org/package/attask-api
[npm-version-image]: https://img.shields.io/npm/v/attask-api.svg?style=flat
[npm-downloads-image]: https://img.shields.io/npm/dm/attask-api.svg?style=flat

[travis-url]: https://travis-ci.org/bhovhannes/attask-api
[travis-image]: https://img.shields.io/travis/bhovhannes/attask-api.svg?style=flat

[coveralls-url]: https://coveralls.io/r/bhovhannes/attask-api
[coveralls-image]: https://img.shields.io/coveralls/bhovhannes/attask-api.svg?style=flat
