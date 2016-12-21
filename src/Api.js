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

var url = require('url'),
    http = require('http'),
    https = require('https');

/**
 * Creates new Api instance.
 * @param {Object} config   An object with the following keys:<br/>
 *     <code>url</code> {String} - Required. A url to Workfront server (for example: http://localhost:8080)<br/>
 *     <code>version</code> {String} - Optional. Which version of api to use. At the moment of writing can be 1.0, 2.0, 3.0, 4.0. Pass 'unsupported' to use Workfront latest API (maybe unstable).<br/>
 *     <code>alwaysUseGet</code> {Boolean} - Optional. Defaults to false. Will cause the api to make every request as a GET with params in the query string and add method=DESIRED_METHOD_TYPE in the query string. Some Workfront urls will have issues with PUT and DELETE calls if this value is false.<br/>
 *     <code>secureProtocol</code> {String} - Optional. Used only in https. The SSL method to use, e.g. TLSv1_method to force TLS version 1. The possible values depend on your installation of OpenSSL and are defined in the constant {@link http://www.openssl.org/docs/ssl/ssl.html#DEALING_WITH_PROTOCOL_METHODS|SSL_METHODS}.
 * @constructor
 * @memberOf Workfront
 */
function Api(config) {
    var parsed = url.parse(config.url),
        isHttps = parsed.protocol === 'https:';

    // Create the request
    this.httpTransport = isHttps ? https : http;

    this.httpOptions = {
        protocol: parsed.protocol,
        host: parsed.hostname,
        port: parsed.port || (isHttps ? 443 : 80),
        withCredentials: false,
        headers: {},
        //=== true to make undefined result in false
        alwaysUseGet : config.alwaysUseGet === true
    };

    // These params will be sent with each request
    this.httpParams = {};

    if (isHttps) {
        this.httpOptions.secureProtocol = config.secureProtocol || 'TLSv1_method';
        this.httpOptions.agent = false;
    }

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

Api.Methods = {
    GET: 'GET',
    PUT: 'PUT',
    DELETE: 'DELETE',
    POST: 'POST'
};

require('./plugins/apiKey')(Api);
require('./plugins/copy')(Api);
require('./plugins/count')(Api);
require('./plugins/create')(Api);
require('./plugins/edit')(Api);
require('./plugins/execute')(Api);
require('./plugins/get')(Api);
require('./plugins/login')(Api);
require('./plugins/logout')(Api);
require('./plugins/metadata')(Api);
require('./plugins/namedQuery')(Api);
require('./plugins/remove')(Api);
require('./plugins/report')(Api);
require('./plugins/request')(Api);
require('./plugins/search')(Api);
require('./plugins/setSessionID')(Api);

if(typeof(window)==='undefined'){
  //These plugins only work in node
  require('./plugins/upload')(Api);
}

module.exports = Api;
