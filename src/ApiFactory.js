var Api = require('./Api'),
    _instance;

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

var deleteInstance = function() {
    _instance = undefined;
};

module.exports = {
    getInstance: getInstance,
    deleteInstance: deleteInstance
};
