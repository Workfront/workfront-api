var ctor = require('./constructor'),
    path_module = require('path'),
    Promise = require('promise');

ctor.prototype.post = function(objCode, params, fields) {
    return this.request(objCode, params, fields, 'POST');
};