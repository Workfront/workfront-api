module.exports = function(Api) {
    /**
     * Retrieves API metadata for an object.
     * @param {String} objCode    One of object codes from {@link https://developers.attask.com/api-docs/api-explorer/|AtTask API Explorer}
     * @return {Promise}    A promise which will resolved with object metadata if everything went ok and rejected otherwise
     */
    Api.prototype.metadata = function (objCode) {
        var path = '/metadata';
        if (objCode) {
            path = objCode + path;
        }
        return this.request(path, null, null, 'GET');
    };

    /**
     * Retrieves list of objects available in API
     * @return {Promise}    A promise which will resolved with object list if everything went ok and rejected otherwise
     */
    Api.prototype.objects = function () {
        return this.request('/metadata', null, null, 'GET');
    };
};