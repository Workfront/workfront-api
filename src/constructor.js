var path_module = require('path');

function Api(config) {
    this.httpOptions = {
        hostname: config.hostname,
        port: config.port || 80,
        path: '/attask/api',
        method: 'GET'
    };

    // Append version to hostname if provided
    if (config.version) {
        this.httpOptions.path = path_module.join(this.httpOptions.path, 'v' + config.version);
    }
}

module.exports = Api;