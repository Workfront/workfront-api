function Api(config) {
    this.httpOptions = {
        hostname: config.hostname,
        port: config.port || 80,
        path: '/attask/api',
        method: 'GET',
        withCredentials: false
    };

    // Append version to hostname if provided
    if (config.version) {
        this.httpOptions.path = this.httpOptions.path + '/v' + config.version;
    }
}

require('./request')(Api);
require('./login')(Api);
require('./logout')(Api);
require('./search')(Api);
require('./get')(Api);
require('./post')(Api);

module.exports = Api;