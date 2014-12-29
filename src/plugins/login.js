module.exports = function(Api) {
    /**
     * Logs in into AtTask. Should be a first call to AtTask API.
     * Other calls should be made after this one will be completed.
     * @param {String} username    A username in AtTask
     * @param {String} password    Password to use
     * @return {Promise}    A promise which will resolved with logged in user data if everything went ok and rejected otherwise
     */
    Api.prototype.login = function (username, password) {
        var that = this;
        return new Promise(function (resolve, reject) {
            that.request('login', {username: username, password: password}, null, 'POST')
                .then(function (data) {
                    that.httpOptions.headers = that.httpOptions.headers || {};
                    that.httpOptions.headers.sessionID = data.sessionID;
                    resolve(data);
                }, reject);
        });
    };
};