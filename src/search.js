var Api = require('./Api'),
    path_module = require('path');

module.exports = function(Api) {
    Api.prototype.search = function (objCode, query, fields) {
        return this.request(path_module.join(objCode, 'search'), query, fields, 'GET');
    };
};