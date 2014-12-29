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
var ApiConstants = require('./src/ApiConstants');

module.exports = {
    Api: Api,
    ApiFactory: ApiFactory,
    ApiUtil: ApiUtil,
    ApiConstants: ApiConstants
};
