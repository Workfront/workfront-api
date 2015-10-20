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

var FormData = require('form-data'),
    util = require('util');

/**
 * @author Hovhannes Babayan <bhovhannes at gmail dot com>
 * @author Matt Winchester <mwinche at gmail dot com>
 */
module.exports = function(Api) {
    /**
     * Starting from version 2.0 API allows users to upload files.
     * The server will return the JSON data which includes 'handle' of uploaded file.
     * Returned 'handle' can be passed to create() method to create a new document.
     * This method is not available for browser execution environments and it is available only for Node.
     * @memberOf Workfront.Api
     * @param {fs.ReadStream} stream    A readable stream with file contents
     * @param {Object} [overrides] Override the filename and content type (using keys
     * `filename` and `contentType` respectively).
     */
    Api.prototype.upload = function(stream, overrides) {
        var form = new FormData();
        form.append('uploadedFile', stream, overrides);

        var options = {
          method: 'POST'
        };

        util._extend(options, this.httpOptions);
        options.headers = form.getHeaders();
        options.headers.sessionID = this.httpOptions.headers.sessionID;
        options.path += '/upload';

        delete options.headers['Content-Length'];

        var httpTransport = this.httpTransport;

        return new Promise(function (resolve, reject) {
            var request = httpTransport.request(options, this._handleResponse(resolve, reject));

            form.pipe(request);

            request.on('error', reject);
        }.bind(this));
    };
};
