# workfront-api

[![NPM version][npm-version-image]][npm-url] [![NPM downloads][npm-downloads-image]][npm-url] [![Apache v2 License][license-image]][license-url] [![Build Status][travis-image]][travis-url] [![Coverage][codecov-image]][codecov-url] [![Code Climate][code-climate-image]][code-climate-url]
[![Build Status][saucelabs-badge]][saucelabs-url]

[![Build Status][saucelabs-matrix]][saucelabs-url]

A client for Workfront API which can be used in both server (NodeJS) and client (browsers).

If used in browser environment you may need to polyfill Promises (see ES6 Promise for polyfills) and fetch ([whatwg-fetch](https://github.com/fis-components/whatwg-fetch)).

## Usage

#### Server-side

Install as a dependency: `npm install --save workfront-api`.  
Then `require('workfront-api')` in your code. For example:

```javascript
const Workfront = require('workfront-api')

/**
 * The console.log statement below will output the following:
 * {
 *    NodeApi: [Function: Api],
 *    ResponseHandler: { success: [Function: success], failure: [Function: failure] }
 * }
 */
console.log(Workfront)
```

## Documentation

API documentation is available at [http://workfront.github.io/workfront-api/](http://workfront.github.io/workfront-api/).

## Examples

A number of examples can be found under [examples](examples) directory. It includes examples for both [node](examples/node) and [browser](examples/browser) environments.  
In order to run these examples clone a copy of workfront-api repository:

```shell script
git clone git://github.com/Workfront/workfront-api.git
```

#### Running [node](examples/node) examples

First enter into `workfront-api` directory and install all the dependencies:

```
cd workfront-api
yarn
```

Use `node` to run the examples. For examples:

```
node examples/node/get-user-count.js
```

Each example script outputs all its results into console and contains comments in the source code explaining what is happening in more details.

#### Running [browser](examples/browser) examples

To start supplied webserver type:

```shell script
npm start
```

Visit [http://localhost:8000/examples/browser/](http://localhost:8000/examples/browser/) to see list of all examples available for browser.

## Contributing

We welcome contributions of all kinds from anyone. It can be either new example or fix or documentation improvement. Please read these guidelines:

### Bug Reports

A bug is a _demonstrable problem_ that is caused by the code in the repository. Good bug reports are extremely helpful - thank you! Please make sure to check these points to make a good bug report:

1. **Use the GitHub issue search** &mdash; check if the issue has already been
   reported.
1. **Isolate the problem** &mdash; ideally create a [reduced test
   case](https://css-tricks.com/reduced-test-cases/).
1. A good bug report shouldn't leave others needing to chase you up for more information. Please try to be as detailed as possible in your report.

### Feature requests

Feature requests are welcome. But take a moment to find out whether your idea
fits with the scope and aims of the project. It's up to _you_ to make a strong
case to convince the project's developers of the merits of this feature. Please
provide as much detail and context as possible.

## License

Copyright (c) 2015-2019 Workfront

Licensed under the Apache License, Version 2.0.
See the top-level file `LICENSE` and
(http://www.apache.org/licenses/LICENSE-2.0).

[license-image]: http://img.shields.io/badge/license-APv2-blue.svg?style=flat
[license-url]: LICENSE
[npm-url]: https://www.npmjs.org/package/workfront-api
[npm-version-image]: https://img.shields.io/npm/v/workfront-api.svg?style=flat
[npm-downloads-image]: https://img.shields.io/npm/dm/workfront-api.svg?style=flat
[travis-url]: https://travis-ci.com/Workfront/workfront-api
[travis-image]: https://img.shields.io/travis/Workfront/workfront-api.svg?style=flat
[codecov-url]: https://codecov.io/gh/Workfront/workfront-api
[codecov-image]: https://codecov.io/gh/Workfront/workfront-api/branch/master/graph/badge.svg
[code-climate-url]: https://codeclimate.com/github/Workfront/workfront-api
[code-climate-image]: https://img.shields.io/codeclimate/github/Workfront/workfront-api.svg?style=flat
[saucelabs-badge]: https://saucelabs.com/buildstatus/citizensas
[saucelabs-url]: https://saucelabs.com/beta/builds/1b8be6f71455499c82f02afc881e6c14
[saucelabs-matrix]: https://saucelabs.com/browser-matrix/citizensas.svg
