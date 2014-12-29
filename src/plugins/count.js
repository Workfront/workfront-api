module.exports = function(Api) {
    /**
     * Used to retrieve number of objects matching given search criteria
     * @param {String} objCode
     * @param {Object} query    An object with search criteria
     * @return {Promise}
     */
    Api.prototype.count = function (objCode, query) {
        var that = this;
        return new Promise(function (resolve, reject) {
            that.request(objCode + '/count', query, null, 'GET')
                .then(function (data) {
                    resolve(data.count);
                }, reject);
        });
    };
};