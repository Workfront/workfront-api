var Api = require('./../Api');

module.exports = function(Api) {
    /**
     * Used for retrieve an object or multiple objects.
     * @param {String} objCode
     * @param {String|Array} objIDs    Either one or multiple object ids
     * @param {Object} fields
     * @return {Promise}
     */
    Api.prototype.get = function (objCode, objIDs, fields) {
        if (typeof objIDs === 'string') {
            objIDs = [objIDs];
        }
        if (objIDs.length === 1) {
            return this.request(objCode + '/' + objIDs[0], null, fields, 'GET');
        } else {
            return this.request(objCode, {id: objIDs}, fields, 'GET');
        }
    };
};