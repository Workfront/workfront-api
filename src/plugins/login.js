var Api = require('./../Api');

module.exports = function(Api) {
    Api.prototype.login = function (username, password) {
        var that = this;
        return new Promise(function (resolve, reject) {
            that.request('login', {username: username, password: password}, null, 'POST')
                .then(function (data) {
                    that.httpOptions.headers = {sessionID: data.sessionID};
                    resolve(data);
                }, reject);
        });
    };
};