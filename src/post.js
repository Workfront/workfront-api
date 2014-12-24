var Api = require('./Api');

module.exports = function(Api) {
    Api.prototype.post = function (objCode, params, fields) {
        return this.request(objCode, params, fields, 'POST');
    };
};