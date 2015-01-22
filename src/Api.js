var url = require('url'),
    http = require('http'),
    https = require('https');

/**
 * Creates new Api instance.
 * @param {Object} config   An object with the following keys:<br/>
 *     <code>url</code> {String} - Required. An url to AtTask server (for example: http://localhost:8080)<br/>
 *     <code>version</code> {String} - Optional. Which version of api to use. At the moment of writing can be 1.0, 2.0, 3.0, 4.0. Pass 'unsupported' to use AtTask latest API (maybe unstable).
 *     <code>secureProtocol</code> {String} - Optional. Used only in https. The SSL method to use, e.g. TLSv1_method to force TLS version 1. The possible values depend on your installation of OpenSSL and are defined in the constant {@link http://www.openssl.org/docs/ssl/ssl.html#DEALING_WITH_PROTOCOL_METHODS|SSL_METHODS}.
 * @constructor
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
        headers: {}
    };

    if (isHttps) {
        this.httpOptions.secureProtocol = config.secureProtocol || 'TLSv1_method';
        this.httpOptions.agent = false;
    }

    // Append version to path if provided
    var path;
    if (config.version === 'internal' || config.version === 'unsupported') {
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

require('./plugins/request')(Api);
require('./plugins/login')(Api);
require('./plugins/logout')(Api);
require('./plugins/search')(Api);
require('./plugins/get')(Api);
require('./plugins/create')(Api);
require('./plugins/edit')(Api);
require('./plugins/remove')(Api);
require('./plugins/report')(Api);
require('./plugins/count')(Api);
require('./plugins/copy')(Api);
require('./plugins/upload')(Api);
require('./plugins/execute')(Api);
require('./plugins/namedQuery')(Api);
require('./plugins/metadata')(Api);

module.exports = Api;