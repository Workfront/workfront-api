(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("isomorphic-fetch"));
	else if(typeof define === 'function' && define.amd)
		define(["isomorphic-fetch"], factory);
	else if(typeof exports === 'object')
		exports["Workfront"] = factory(require("isomorphic-fetch"));
	else
		root["Workfront"] = factory(root["isomorphic-fetch"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_isomorphic_fetch__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_isomorphic_fetch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_isomorphic_fetch__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_workfront_api_constants__ = __webpack_require__(2);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Api; });
/**
 * Copyright 2015 Workfront
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
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
/**
 * @author Hovhannes Babayan <bhovhannes at gmail dot com>
 * @author Sassoun Derderian <citizen.sas at gmail dot com>
 */


/**
 * Creates new Api instance.
 * @param {Object} config   An object with the following keys:<br/>
 *     <code>url</code> {String} - Required. A url to Workfront server (for example: http://localhost:8080)<br/>
 *     <code>version</code> {String} - Optional. Which version of api to use. At the moment of writing can be 1.0, 2.0, 3.0, 4.0. Pass 'unsupported' to use Workfront latest API (maybe unstable).<br/>
 *     <code>alwaysUseGet</code> {Boolean} - Optional. Defaults to false. Will cause the api to make every request as a GET with params in the query string and add method=DESIRED_METHOD_TYPE in the query string. Some Workfront urls will have issues with PUT and DELETE calls if this value is false.<br/>
 *     <code>secureProtocol</code> {String} - Optional. Used only in https. The SSL method to use, e.g. TLSv1_method to force TLS version 1. The possible values depend on your installation of OpenSSL and are defined in the constant {@link http://www.openssl.org/docs/ssl/ssl.html#DEALING_WITH_PROTOCOL_METHODS|SSL_METHODS}.
 * @constructor
 */
var Api = (function () {
    function Api(config) {
        this.httpOptions = {
            url: config.url,
            headers: {}
        };
        // Append version to path if provided
        var path;
        if (['internal', 'unsupported', 'asp'].indexOf(config.version) >= 0) {
            path = '/attask/api-' + config.version;
        }
        else {
            path = '/attask/api';
            if (config.version) {
                path = path + '/v' + config.version;
            }
        }
        this.httpOptions.path = path;
    }
    /**
     * Used to obtain an API key
     * @memberOf Api
     * @param {String} username    A username in Workfront
     * @param {String} password    Password to use
     * @return {Promise}    A promise which will resolved with API key if everything went ok and rejected otherwise
     */
    Api.prototype.getApiKey = function (username, password) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (typeof _this.httpParams.apiKey !== 'undefined') {
                resolve(_this.httpParams.apiKey);
            }
            else {
                _this.execute('USER', null, 'getApiKey', {
                    username: username,
                    password: password
                }).then(function (data) {
                    _this.httpParams.apiKey = data.result;
                    resolve(_this.httpParams.apiKey);
                }, reject);
            }
        });
    };
    /**
     * Copies an existing object with making changes on a copy.
     * Copying is supported only for some objects. The {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer} page displays which objects support the Copy action.
     * @memberOf Api
     * @param {String} objCode    One of object codes from {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer}
     * @param {String} objID    ID of object to copy
     * @param {Object} updates    Which fields to set on copied object. See {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer} for the list of available fields for the given objCode.
     * @param {String|String[]} [fields]    Which fields to return. See {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer} for the list of available fields for the given objCode.
     * @return {Promise}    A promise which will resolved with results if everything went ok and rejected otherwise
     */
    Api.prototype.copy = function (objCode, objID, updates, fields) {
        var params = {
            copySourceID: objID,
            updates: updates ? JSON.stringify(updates) : undefined
        };
        return this.request(objCode, params, fields, Api.Methods.POST);
    };
    /**
     * Used to retrieve number of objects matching given search criteria
     * @memberOf Api
     * @param {String} objCode
     * @param {Object} query    An object with search criteria
     * @return {Promise}
     */
    Api.prototype.count = function (objCode, query) {
        return this.request(objCode + '/count', query, null, Api.Methods.GET).then(function (data) {
            return data.count;
        });
    };
    /**
     * Creates a new object.
     * @memberOf Api
     * @param {String} objCode    One of object codes from {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer}
     * @param {Object} params    Values of fields to be set for the new object. See {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer} for the list of available fields for the given objCode.
     * @param {String|String[]} [fields]    Which fields of newly created object to return. See {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer} for the list of available fields for the given objCode.
     * @returns {Promise}    A promise which will resolved with the ID and any other specified fields of newly created object
     */
    Api.prototype.create = function (objCode, params, fields) {
        return this.request(objCode, params, fields, Api.Methods.POST);
    };
    /**
     * Edits an existing object
     * @memberOf Api
     * @param {String} objCode    One of object codes from {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer}
     * @param {String} objID    ID of object to modify
     * @param {Object} updates    Which fields to set. See {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer} for the list of available fields for the given objCode.
     * @param {String|String[]} [fields]    Which fields to return. See {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer} for the list of available fields for the given objCode.
     * @return {Promise}    A promise which will resolved with results if everything went ok and rejected otherwise
     */
    Api.prototype.edit = function (objCode, objID, updates, fields) {
        var params = {
            updates: JSON.stringify(updates)
        };
        return this.request(objCode + '/' + objID, params, fields, Api.Methods.PUT);
    };
    /**
     * Executes an action for the given object
     * @memberOf Api
     * @param {String} objCode    One of object codes from {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer}
     * @param {String} objID    ID of object. Optional, pass null or undefined to omit
     * @param {String} action    An action to execute. A list of allowed actions are available within the {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer} under "actions" for each object.
     * @param {Object} [actionArgs]    Optional. Arguments for the action. See {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer} for the list of valid arguments
     * @returns {Promise}    A promise which will resolved if everything went ok and rejected otherwise
     */
    Api.prototype.execute = function (objCode, objID, action, actionArgs) {
        var endPoint = objCode;
        if (objID) {
            endPoint += '/' + objID + '/' + action;
        }
        else {
            actionArgs = actionArgs || {};
            actionArgs['action'] = action;
        }
        return this.request(endPoint, actionArgs, null, Api.Methods.PUT);
    };
    /**
     * Used for retrieve an object or multiple objects.
     * @memberOf Api
     * @param {String} objCode    One of object codes from {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer}
     * @param {String|Array} objIDs    Either one or multiple object ids
     * @param {String|String[]} fields    Which fields to return. See {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer} for the list of available fields for the given objCode.
     * @return {Promise}    A promise which will resolved with results if everything went ok and rejected otherwise
     */
    Api.prototype.get = function (objCode, objIDs, fields) {
        if (typeof objIDs === 'string') {
            objIDs = [objIDs];
        }
        var endPoint = objCode, params = null;
        if (objIDs.length === 1) {
            if (objIDs[0].indexOf(__WEBPACK_IMPORTED_MODULE_1_workfront_api_constants__["a" /* INTERNAL_PREFIX */]) === 0) {
                params = { id: objIDs[0] };
            }
            else {
                endPoint += '/' + objIDs[0];
            }
        }
        else {
            params = { id: objIDs };
        }
        return this.request(endPoint, params, fields, Api.Methods.GET);
    };
    /**
     * Logs in into Workfront. Should be a first call to Workfront API.
     * Other calls should be made after this one will be completed.
     * @memberOf Api
     * @param {String} username    A username in Workfront
     * @param {String} password    Password to use
     * @return {Promise}    A promise which will resolved with logged in user data if everything went ok and rejected otherwise
     */
    Api.prototype.login = function (username, password) {
        var _this = this;
        return this.request('login', { username: username, password: password }, null, Api.Methods.POST).then(function (data) {
            _this.setSessionID(data.sessionID);
            return data;
        });
    };
    /**
     * Logs out from Workfront
     * @memberOf Api
     * @return {Promise}    A promise which will resolved if everything went ok and rejected otherwise
     */
    Api.prototype.logout = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.request('logout', null, null, Api.Methods.GET).then(function (result) {
                if (result && result.success) {
                    delete _this.httpOptions.headers.sessionID;
                    resolve();
                }
                else {
                    reject();
                }
            });
        });
    };
    /**
     * Retrieves API metadata for an object.
     * @memberOf Api
     * @param {String} [objCode]    One of object codes from {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer}. If omitted will return list of objects available in API.
     * @return {Promise}    A promise which will resolved with object metadata if everything went ok and rejected otherwise
     */
    Api.prototype.metadata = function (objCode) {
        var path = '/metadata';
        if (objCode) {
            path = objCode + path;
        }
        return this.request(path, null, null, Api.Methods.GET);
    };
    /**
     * Executes a named query for the given obj code
     * @memberOf Api
     * @param {String} objCode    One of object codes from {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer}
     * @param {String} query    A query to execute. A list of allowed named queries are available within the {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer} under "actions" for each object.
     * @param {Object} [queryArgs]    Optional. Arguments for the action. See {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer} for the list of valid arguments
     * @param {String|String[]} fields    Which fields to return. See {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer} for the list of available fields for the given objCode.
     * @returns {Promise}    A promise which will resolved with received data if everything went ok and rejected with error info otherwise
     */
    Api.prototype.namedQuery = function (objCode, query, queryArgs, fields) {
        return this.request(objCode + '/' + query, queryArgs, fields, Api.Methods.GET);
    };
    /**
     * Deletes an object
     * @memberOf Api
     * @param {String} objCode    One of object codes from {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer}
     * @param {String} objID    ID of object
     * @param {Boolean} [bForce]    Pass true to cause the server to remove the specified data and its dependants
     * @returns {Promise}    A promise which will resolved if everything went ok and rejected otherwise
     */
    Api.prototype.remove = function (objCode, objID, bForce) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var params = bForce ? { force: true } : null;
            _this.request(objCode + '/' + objID, params, null, Api.Methods.DELETE).then(function (result) {
                if (result && result.success) {
                    resolve();
                }
                else {
                    reject();
                }
            }, reject);
        });
    };
    /**
     * Performs report request, where only the aggregate of some field is desired, with one or more groupings.
     * @memberOf Api
     * @param {String} objCode    One of object codes from {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer}
     * @param {Object} query    An object with search criteria and aggregate functions
     * @return {Promise}    A promise which will resolved with results if everything went ok and rejected otherwise
     */
    Api.prototype.report = function (objCode, query) {
        return this.request(objCode + '/report', query, null, Api.Methods.GET);
    };
    Api.prototype.request = function (path, params, fields, method) {
        if (method === void 0) { method = Api.Methods.GET; }
        params = Object.assign(params || {}, this.httpParams);
        var alwaysUseGet = this.httpOptions.alwaysUseGet;
        var options = Object.assign({}, this.httpOptions);
        if (alwaysUseGet) {
            params.method = method;
        }
        else {
            options.method = method;
        }
        if (path.indexOf('/') === 0) {
            options.path = this.httpOptions.path + path;
        }
        else {
            options.path = this.httpOptions.path + '/' + path;
        }
        fields = fields || [];
        if (typeof fields === 'string') {
            fields = [fields];
        }
        if (fields.length !== 0) {
            params.fields = fields.join();
        }
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        if (this.httpOptions.headers.sessionID) {
            headers.append('sessionID', this.httpOptions.headers.sessionID);
        }
        var bodyParams = Object.keys(params).reduce(function (a, k) {
            a.push(k + '=' + encodeURIComponent(params[k]));
            return a;
        }, []).join('&');
        return fetch(options.url + options.path, {
            method: method,
            headers: headers,
            body: bodyParams
        }).then(function (response) {
            return response.json();
        });
    };
    /**
     * Used for object retrieval by multiple search criteria.
     * @memberOf Api
     * @param {String} objCode    One of object codes from {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer}
     * @param {Object} query    An object with search criteria
     * @param {String|String[]} [fields]    Which fields to return. See {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer} for the list of available fields for the given objCode.
     * @return {Promise}    A promise which will resolved with search results if everything went ok and rejected otherwise
     */
    Api.prototype.search = function (objCode, query, fields) {
        return this.request(objCode + '/search', query, fields, Api.Methods.GET);
    };
    /**
     * Sets a sessionID in the headers
     * @memberOf Api
     * @param {String} sessionID   sessionID to set
     * @return {void}
     */
    Api.prototype.setSessionID = function (sessionID) {
        this.httpOptions.headers.sessionID = sessionID;
    };
    return Api;
}());

Api.Methods = {
    GET: 'GET',
    PUT: 'PUT',
    DELETE: 'DELETE',
    POST: 'POST'
};
if (typeof (window) === 'undefined') {
    // These plugins only work in node
    // require('./plugins/upload')(Api)
}


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Api__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ApiFactory; });
/**
 * Copyright 2015 Workfront
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
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
/**
 * @author Hovhannes Babayan <bhovhannes at gmail dot com>
 * @author Sassoun Derderian <citizen.sas at gmail dot com>
 */

var _instance;
/**
 * @name ApiFactory
 * @memberOf Workfront
 * @namespace
 */
var ApiFactory = {
    /**
     * Returns an Api instance. Creates a new one if no instance exists.<br/>
     * One can use this if Api is intended to be used as singleton.
     * @memberOf Workfront.ApiFactory
     * @param {Object} config   An object with the following keys:<br/>
     *     <code>url</code> {String} - Required. An url to Workfront server (for example: http://localhost:8080)<br/>
     *     <code>version</code> {String} - Optional. Which version of api to use. At the moment of writing can be 1.0, 2.0, 3.0, 4.0. Pass 'internal' to use Workfront internal API (this is the latest version, maybe unstable)
     * @param {Boolean} [returnNewInstance]    If true, always creates a new instance
     * @return {Api}
     */
    getInstance: function (config, returnNewInstance) {
        if (returnNewInstance) {
            return new __WEBPACK_IMPORTED_MODULE_0__Api__["a" /* Api */](config);
        }
        else {
            if (!_instance) {
                if (typeof config !== 'object') {
                    throw new Error('Please provide configuration as an object.');
                }
                _instance = new __WEBPACK_IMPORTED_MODULE_0__Api__["a" /* Api */](config);
            }
            return _instance;
        }
    },
    /**
     * Removes previously created Api instance.
     * @memberOf Workfront.ApiFactory
     */
    deleteInstance: function () {
        _instance = undefined;
    }
};


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Copyright 2016 Workfront
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
/**
 * @author Hovhannes Babayan <bhovhannes at gmail dot com>
 */
/**
 * Prefix for identifying a Sort field. Value is "_1_Sort" for first sort field, "_2_Sort", "_3_Sort" ... "_n_Sort".
 * @readonly
 * @type {String}
 */
const SORT = '_Sort';
/* unused harmony export SORT */

/**
 * Suffix for specifying expression operators (ApiConstants.Operators) on a field. Value is "_Mod".
 * @readonly
 * @type {String}
 */
const MOD = '_Mod';
/* unused harmony export MOD */

/**
 * A delimiter which is used to separate field name and its order key.<br/>
 * Can be used for filters, sorting, etc.<br/>
 * Example: <code>{name_1_Sort: 'ASC', id_2_Sort: 'DESC'}</code>
 * @readonly
 * @type {String}
 */
const ORDERDOT = '_';
/* unused harmony export ORDERDOT */

/**
 * Key used to specify the index of the first result to return starting with .
 * @readonly
 * @type {String}
 */
const FIRST = "$$FIRST";
/* unused harmony export FIRST */

/**
 * Key used to specify a limit on the number of results. If this key is present, the value is used.<br/>
 * If this value cannot be parsed or if it is less than or equal to 0, no limit is enforced.<br/>
 * Value is "$$LIMIT"<br/>
 * @readonly
 * @type {String}
 */
const LIMIT = "$$LIMIT";
/* unused harmony export LIMIT */

/**
 * Prefix used to identify an Data Extension parameter in the Query framework.<br/>
 * Used for retrieval of custom data fields.<br/>
 * @readonly
 * @type {String}
 */
const DATAEXTENSION = "DE:";
/* unused harmony export DATAEXTENSION */

/**
 * Suffix for specifying which fields will be added to the GROUP BY clause in a ReportQuery. Value is "_GroupBy".
 * @readonly
 * @type {String}
 */
const GROUPBY = "_GroupBy";
/* unused harmony export GROUPBY */

/**
 * Suffix for specifying force "_GroupBy". Value is "$$_ForceGroupBy".
 */
const FORCE_GROUPBY = "$$_ForceGroupBy";
/* unused harmony export FORCE_GROUPBY */

/**
 * Suffix for specifying aggregate functions in a ReportQuery. Value is "_AggFunc".
 */
const AGGFUNC = "_AggFunc";
/* unused harmony export AGGFUNC */

/**
 * Suffix for specifying comma-separated list of aggregated currency fields for the report
 */
const AGGCURRENCY_FIELDS = "$$AggCurr";
/* unused harmony export AGGCURRENCY_FIELDS */

const GROUPCURRENCY_FIELDS = "$$GroupCurr";
/* unused harmony export GROUPCURRENCY_FIELDS */

const SORTCURRENCY_FIELDS = "$$SortCurr";
/* unused harmony export SORTCURRENCY_FIELDS */

const FILTERCURRENCY_FIELDS = "$$FilterCurr";
/* unused harmony export FILTERCURRENCY_FIELDS */

/**
 * Key used to specify that a GROUP BY query should be done WITH ROLLUP. Value is "$$ROLLUP"
 */
const ROLLUP = "$$ROLLUP";
/* unused harmony export ROLLUP */

/**
 * Prefix for constants.
 * @readonly
 * @type {String}
 */
const INTERNAL_PREFIX = '$$';
/* harmony export (immutable) */ __webpack_exports__["a"] = INTERNAL_PREFIX;

/**
 * Values which can be used as wildcards
 * @readonly
 * @enum {String}
 */
const WildCards = {
    /**
     * Wildcard value for midnight (12:00AM) of the current Date. Wildcards are useful for Saved Searches.<br/>
     * If this value is passed in for any search value, it is replaced with the current date.<br/>
     * The following suffixes can also be used to modify this date: [b/e][+/-][# of units]["h" (hour)|"d" (day)|"w" (week)|"m" (month)|"q" (quarter)|"y" (year)]<br/>
     *    <code>$$TODAY+1d</code> would equal 12:00AM of the next day<br/>
     *    <code>$$TODAY-1d</code> would equal 12:00AM of the previous day<br/>
     *    <code>$$TODAY+2w</code> would equal 12:00AM of 2 weeks from today<br/>
     *    <code>$$TODAY+2m</code> would equal 12:00AM of 2 months from today<br/>
     *    <code>$$TODAYb</code> "the beginning of today" would equal 12:00AM today<br/>
     *    <code>$$TODAYe</code> "the end of today" would equal 12:00AM tomorrow<br/>
     *    <code>$$TODAYbm</code> "the beginning of the month" would equal 12:00AM of the first day of the month<br/>
     *    <code>$$TODAYe+1w</code> "the end of next week" would equal 12:00AM Sunday following the Saturday of next week<br/>
     * Value is "$$TODAY"<br/>
     */
    TODAY: "$$TODAY",
    /**
     * Wildcard value for the current time of the current Date. Wildcards are useful for Saved Searches.<br/>
     * If this value is passed in for any search value, it is replaced with the current date and time.<br/>
     * The following suffixes can also be used to modify this date: [b/e][+/-][# of units]["h" (hour)|"d" (day)|"w" (week)|"m" (month)|"q" (quarter)|"y" (year)]<br/>
     *    <code>$$NOW+1d</code> would equal the same time on the next day<br/>
     *    <code>$$NOW-1d</code> would equal the same time on the previous day<br/>
     *    <code>$$NOW+2w</code> would equal the same time on 2 weeks from now<br/>
     *    <code>$$NOW+2m</code> would equal the same time on 2 months from now<br/>
     * Value is "$$NOW"
     */
    NOW: "$$NOW",
    /**
     * Wildcard value for the currently authenticated User. Wildcards are useful for Saved Searches.<br/>
     * If this value is passed in for any search value, it is replaced with an attribute from the current User.<br/>
     * The following suffixes can be used: <code>.[ID(default)|homeGroupID|accessLevelID|categoryID|companyID|roleID|roleIDs|otherGroupIDs|accessLevelRank]</code><br/>
     *    <code>$$USER</code> would equal the current User's ID<br/>
     *    <code>$$USER.homeGroupID</code> would equal the current User's Home Group ID<br/>
     *    <code>$$USER.accessLevelID</code> would equal the current User's Access Level ID<br/>
     *    <code>$$USER.otherGroupIDs</code> would equal the all of the current User's Other Group IDs. This would translate into an "IN" clause for that queried field.<br/>
     *    <code>$$USER.roleIDs</code> would equal the all of the current User's Roles. This would translate into an "IN" clause for that queried field.<br/>
     *    <code>$$USER.roleID</code> would equal the all of the current User's Primary Role ID.<br/>
     * Value is "$$USER"
     */
    USER: "$$USER",
    /**
     * Wildcard value for the account Customer. Wildcards are useful for Saved Searches.<br/>
     * If this value is passed in for any search value, it is replaced with an attribute from the Customer.<br/>
     */
    CUSTOMER: "$$CUSTOMER",
    /**
     * Wildcard value for the account representative User. Wildcards are useful for Saved Searches.<br/>
     * If this value is passed in for any search value, it is replaced with an attribute from the Account representative.<br/>
     */
    ACCOUNTREP: "$$AR"
};
/* unused harmony export WildCards */

/**
 * How to sort the result
 * @readonly
 * @enum {String}
 */
const SortOrder = {
    /**
     * Ascending Sort. Value is "asc".
     */
    ASC: "asc",
    /**
     * Descending Sort. Value is "desc".
     */
    DESC: "desc",
    /**
     * Case-Insensitive Ascending Sort. Value is "ciasc".
     */
    CIASC: "ciasc",
    /**
     * Case-Insensitive Descending Sort. Value is "cidesc".
     */
    CIDESC: "cidesc"
};
/* unused harmony export SortOrder */

/**
 * Modifiers which can be used with filters (Mod suffix)
 * @readonly
 * @enum {String}
 */
const Operators = {
    /**
     * Produces the SQL expression <code>field < value</code>. Value is "lt".
     */
    LESSTHAN: "lt",
    /**
     * Produces the SQL expression <code>field <= value</code>. Value is "lte".
     **/
    LESSTHANEQUAL: "lte",
    /**
     * Produces the SQL expression <code>field > value</code>. Value is "gt".
     **/
    GREATERTHAN: "gt",
    /**
     * Produces the SQL expression <code>field >= value</code>. Value is "gte".
     **/
    GREATERTHANEQUAL: "gte",
    /**
     * Produces the SQL expression <code>field = value</code><br/>
     * Note that this is the default Modifier used when 1 value exists. Value is "eq".
     **/
    EQUAL: "eq",
    /**
     * Produces the SQL expression <code>UPPER(field) = UPPER(value)</code>. Value is "cieq".
     **/
    CIEQUAL: "cieq",
    /**
     * Produces the SQL expression <code>field <> value or field is null</code>. Value is "ne".
     **/
    NOTEQUAL: "ne",
    /**
     * Produces the SQL expression <code>field <> value</code>. This differs from NOTEQUAL in that null results are not
     * returned. Value is "nee".
     **/
    NOTEQUALEXACT: "nee",
    /**
     * Produces the SQL expression <code>UPPER(field) <> UPPER(value)</code>. Value is "cine".
     **/
    CINOTEQUAL: "cine",
    /**
     * Produces the SQL expression <code>field LIKE '%value%'</code>. Value is "contains".
     **/
    CONTAINS: "contains",
    /**
     * Produces the SQL expression <code>UPPER(field) LIKE UPPER('%value%')</code>. Value is "cicontains".
     **/
    CICONTAINS: "cicontains",
    /**
     * Produces the SQL expression <code>UPPER(field) LIKE UPPER('%value1%') OR UPPER(field) LIKE UPPER('%value2%') ... </code> where value1, value2, etc. are the results of value.split(" "). Value is "cicontainsany".
     **/
    CICONTAINSANY: "cicontainsany",
    /**
     * Produces the SQL expression <code>UPPER(field) LIKE UPPER('%value1%') AND UPPER(field) LIKE UPPER('%value2%') ... </code> where value1, value2, etc. are the results of value.split(" "). Value is "cicontainsany".
     **/
    CICONTAINSALL: "cicontainsall",
    /**
     * Produces the SQL expression <code>UPPER(field) LIKE UPPER('%value1%') AND UPPER(field) LIKE UPPER('%value2%') ... </code> where value1, value2, etc. are the results of value.split(" "). Value is "cicontainsany".
     **/
    CINOTCONTAINSALL: "cinotcontainsall",
    /**
     * Produces the SQL expression <code>UPPER(field) LIKE UPPER('%value1%') AND UPPER(field) LIKE UPPER('%value2%') ... </code> where value1, value2, etc. are the results of value.split(" "). Value is "cicontainsany".
     **/
    CINOTCONTAINSANY: "cinotcontainsany",
    /**
     * Produces the SQL expression <code>field NOT LIKE '%value%'</code>. Value is "notcontains".
     **/
    NOTCONTAINS: "notcontains",
    /**
     * Produces the SQL expression <code>UPPER(field) NOT LIKE UPPER('%value%')</code>. Value is "cinotcontains".
     **/
    CINOTCONTAINS: "cinotcontains",
    /**
     * Produces the SQL expression <code>field LIKE 'value'</code>
     * where value can contain replacement characters such as % and _. Value is "like".
     **/
    LIKE: "like",
    /**
     * Produces the SQL expression <code>UPPER(field) LIKE UPPER('value')</code>
     * where value can contain replacement characters such as % and _. Value is "cilike".
     **/
    CILIKE: "cilike",
    /**
     * Produces the SQL expression <code>UPPER(field) LIKE UPPER('value%')</code>. Value is "startswith".
     **/
    STARTSWITH: "startswith",
    /**
     * Produces the SQL expression <code>SOUNDEX(field) = SOUNDEX(value)</code>. Value is "soundex".
     **/
    SOUNDEX: "soundex",
    /**
     * Use of this Modifier requires the inclusion of a <code>value_Range</code> parameter.<br/>
     * Produces the SQL expression <code>field BETWEEN value AND value_Range</code>.<br/>
     * Note that this is the default Modifier used when a <code>_Range</code> value exists. Value is "between".
     **/
    BETWEEN: "between",
    /**
     * Use of this Modifier required the inclusion of a <code>value_Range</code> parameter.<br/>
     * Produces the SQL expression <code>UPPER(field) BETWEEN UPPER(value) AND UPPER(value_Range)</code>. Value is "cibetween".
     **/
    CIBETWEEN: "cibetween",
    /**
     * Use of this Modifier required the inclusion of a <code>value_Range</code> parameter.<br/>
     * Produces the SQL expression <code>fieldNOT BETWEEN value AND value_Range</code>. Value is "notbetween".
     **/
    NOTBETWEEN: "notbetween",
    /**
     * Use of this Modifier required the inclusion of a <code>value_Range</code> parameter.<br/>
     * Produces the SQL expression <code>UPPER(field)NOT BETWEEN UPPER(value) AND UPPER(value_Range)</code>. Value is "cinotbetween".
     **/
    CINOTBETWEEN: "cinotbetween",
    /**
     * Use of this Modifier assumes multiple <code>value</code> fields with different values.<br/>
     * Produces the SQL expression <code>field IN ( value1, value2, ..., valuen)</code><br/>
     * Note that this is the default Modifier used when multiple <code>value</code> fields exist. Value is "in".
     **/
    IN: "in",
    /**
     * Use of this Modifier assumes multiple <code>value</code> fields with different values.<br/>
     * Produces the SQL expression <code>UPPER(field) IN ( UPPER(value1), UPPER(value2), ..., UPPER(valuen))</code>
     **/
    CIIN: "ciin",
    /**
     * Use of this Modifier assumes multiple <code>value</code> fields with different values.<br/>
     * Produces the SQL expression <code>field NOT IN ( value1, value2, ..., valuen)</code>. Value is "notin".
     **/
    NOTIN: "notin",
    /**
     * Use of this Modifier assumes multiple <code>value</code> fields with different values.<br/>
     * Produces the SQL expression <code>UPPER(field) NOT IN ( UPPER(value1), UPPER(value2), ..., UPPER(valuen))</code>
     **/
    CINOTIN: "cinotin",
    /**
     * Produces the SQL expression <code>field & value > 0</code>. Value is "bitwiseor".<br/>
     * Useful for checking if any of a group of bits is set.
     **/
    BITWISE_OR: "bitwiseor",
    /**
     * Produces the SQL expression <code>field & value = value</code>. Value is "bitwiseand".<br/>
     * Useful for checking if all of a group of bits is set.
     **/
    BITWISE_AND: "bitwiseand",
    /**
     * Produces the SQL expression <code>field & value = 0</code>. Value is "bitwisenand".<br/>
     * Useful for checking if none of a group of bits is set.
     **/
    BITWISE_NAND: "bitwisenand",
    /**
     * By default, searches for a date value generate the following SQL filter <code>field between <00:00:00:000 of day> and <23:59:59:999 of day></code>.<br/>
     * This is for convenience so that date searches return any match on items that fall on that date.<br/>
     * However, if it is desired to find an exact match on a specific time of day as well as the date, this Modifier enforces that rule.<br/>
     * The SQL filter generated by this Modifier is <code>field = value</code>. Value is "exacttime".
     */
    EXACT_TIME: "exacttime",
    /**
     * Searches based on the string length of the given field.
     */
    LENGTH_LT: "length_lt",
    LENGTH_EQ: "length_eq",
    LENGTH_GT: "length_gt",
    /**
     * Used for DE queries that allow multiple values.<br/>
     * This Modifier requires that DE fields have all of the specified values. Value is "allof".
     */
    ALLOF: "allof",
    /**
     * Produces the SQL expression <code>field IS NULL</code>.<br/>
     * The <code>value</code> and <code>value_Mod</code> are both required, but the <code>value</code> is ignored. Value is "isnull".
     */
    ISNULL: "isnull",
    /**
     * Produces the SQL expression <code>field IS NOT NULL</code>.<br/>
     * The <code>value</code> and <code>value_Mod</code> are both required, but the <code>value</code> is ignored. Value is "notnull".
     */
    NOTNULL: "notnull",
    /**
     * Produces the SQL expression <code>field IS NULL OR field = ''</code>.<br/>
     * The <code>value</code> and <code>value_Mod</code> are both required, but the <code>value</code> is ignored. Value is "isblank".
     */
    ISBLANK: "isblank",
    /**
     * Produces the SQL expression <code>field IS NOT NULL AND field <> ''</code>.<br/>
     * The <code>value</code> and <code>value_Mod</code> are both required, but the <code>value</code> is ignored. Value is "notblank".
     */
    NOTBLANK: "notblank"
};
/* unused harmony export Operators */

/**
 * Aggregate functions which can be used with the AGGFUNC suffix.
 * @readonly
 * @enum {String}
 */
const Functions = {
    /**
     * Maximum value aggregate function.<br/>
     * Can only be used with the AGGFUNC suffix. Value is "max".
     */
    MAX: "max",
    /**
     * Minimum value aggregate function.<br/>
     * Can only be used with the AGGFUNC suffix. Value is "min".
     **/
    MIN: "min",
    /**
     * Average value aggregate function.<br/>
     * Can only be used with the AGGFUNC suffix. Value is "avg".
     **/
    AVG: "avg",
    /**
     * Summation aggregate function.
     * Can only be used with the AGGFUNC suffix. Value is "sum".
     **/
    SUM: "sum",
    /**
     * Count aggregate function.<br/>
     * Can only be used with the AGGFUNC suffix. Value is "count".
     **/
    COUNT: "count",
    /**
     * Standard Deviation aggregate function.<br/>
     * Can only be used with the AGGFUNC suffix. Value is "std".
     **/
    STD: "std",
    /**
     * Variance aggregate function.<br/>
     * Can only be used with the AGGFUNC suffix. Value is "var".
     **/
    VAR: "var",
    /**
     * Maximum value aggregate function (distinct mode).<br/>
     * Can only be used with the AGGFUNC suffix. Value is "dmax".
     **/
    DMAX: "dmax",
    /**
     * Minimum value aggregate function (distinct mode).<br/>
     * Can only be used with the AGGFUNC suffix. Value is "dmin".
     **/
    DMIN: "dmin",
    /**
     * Average value aggregate function (distinct mode).<br/>
     * Can only be used with the AGGFUNC suffix. Value is "davg".
     **/
    DAVG: "davg",
    /**
     * Summation aggregate function (distinct mode).<br/>
     * Can only be used with the AGGFUNC suffix. Value is "dsum".
     **/
    DSUM: "dsum",
    /**
     * Count aggregate function (distinct mode).<br/>
     * Can only be used with the AGGFUNC suffix. Value is "dcount".
     **/
    DCOUNT: "dcount",
    /**
     * Standard Deviation aggregate function (distinct mode).<br/>
     * Can only be used with the AGGFUNC suffix. Value is "dstd".
     **/
    DSTD: "dstd",
    /**
     * Variance aggregate function (distinct mode).<br/>
     * Can only be used with the AGGFUNC suffix. Value is "dvar".
     **/
    DVAR: "dvar"
};
/* unused harmony export Functions */



/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ApiFactory__ = __webpack_require__(1);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "ApiFactory", function() { return __WEBPACK_IMPORTED_MODULE_0__ApiFactory__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Api__ = __webpack_require__(0);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "Api", function() { return __WEBPACK_IMPORTED_MODULE_1__Api__["a"]; });
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
/**
 * Simplifies creation of API instances as singletons
 * @type {exports}
 */

/**
 * An Api class
 */



/***/ })
/******/ ]);
});
//# sourceMappingURL=workfront.js.map