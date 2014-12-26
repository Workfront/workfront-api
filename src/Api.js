/**
 * Creates new Api instance. Accepts configuration object with the following keys:
 *     hostname {String} - Required. A name of host to connect to
 *     port {String} - Optional. A port on host to connect to. Defaults to 80.
 *     version {String} - Optional. Which version of api to use.
 *                        At the moment of writing can be 1.0, 2.0, 3.0, 4.0, 5.0.
 *                        Pass 'internal' to use AtTask internal API (this is the latest version, maybe unstable)
 * @param {Object} config
 * @constructor
 */
function Api(config) {
    this.httpOptions = {
        hostname: config.hostname,
        port: config.port || 80,
        method: 'GET',
        withCredentials: false
    };

    // Append version to path if provided
    var path;
    if (config.version === 'internal') {
        path = '/attask/api-internal'
    }
    else {
        path = '/attask/api';
        if (config.version) {
            path = path + '/v' + config.version;
        }
    }
    this.httpOptions.path = path;
}

var plugins = [
    'request',
    'login',
    'logout',
    'search',
    'get',
    'post'
];
for(var i=0; i<plugins.length; ++i) {
    require('./plugins/' + plugins[i])(Api);
}

module.exports = Api;