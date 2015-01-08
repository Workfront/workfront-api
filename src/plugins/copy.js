module.exports = function(Api) {
    /**
     * Copies an existing object with making changes on a copy.
     * Copying is supported only for some objects. The {@link https://developers.attask.com/api-docs/api-explorer/|AtTask API Explorer} page displays which objects support the Copy action.
     * @param {String} objCode    One of object codes from {@link https://developers.attask.com/api-docs/api-explorer/|AtTask API Explorer}
     * @param {String} objID    ID of object to copy
     * @param {Object} updates    Which fields to set on copied object. See {@link https://developers.attask.com/api-docs/api-explorer/|AtTask API Explorer} for the list of available fields for the given objCode.
     * @param {Object} [fields]    Which fields to return. See {@link https://developers.attask.com/api-docs/api-explorer/|AtTask API Explorer} for the list of available fields for the given objCode.
     * @return {Promise}    A promise which will resolved with results if everything went ok and rejected otherwise
     */
    Api.prototype.copy = function (objCode, objID, updates, fields) {
        var params = {
            copySourceID: objID
        };
        if (updates) {
            params.updates = JSON.stringify(updates);
        }
        return this.request(objCode, params, fields, 'POST');
    };
};