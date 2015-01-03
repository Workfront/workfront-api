module.exports = function(Api) {

    /**
     * Executes an action for the given object
     * @param {String} objCode    One of object codes from {@link https://developers.attask.com/api-docs/api-explorer/|AtTask API Explorer}
     * @param {String} objID    ID of object
     * @param {String} action    An action to execute. A list of allowed named queries are available within the {@link https://developers.attask.com/api-docs/api-explorer/|AtTask API Explorer} under "actions" for each object.
     * @param {Object} [actionArgs]    Optional. Arguments for the action. See {@link https://developers.attask.com/api-docs/api-explorer/|AtTask API Explorer} for the list of valid arguments
     * @returns {Promise}    A promise which will resolved if everything went ok and rejected otherwise
     */
    Api.prototype.execute = function (objCode, objID, action, actionArgs) {
        return this.request(objCode + '/' + objID + '/' + action, actionArgs, null, 'PUT');
    };
};