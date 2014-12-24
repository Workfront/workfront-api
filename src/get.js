var Api = require('./Api'),
    path_module = require('path');

module.exports = function(Api) {
    Api.prototype.get = function (objCode, objID, fields) {
        return this.request(path_module.join(objCode, objID), null, fields, 'GET');
    };
};