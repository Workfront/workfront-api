var ctor = require('./constructor'),
    path_module = require('path'),
    Promise = require('promise');

ctor.prototype.get = function(objCode, objID, fields) {
    return this.request(path_module.join(objCode, objID), null, fields, 'GET');
};