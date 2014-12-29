module.exports = function(Api) {
    /**
     * Used for object retrieval by multiple search criteria.
     * @param {String} objCode    One of object codes from {@link https://developers.attask.com/api-docs/api-explorer/|AtTask API Explorer}
     * @param {Object} query    An object with search criteria
     * @param {Array} fields    Which fields to return. See {@link https://developers.attask.com/api-docs/api-explorer/|AtTask API Explorer} for the list of available fields for the given objCode.
     * @return {Promise}    A promise which will resolved with search results if everything went ok and rejected otherwise
     */
    Api.prototype.search = function (objCode, query, fields) {
        return this.request(objCode + '/search', query, fields, 'GET');
    };
};