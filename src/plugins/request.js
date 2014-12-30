var queryString = require('querystring'),
    util = require('util');

module.exports = function(Api) {
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
            options.path += '?' + params;
        }

        var httpTransport = this.httpTransport;

        return new Promise(function (resolve, reject) {
            /*options = {
                url: 'http://echo.jsontest.com',
                path: '/data/123',
                withCredentials: false
            };*/

            var request = httpTransport.request(options, function (response) {
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

