var ctor = require('./constructor'),
    path_module = require('path'),
    Promise = require('promise');

ctor.prototype.search = function(objCode, query, fields) {
    return this.request(path_module.join(objCode, 'search'), query, fields, 'GET');
};