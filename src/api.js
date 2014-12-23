var Api = require('./constructor'),
    _instance;

require('./request');
require('./login');
require('./logout');
require('./search');
require('./get');
require('./post');

var getInstance = function(config, returnNewInstance) {
    if (returnNewInstance) {
        return new Api(config);
    }
    else {
        if (!_instance) {
            if (typeof config !== 'object') {
                throw new Error('Please provide configuration as an object.');
            }
            _instance = new Api(config);
        }
        else if (typeof config !== 'undefined') {
            throw new Error('To create a new instance you have to pass a second argument (true).');
        }

        return _instance;
    }
};

module.exports = {
    getInstance: getInstance
};
