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
     * Used to obtain an API key
     * @memberOf Workfront.Api
     * @param {String} username    A username in Workfront
     * @param {String} password    Password to use
     * @return {Promise}    A promise which will resolved with API key if everything went ok and rejected otherwise
     */
    Api.prototype.getApiKey = function (username, password) {
        var that = this;
        return new Promise(function (resolve, reject) {
            if (typeof that.httpParams.apiKey !== 'undefined') {
                resolve(that.httpParams.apiKey);
            }
            else {
                that.execute('USER', null, 'getApiKey', {
                    username: username,
                    password: password
                }).then(function (data) {
                    that.httpParams.apiKey = data.result;
                    resolve(that.httpParams.apiKey);
                }, reject);
            }
        });
    };

    /**
     * Invalidates the current API key.
     * Call this to be able to retrieve a new one using getApiKey().
     * @memberOf Workfront.Api
     * @return {Promise}    A promise which will resolved if everything went ok and rejected otherwise
     */
    Api.prototype.clearApiKey = function () {
        return new Promise(function (resolve, reject) {
            this.execute('USER', null, 'clearApiKey').then(function (result) {
                if (result) {
                    delete this.httpParams.apiKey;
                    resolve();
                } else {
                    reject();
                }
            }.bind(this));
        }.bind(this));
    }
};