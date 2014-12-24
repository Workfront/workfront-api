var Api = require('./Api'),
    Promise = require('promise');

module.exports = function(Api) {
    Api.prototype.logout = function () {
        var that = this;
        return new Promise(function (resolve, reject) {
            that.request('logout', {sessionID: that.httpOptions.headers.sessionID}).then(function (result) {
                if (result) {
                    resolve(result.success);
                } else {
                    reject(false);
                }
            });
        });
    };
};