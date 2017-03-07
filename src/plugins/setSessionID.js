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
     * Sets a sessionID in the headers or removes sessionID if passed argument is undefined
     * @memberOf Workfront.Api
     * @param {String|undefined} sessionID   sessionID to set
     */
    Api.prototype.setSessionID = function (sessionID) {
        if (sessionID) {
            this.httpOptions.headers.sessionID = sessionID;
        }
        else {
            delete this.httpOptions.headers.sessionID;
        }
    };
};
