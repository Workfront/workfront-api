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
 * @author Hovhannes Babayan <bhovhannes at gmail dot com>
 * @author Sassoun Derderian <citizen.sas at gmail dot com>
 */

var INTERNAL_PREFIX = require('workfront-api-constants/dist/umd/constants').INTERNAL_PREFIX;

module.exports = function(Api) {
    /**
     * Used for retrieve an object or multiple objects.
     * @memberOf Workfront.Api
     * @param {String} objCode    One of object codes from {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer}
     * @param {String|Array} objIDs    Either one or multiple object ids
     * @param {String|String[]} fields    Which fields to return. See {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer} for the list of available fields for the given objCode.
     * @return {Promise}    A promise which will resolved with results if everything went ok and rejected otherwise
     */
    Api.prototype.get = function (objCode, objIDs, fields) {
        if (typeof objIDs === 'string') {
            objIDs = [objIDs];
        }
        var endPoint = objCode,
            params = null;
        if (objIDs.length === 1) {
            if (objIDs[0].indexOf(INTERNAL_PREFIX) === 0) {
                params = {id: objIDs[0]};
            }
            else {
                endPoint += '/' + objIDs[0];
            }
        } else {
            params = {id: objIDs};
        }
        return this.request(endPoint, params, fields, Api.Methods.GET);
    };
};
