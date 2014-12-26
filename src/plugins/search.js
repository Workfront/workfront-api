var Api = require('./../Api');

module.exports = function(Api) {
    Api.prototype.search = function (objCode, query, fields) {
        return this.request(objCode + '/search', query, fields, 'GET');
    };
};