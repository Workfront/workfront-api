module.exports = function(Api) {
    /**
     * Starting from version 2.0 API allows users to upload files.
     * The server will return the JSON data which includes 'handle' of uploaded file.
     * Returned 'handle' can be passed to create() method to create a new document.
     * @param {fs.ReadStream} stream    A readable stream with file contents
     */
    Api.prototype.upload = function (stream) {
        throw new Error('Not implemented')
    };
};