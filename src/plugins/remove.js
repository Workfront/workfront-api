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
     * Deletes an object
     * @memberOf Workfront.Api
     * @param {String} objCode    One of object codes from {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer}
     * @param {String} objID    ID of object
     * @param {Boolean} [bForce]    Pass true to cause the server to remove the specified data and its dependants
     * @returns {Promise}    A promise which will resolved if everything went ok and rejected otherwise
     */
    Api.prototype.remove = function (objCode, objID, bForce) {
        return new Promise(function (resolve, reject) {
            var params = bForce ? {force: true} : null;
            this.request(objCode + '/' + objID, params, null, Api.Methods.DELETE).then(function (result) {
                if (result && result.success) {
                    resolve();
                } else {
                    reject();
                }
            }, reject);
        }.bind(this));
    };
};