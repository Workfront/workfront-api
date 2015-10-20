# workfront-api
[![NPM version][npm-version-image]][npm-url] [![NPM downloads][npm-downloads-image]][npm-url] [![Apache v2 License][license-image]][license-url] [![Build Status][travis-image]][travis-url] [![Coverage][coveralls-image]][coveralls-url] [![Code Climate][code-climate-image]][code-climate-url]

A Workfront API for the Node and the Web


## Usage

#### Server-side

Install as a dependency:
	
    npm install --save workfront-api
	
Then `require('workfront-api')` in your code. For example:
```javascript
var Workfront = require('workfront-api'),
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
console.log(util.inspect(Workfront, {depth:0}));
```

#### In a browser

This package uses [Browserify](http://browserify.org) to generate [dist/workfront.min.js](dist/workfront.min.js). Loading that script will create `window.Workfront` object which will contain all the classes and methods just as in the server-side environment (see [Server-side](#server-side) section).  
This package makes use of [Promises](https://www.promisejs.org). Promises are not currently supported by all browsers (see [kangax compatibility tables](http://kangax.github.io/compat-table/es6/#Promise)), but there are many polyfills available, including one listed in [www.promisejs.org](https://www.promisejs.org). Load polyfill before `workfront.min.js` and everything will work just fine.  
Although the lack of CORS support may prevent you from sending request to Workfront servers, there are some usage examples in [examples/browser](examples/browser) folder to give you an idea.  
Note, that it is still possible to make use of this package in privileged environment such as browser extensions.


## Documentation

API documentation is available at [http://workfront.github.io/workfront-api/](http://workfront.github.io/workfront-api/).


## Examples

A number of examples can be found under [examples](examples) directory. It includes examples for both [node](examples/node) and [browser](examples/browser) environments.  
In order to run these examples clone a copy of workfront-api repository:

    git clone git://github.com/Workfront/workfront-api.git

#### Running [node](examples/node) examples

First enter into `workfront-api` directory and install all the dependencies:

    cd workfront-api
    npm install

Use `node` to run the examples. For examples:

    node examples/node/get-user-count.js

Each example script outputs all its results into console and contains comments in the source code explaining what is happening in more details.

#### Running [browser](examples/browser) examples

To start supplied webserver type:

    npm start

Visit [http://localhost:8000/examples/browser/](http://localhost:8000/examples/browser/) to see list of all examples available for browser.


## Contributing

We welcome contributions of all kinds from anyone. It can be either new example or fix or documentation improvement. Please read these guidelines:

### Bug Reports
A bug is a _demonstrable problem_ that is caused by the code in the repository. Good bug reports are extremely helpful - thank you! Please make sure to check these points to make a good bug report:

1. **Use the GitHub issue search** &mdash; check if the issue has already been
   reported.
2. **Isolate the problem** &mdash; ideally create a [reduced test
      case](https://css-tricks.com/reduced-test-cases/).
3. A good bug report shouldn't leave others needing to chase you up for more information. Please try to be as detailed as possible in your report.

### Feature requests

Feature requests are welcome. But take a moment to find out whether your idea
fits with the scope and aims of the project. It's up to *you* to make a strong
case to convince the project's developers of the merits of this feature. Please
provide as much detail and context as possible.

## License

Copyright (c) 2015 Workfront

Licensed under the Apache License, Version 2.0.
See the top-level file `LICENSE` and
(http://www.apache.org/licenses/LICENSE-2.0).


[license-image]: http://img.shields.io/badge/license-APv2-blue.svg?style=flat
[license-url]: LICENSE

[npm-url]: https://www.npmjs.org/package/workfront-api
[npm-version-image]: https://img.shields.io/npm/v/workfront-api.svg?style=flat
[npm-downloads-image]: https://img.shields.io/npm/dm/workfront-api.svg?style=flat

[travis-url]: https://travis-ci.org/Workfront/workfront-api
[travis-image]: https://img.shields.io/travis/Workfront/workfront-api.svg?style=flat

[coveralls-url]: https://coveralls.io/r/Workfront/workfront-api
[coveralls-image]: https://img.shields.io/coveralls/Workfront/workfront-api.svg?style=flat

[code-climate-url]: https://codeclimate.com/github/Workfront/workfront-api
[code-climate-image]: https://img.shields.io/codeclimate/github/Workfront/workfront-api.svg?style=flat

