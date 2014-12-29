var queryString = require('querystring'),
    http = require('http'),
    util = require('util');

module.exports = function(Api) {
    Api.prototype.request = function(path, params, fields, method) {
        params = params || {};
        fields = fields || [];
        method = method || this.httpOptions.method;

        var options = {};
        util._extend(options, this.httpOptions);
        options.method = method;
        options.path = this.httpOptions.path + '/' + path;

        if (fields.length !== 0) {
            params.fields = fields.join();
        }

        options.path += '?' + queryString.stringify(params);

        return new Promise(function (resolve, reject) {
            /*options = {
                hostname: 'echo.jsontest.com',
                port: 80,
                path: '/data/123',
                withCredentials: false
            };*/

            var request = http.request(options, function (response) {
                var body = '';
                if (typeof response.setEncoding === 'function') {
                    response.setEncoding('utf8');
                }
                response.on('data', function (chunk) {
                    body += chunk;
                });
                response.on('end', function () {
                    var data = JSON.parse(body);
                    if (data.error) {
                        reject(data);
                    } else {
                        resolve(data.data);
                    }
                });
            });
            request.on('error', reject);
            request.end();
        });
    };
};

