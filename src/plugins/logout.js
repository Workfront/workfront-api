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
module.exports = function(Api) {
    /**
     * Logs out from Workfront
     * @memberOf Workfront.Api
     * @return {Promise}    A promise which will resolved if everything went ok and rejected otherwise
     */
    Api.prototype.logout = function () {
        return new Promise(function (resolve, reject) {
            this.request('logout', null, null, Api.Methods.GET).then(function (result) {
                if (result && result.success) {
                    delete this.httpOptions.headers.sessionID;
                    resolve();
                } else {
                    reject();
                }
            }.bind(this));
        }.bind(this));
    };
};