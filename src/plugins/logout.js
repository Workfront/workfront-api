module.exports = function(Api) {
    /**
     * Logs out from AtTask
     * @return {Promise}    A promise which will resolved with <code>true</code> if everything went ok and rejected otherwise
     */
    Api.prototype.logout = function () {
        var that = this;
        return new Promise(function (resolve, reject) {
            that.request('logout', null, null, 'GET').then(function (result) {
                if (result) {
                    delete that.httpOptions.headers.sessionID;
                    resolve(result.success);
                } else {
                    reject(false);
                }
            });
        });
    };
};