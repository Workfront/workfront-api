var Api = require('./../Api');

module.exports = function(Api) {
    /**
     * Used for object retrieval by multiple search criteria
     * @param {String} objCode
     * @param {Object} query    An object with search criteria
     * @param {Array} fields    Which fields to return
     * @return {Promise}
     */
    Api.prototype.search = function (objCode, query, fields) {
        return this.request(objCode + '/search', query, fields, 'GET');
    };
};