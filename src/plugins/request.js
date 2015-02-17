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

var queryString = require('querystring'),
    util = require('util');

module.exports = function(Api) {
    var requestHasData = function(method) {
        return method !== Api.Methods.GET && method !== Api.Methods.PUT;
    };

    Api.prototype.request = function(path, params, fields, method) {
        params = params || {};
        fields = fields || [];

        var options = {};
        util._extend(options, this.httpOptions);
        options.method = method;
        if (path.indexOf('/') === 0) {
            options.path = this.httpOptions.path + path;
        }
        else {
            options.path = this.httpOptions.path + '/' + path;
        }

        if (fields.length !== 0) {
            params.fields = fields.join();
        }

        params = queryString.stringify(params);
        if (params) {
            if (requestHasData(options.method)) {
                options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
                options.headers['Content-Length'] = params.length;
            }
            else {
                options.path += '?' + params;
            }
        }

        var httpTransport = this.httpTransport;

        return new Promise(function (resolve, reject) {
            var request = httpTransport.request(options, function (response) {
                var body = '';
                if (typeof response.setEncoding === 'function') {
                    response.setEncoding('utf8');
                }
                response.on('data', function (chunk) {
                    body += chunk;
                });
                response.on('end', function () {
                    var data;
                    try {
                        data = JSON.parse(body);
                    }
                    catch(e) {
                        reject(body);
                        return;
                    }
                    if (data.error) {
                        reject(data);
                    } else {
                        resolve(data.data);
                    }
                });
            });
            request.on('error', reject);
            if (params && requestHasData(options.method)) {
                request.write(params);
            }
            request.end();
        });
    };
};

