module.exports = function(Api) {
    /**
     * Used for retrieve an object or multiple objects.
     * @param {String} objCode    One of object codes from {@link https://developers.attask.com/api-docs/api-explorer/|AtTask API Explorer}
     * @param {String|Array} objIDs    Either one or multiple object ids
     * @param {Object} fields    Which fields to return. See {@link https://developers.attask.com/api-docs/api-explorer/|AtTask API Explorer} for the list of available fields for the given objCode.
     * @return {Promise}    A promise which will resolved with results if everything went ok and rejected otherwise
     */
    Api.prototype.get = function (objCode, objIDs, fields) {
        if (typeof objIDs === 'string') {
            objIDs = [objIDs];
        }
        if (objIDs.length === 1) {
            return this.request(objCode + '/' + objIDs[0], null, fields, Api.Methods.GET);
        } else {
            return this.request(objCode, {id: objIDs}, fields, Api.Methods.GET);
        }
    };
};