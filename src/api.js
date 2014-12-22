var http = require('http'),
    path_module = require('path'),
    queryString = require('querystring'),
    Promise = require('promise'),
    _ = require('lodash');

var API = function(hostname, version) {
    this.httpOptions = {
        hostname: 'localhost',
        port: 8080,
        path: '/attask/api',
        method: 'GET'
    };

    // Append version to hostname if provided
    if (version) {
        this.httpOptions.path = path_module.join(this.httpOptions.path, 'v' + version);
    }
};

API.prototype.request = function(path, params, fields, method) {
    params = params || {};
    fields = fields || [];
    method = method || this.httpOptions.method;

    var options = {};
    _.assign(options, this.httpOptions);
    options.method = method;
    options.path = path_module.join(this.httpOptions.path, path);

    if (fields.length !== 0) {
        _.assign(params, {fields: fields.join()});
    }
    options.path += '?' + queryString.stringify(params);

    return new Promise(function(resolve, reject){
        var req = http.request(options, function(res) {
            var body = '';
            res.setEncoding('utf8');
            res.on('data', function(chunk) {
                body += chunk;
            });
            res.on('end', function() {
                var data = JSON.parse(body);
                if(data.error) {
                    reject(data);
                } else {
                    resolve(data.data);
                }
            });
        });
        req.on('error', reject);
        req.end();
    });
};

API.prototype.login = function(username, password) {
    var that = this;
    return new Promise(function(resolve, reject) {
        that.request('login', {username: username, password: password}, null, 'POST')
            .then(function(data) {
                that.httpOptions.headers = {sessionID: data.sessionID};
                resolve(data);
            }, reject);
    });
};

API.prototype.logout = function() {
    var that = this;
    this.request('logout', {sessionID : this.httpOptions.headers.sessionID});
    this.httpOptions.headers.sessionID = null;
};

API.prototype.get = function() {
    this.request('user/search', null, ['name']).then(console.log, console.error);
};

module.exports = API;