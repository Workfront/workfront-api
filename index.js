/**
 * Copyright 2015 Workfront
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

require('promise/polyfill');

/**
 * Simplifies creation of API instances as singletons
 * @type {exports}
 */
var ApiFactory = require('./src/ApiFactory');

/**
 * An Api class
 * @type {exports}
 */
var Api = require('./src/Api');

/**
 * Various utility methods for working with API
 * @type {exports}
 */
var ApiUtil = require('./src/ApiUtil');

/**
 * Constants to be used when working with API
 * @type {exports}
 */
var ApiConstants = require('workfront-api-constants/dist/umd/constants');

module.exports = {
    Api: Api,
    ApiFactory: ApiFactory,
    ApiUtil: ApiUtil,
    ApiConstants: ApiConstants
};
