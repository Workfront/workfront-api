module.exports = function(Api) {
    /**
     * Performs report request, where only the aggregate of some field is desired, with one or more groupings.
     * @param {String} objCode    One of object codes from {@link https://developers.attask.com/api-docs/api-explorer/|AtTask API Explorer}
     * @param {Object} query    An object with search criteria and aggregate functions
     * @return {Promise}    A promise which will resolved with results if everything went ok and rejected otherwise
     */
    Api.prototype.report = function (objCode, query) {
        return this.request(objCode + '/report', query, null, Api.Methods.GET);
    };
};