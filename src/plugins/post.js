var Api = require('./../Api');

module.exports = function(Api) {
    /**
     * Inserts a new object
     * @param {String} objCode
     * @param {Object} params
     * @param {String[]} [fields]    Which fields of newly created object to return
     * @returns {Promise}    A promise which will resolved with the ID and any other specified fields of newly created object
     */
    Api.prototype.post = function (objCode, params, fields) {
        return this.request(objCode, params, fields, 'POST');
    };
};