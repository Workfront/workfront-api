module.exports = function(Api) {

    /**
     * Executes a named query for the given obj code
     * @param {String} objCode    One of object codes from {@link https://developers.attask.com/api-docs/api-explorer/|AtTask API Explorer}
     * @param {String} query    A query to execute. A list of allowed named queries are available within the {@link https://developers.attask.com/api-docs/api-explorer/|AtTask API Explorer} under "actions" for each object.
     * @param {Object} [queryArgs]    Optional. Arguments for the action. See {@link https://developers.attask.com/api-docs/api-explorer/|AtTask API Explorer} for the list of valid arguments
     * @param {Object} fields    Which fields to return. See {@link https://developers.attask.com/api-docs/api-explorer/|AtTask API Explorer} for the list of available fields for the given objCode.
     * @returns {Promise}    A promise which will resolved with received data if everything went ok and rejected with error info otherwise
     */
    Api.prototype.namedQuery = function (objCode, query, queryArgs, fields) {
        return this.request(objCode + '/' + query, queryArgs, fields, Api.Methods.GET);
    };
};