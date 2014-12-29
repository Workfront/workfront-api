var Api = require('./Api'),
    _instance;

/**
 * @name ApiFactory
 * @memberOf AtTask
 * @namespace
 */
module.exports = {
    /**
     * Returns an Api instance. Creates a new one if no instance exists.<br/>
     * One can use this if Api is intended to be used as singleton.
     * @memberOf AtTask.ApiFactory
     * @param {Object} config   An object with the following keys:<br/>
     *     <code>hostname</code> {String} - Required. A name of host to connect to<br/>
     *     <code>port</code> {String} - Optional. A port on host to connect to. Defaults to 80.<br/>
     *     <code>version</code> {String} - Optional. Which version of api to use. At the moment of writing can be 1.0, 2.0, 3.0, 4.0. Pass 'internal' to use AtTask internal API (this is the latest version, maybe unstable)
     * @param {Boolean} [returnNewInstance]    If true, always creates a new instance
     * @return {Api}
     */
    getInstance: function(config, returnNewInstance) {
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
            return _instance;
        }
    },

    /**
     * Removes previously created Api instance.
     * @memberOf AtTask.ApiFactory
     */
    deleteInstance: function() {
        _instance = undefined;
    }
};