var Api = require('./Api');

module.exports = function(Api) {
    /**
     * Inserts a new object
     * @param {String} objCode
     * @param {Object} params
     * @param {Object} fields
     * @returns {Object}    A newly created object along with its new ID and any other fields specified
     */
    Api.prototype.post = function (objCode, params, fields) {
        return this.request(objCode, params, fields, 'POST');
    };
};