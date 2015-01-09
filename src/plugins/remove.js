module.exports = function(Api) {

    /**
     * Deletes an object
     * @param {String} objCode    One of object codes from {@link https://developers.attask.com/api-docs/api-explorer/|AtTask API Explorer}
     * @param {String} objID    ID of object
     * @param {Boolean} [bForce]    Pass true to cause the server to remove the specified data and its dependants
     * @returns {Promise}    A promise which will resolved if everything went ok and rejected otherwise
     */
    Api.prototype.remove = function (objCode, objID, bForce) {
        var that = this;
        return new Promise(function (resolve, reject) {
            var params = bForce ? {force: true} : null;
            that.request(objCode + '/' + objID, params, null, Api.Methods.DELETE).then(function (result) {
                if (result && result.success) {
                    resolve();
                } else {
                    reject();
                }
            }, reject);
        });
    };
};