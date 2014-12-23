var ctor = require('./constructor'),
    Promise = require('promise');

ctor.prototype.logout = function() {
    var that = this;
    return new Promise(function(resolve, reject){
        that.request('logout', {sessionID : that.httpOptions.headers.sessionID}).then(function(result){
            if(result) {
                resolve(result.success);
            } else {
                reject(false);
            }
        });
    });
};