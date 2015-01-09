module.exports = function(Api) {
    /**
     * Edits an existing object
     * @param {String} objCode    One of object codes from {@link https://developers.attask.com/api-docs/api-explorer/|AtTask API Explorer}
     * @param {String} objID    ID of object to modify
     * @param {Object} updates    Which fields to set. See {@link https://developers.attask.com/api-docs/api-explorer/|AtTask API Explorer} for the list of available fields for the given objCode.
     * @param {Object} [fields]    Which fields to return. See {@link https://developers.attask.com/api-docs/api-explorer/|AtTask API Explorer} for the list of available fields for the given objCode.
     * @return {Promise}    A promise which will resolved with results if everything went ok and rejected otherwise
     */
    Api.prototype.edit = function (objCode, objID, updates, fields) {
        var params = {
            updates: JSON.stringify(updates)
        };
        return this.request(objCode + '/' + objID, params, fields, Api.Methods.PUT);
    };
};