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
 */
module.exports = function(Api) {
    /**
     * Used to retrieve number of objects matching given search criteria
     * @memberOf Workfront.Api
     * @param {String} objCode
     * @param {Object} query    An object with search criteria
     * @return {Promise}
     */
    Api.prototype.count = function (objCode, query) {
        return this.request(objCode + '/count', query, null, Api.Methods.GET).then(function (data) {
            return data.count;
        });
    };
};