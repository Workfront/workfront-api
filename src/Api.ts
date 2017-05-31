/**
 * Copyright 2015 Workfront
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @author Hovhannes Babayan <bhovhannes at gmail dot com>
 * @author Sassoun Derderian <citizen.sas at gmail dot com>
 */

import * as NodeFormData from 'form-data'
import 'isomorphic-fetch'
import * as stream from 'stream'
import {INTERNAL_PREFIX} from 'workfront-api-constants'

export type THttpParams = any
export interface IHttpOptions {
    path?: string
    method?: string
    url: string
    alwaysUseGet?: boolean
    headers: {sessionID?: string}
}
export type TFields = string | string[]

const GlobalScope = Function('return this')()

/**
 * Creates new Api instance.
 * @param {Object} config   An object with the following keys:<br/>
 *     <code>url</code> {String} - Required. A url to Workfront server (for example: http://localhost:8080)<br/>
 *     <code>version</code> {String} - Optional. Which version of api to use. At the moment of writing can be 1.0, 2.0, 3.0, 4.0. Pass 'unsupported' to use Workfront latest API (maybe unstable).<br/>
 *     <code>alwaysUseGet</code> {Boolean} - Optional. Defaults to false. Will cause the api to make every request as a GET with params in the query string and add method=DESIRED_METHOD_TYPE in the query string. Some Workfront urls will have issues with PUT and DELETE calls if this value is false.<br/>
 *     <code>secureProtocol</code> {String} - Optional. Used only in https. The SSL method to use, e.g. TLSv1_method to force TLS version 1. The possible values depend on your installation of OpenSSL and are defined in the constant {@link http://www.openssl.org/docs/ssl/ssl.html#DEALING_WITH_PROTOCOL_METHODS|SSL_METHODS}.
 * @constructor
 */
export class Api {
    static Methods = {
        GET: 'GET',
        PUT: 'PUT',
        DELETE: 'DELETE',
        POST: 'POST'
    }

    _httpOptions: IHttpOptions
    _httpParams: THttpParams = {}

    constructor(config) {
        this._httpOptions = {
            url: config.url,
            headers: {}
        }
        // Append version to path if provided
        let path
        if (['internal', 'unsupported', 'asp'].indexOf(config.version) >= 0) {
            path = '/attask/api-' + config.version
        }
        else {
            path = '/attask/api'
            if (config.version) {
                path = path + '/v' + config.version
            }
        }
        this._httpOptions.path = path
    }

    /**
     * Used to obtain an API key
     * @memberOf Api
     * @param {String} username    A username in Workfront
     * @param {String} password    Password to use
     * @return {Promise}    A promise which will resolved with API key if everything went ok and rejected otherwise
     */
    getApiKey(username: string, password: string): Promise<string> {
        return new Promise((resolve, reject) => {
            if (typeof this._httpParams.apiKey !== 'undefined') {
                resolve(this._httpParams.apiKey)
            }
            else {
                this.request('USER', {
                    method: Api.Methods.PUT,
                    action: 'getApiKey',
                    username: username,
                    password: password
                }).then((data) => {
                    this._httpParams.apiKey = data.result
                    resolve(this._httpParams.apiKey)
                }, reject)
            }
        })
    }

    /**
     * Copies an existing object with making changes on a copy.
     * Copying is supported only for some objects. The {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer} page displays which objects support the Copy action.
     * @memberOf Api
     * @param {String} objCode    One of object codes from {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer}
     * @param {String} objID    ID of object to copy
     * @param {Object} updates    Which fields to set on copied object. See {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer} for the list of available fields for the given objCode.
     * @param {String|String[]} [fields]    Which fields to return. See {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer} for the list of available fields for the given objCode.
     * @return {Promise}    A promise which will resolved with results if everything went ok and rejected otherwise
     */
    copy(objCode: string, objID: string, updates: object, fields?: TFields) {
        const params: {
            copySourceID: string,
            updates?: object
        } = {
            copySourceID: objID
        }
        if (updates) {
            params.updates = updates
        }
        return this.request(objCode, params, fields, Api.Methods.POST)
    }

    /**
     * Used to retrieve number of objects matching given search criteria
     * @memberOf Api
     * @param {String} objCode
     * @param {[Object]} query    An object with search criteria
     * @return {Promise}
     */
    count(objCode: string, query?: object): Promise<number> {
        return this.request(objCode + '/count', query, null, Api.Methods.GET).then(function(data) {
            return data.count
        })
    }

    /**
     * Invalidates the current API key.
     * Call this to be able to retrieve a new one using getApiKey().
     * @memberOf Api
     * @return {Promise}    A promise which will resolved if everything went ok and rejected otherwise
     */
    clearApiKey() {
        return new Promise((resolve, reject) => {
            this.execute('USER', null, 'clearApiKey').then((result) => {
                if (result) {
                    delete this._httpParams.apiKey
                    resolve()
                } else {
                    reject()
                }
            })
        })
    }

    /**
     * Creates a new object.
     * @memberOf Api
     * @param {String} objCode    One of object codes from {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer}
     * @param {Object} params    Values of fields to be set for the new object. See {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer} for the list of available fields for the given objCode.
     * @param {String|String[]} [fields]    Which fields of newly created object to return. See {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer} for the list of available fields for the given objCode.
     * @returns {Promise}    A promise which will resolved with the ID and any other specified fields of newly created object
     */
    create(objCode: string, params: object, fields?: TFields) {
        return this.request(objCode, params, fields, Api.Methods.POST)
    }

    /**
     * Edits an existing object
     * @memberOf Api
     * @param {String} objCode    One of object codes from {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer}
     * @param {String} objID    ID of object to modify
     * @param {Object} updates    Which fields to set. See {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer} for the list of available fields for the given objCode.
     * @param {String|String[]} [fields]    Which fields to return. See {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer} for the list of available fields for the given objCode.
     * @return {Promise}    A promise which will resolved with results if everything went ok and rejected otherwise
     */
    edit(objCode: string, objID: string, updates: object, fields?: TFields) {
        return this.request(objCode + '/' + objID, updates, fields, Api.Methods.PUT)
    }

    /**
     * Executes an action for the given object
     * @memberOf Api
     * @param {String} objCode    One of object codes from {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer}
     * @param {String|null} objID    ID of object. Optional, pass null or undefined to omit
     * @param {String} action    An action to execute. A list of allowed actions are available within the {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer} under "actions" for each object.
     * @param {Object} [actionArgs]    Optional. Arguments for the action. See {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer} for the list of valid arguments
     * @returns {Promise}    A promise which will resolved if everything went ok and rejected otherwise
     */
    execute(objCode: string, objID: string | null, action: string, actionArgs?: object) {
        let endPoint = objCode
        if (objID) {
            endPoint += '/' + objID + '/' + action
        }
        else {
            endPoint += '?method=' + Api.Methods.PUT + '&action=' + action
        }
        const JSONstringifiedArgs = JSON.stringify(actionArgs)
        let params = null
        if (JSONstringifiedArgs) {
            params = {
                updates: JSONstringifiedArgs
            }
        }
        return this.request(endPoint, params, null, Api.Methods.POST)
    }

    /**
     * Used for retrieve an object or multiple objects.
     * @memberOf Api
     * @param {String} objCode    One of object codes from {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer}
     * @param {String|Array} objIDs    Either one or multiple object ids
     * @param {String|String[]} fields    Which fields to return. See {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer} for the list of available fields for the given objCode.
     * @return {Promise}    A promise which will resolved with results if everything went ok and rejected otherwise
     */
    get(objCode: string, objIDs: string | string[], fields?: TFields) {
        if (typeof objIDs === 'string') {
            objIDs = [objIDs]
        }
        let endPoint = objCode,
            params = null
        if (objIDs.length === 1) {
            if (objIDs[0].indexOf(INTERNAL_PREFIX) === 0) {
                params = {id: objIDs[0]}
            }
            else {
                endPoint += '/' + objIDs[0]
            }
        } else {
            params = {id: objIDs}
        }
        return this.request(endPoint, params, fields, Api.Methods.GET)
    }

    /**
     * Logs in into Workfront. Should be a first call to Workfront API.
     * Other calls should be made after this one will be completed.
     * @memberOf Api
     * @param {String} username    A username in Workfront
     * @param {String} password    Password to use
     * @return {Promise}    A promise which will resolved with logged in user data if everything went ok and rejected otherwise
     */
    login(username: string, password: string) {
        return this.request('login', {username: username, password: password}, null, Api.Methods.POST).then((data) => {
            this.setSessionID(data.sessionID)
            return data
        })
    }

    /**
     * Logs out from Workfront
     * @memberOf Api
     * @return {Promise}    A promise which will resolved if everything went ok and rejected otherwise
     */
    logout(): Promise<undefined> {
        return new Promise((resolve, reject) => {
            this.request('logout', null, null, Api.Methods.GET).then((result) => {
                if (result && result.success) {
                    delete this._httpOptions.headers.sessionID
                    resolve()
                } else {
                    reject()
                }
            })
        })
    }

    /**
     * Retrieves API metadata for an object.
     * @memberOf Api
     * @param {String} [objCode]    One of object codes from {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer}. If omitted will return list of objects available in API.
     * @return {Promise}    A promise which will resolved with object metadata if everything went ok and rejected otherwise
     */
    metadata(objCode?: string) {
        let path = '/metadata'
        if (objCode) {
            path = objCode + path
        }
        return this.request(path, null, null, Api.Methods.GET)
    }

    /**
     * Executes a named query for the given obj code
     * @memberOf Api
     * @param {String} objCode    One of object codes from {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer}
     * @param {String} query    A query to execute. A list of allowed named queries are available within the {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer} under "actions" for each object.
     * @param {Object} [queryArgs]    Optional. Arguments for the action. See {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer} for the list of valid arguments
     * @param {String|String[]} fields    Which fields to return. See {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer} for the list of available fields for the given objCode.
     * @returns {Promise}    A promise which will resolved with received data if everything went ok and rejected with error info otherwise
     */
    namedQuery(objCode: string, query: string, queryArgs?: object, fields?: TFields) {
        return this.request(objCode + '/' + query, queryArgs, fields, Api.Methods.GET)
    }

    /**
     * Deletes an object
     * @memberOf Api
     * @param {String} objCode    One of object codes from {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer}
     * @param {String} objID    ID of object
     * @param {Boolean} [bForce]    Pass true to cause the server to remove the specified data and its dependants
     * @returns {Promise}    A promise which will resolved if everything went ok and rejected otherwise
     */
    remove(objCode: string, objID: string, bForce?: boolean): Promise<undefined> {
        return new Promise((resolve, reject) => {
            const params = bForce ? {force: true} : null
            this.request(objCode + '/' + objID, params, null, Api.Methods.DELETE).then((result) => {
                if (result && result.success) {
                    resolve()
                } else {
                    reject()
                }
            }, reject)
        })
    }

    /**
     * Performs report request, where only the aggregate of some field is desired, with one or more groupings.
     * @memberOf Api
     * @param {String} objCode    One of object codes from {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer}
     * @param {Object} query    An object with search criteria and aggregate functions
     * @return {Promise}    A promise which will resolved with results if everything went ok and rejected otherwise
     */
    report(objCode: string, query: object) {
        return this.request(objCode + '/report', query, null, Api.Methods.GET)
    }

    request(path: string, params: THttpParams, fields?: TFields, method: string = Api.Methods.GET): Promise<any> {
        params = Object.assign(params || {}, this._httpParams)

        const alwaysUseGet = this._httpOptions.alwaysUseGet

        const options = Object.assign({}, this._httpOptions)
        if (alwaysUseGet) {
            params.method = method
        } else {
            options.method = method
        }

        if (path.indexOf('/') === 0) {
            options.path = this._httpOptions.path + path
        }
        else {
            options.path = this._httpOptions.path + '/' + path
        }

        fields = fields || []
        if (typeof fields === 'string') {
            fields = [fields]
        }
        if (fields.length !== 0) {
            params.fields = fields.join()
        }

        const headers = new Headers()
        if (this._httpOptions.headers.sessionID) {
            headers.append('sessionID', this._httpOptions.headers.sessionID)
        }

        let bodyParams = null, queryString = ''
        if (NodeFormData && params instanceof NodeFormData) {
            bodyParams = params
        }
        else if (GlobalScope.FormData && params instanceof GlobalScope.FormData) {
            bodyParams = params
        }
        else {
            headers.append('Content-Type', 'application/x-www-form-urlencoded')
            bodyParams = Object.keys(params).reduce(function(a, k) {
                a.push(k + '=' + encodeURIComponent(params[k]))
                return a
            }, []).join('&')
            if (method === Api.Methods.GET) {
                if (bodyParams) {
                    queryString = '?' + bodyParams
                }
                bodyParams = null
            }
        }

        return fetch(options.url + options.path + queryString, {
            method: method,
            headers: headers,
            body: bodyParams
        }).then(
            ResponseHandler.success,
            ResponseHandler.failure
        )
    }

    /**
     * Used for object retrieval by multiple search criteria.
     * @memberOf Api
     * @param {String} objCode    One of object codes from {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer}
     * @param {Object} [query]    An object with search criteria
     * @param {String|String[]} [fields]    Which fields to return. See {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer} for the list of available fields for the given objCode.
     * @return {Promise}    A promise which will resolved with search results if everything went ok and rejected otherwise
     */
    search(objCode: string, query?: object, fields?: TFields) {
        return this.request(objCode + '/search', query, fields, Api.Methods.GET)
    }

    /**
     * Sets a current API key for future requests
     * @memberOf Api
     * @return {string} returns the given api key value
     */
    setApiKey(apiKey) {
        return this._httpParams.apiKey = apiKey
    }

    /**
     * Sets a sessionID in the headers or removes sessionID if passed argument is undefined
     * @memberOf Api
     * @param {String|undefined} sessionID   sessionID to set
     */
    setSessionID(sessionID) {
        if (sessionID) {
            this._httpOptions.headers.sessionID = sessionID
        }
        else {
            delete this._httpOptions.headers.sessionID
        }
    }

    /**
     * Starting from version 2.0 API allows users to upload files.
     * The server will return the JSON data which includes 'handle' of uploaded file.
     * Returned 'handle' can be passed to create() method to create a new document.
     * This method is not available for browser execution environments and it is available only for Node.
     * @author Hovhannes Babayan <bhovhannes at gmail dot com>
     * @author Matt Winchester <mwinche at gmail dot com>
     * @memberOf Api
     * @param {fs.ReadStream} stream    A readable stream with file contents
     * @param {String} filename Override the filename
     */
    uploadFromStream(stream: stream.Readable, filename: string) {
        const data = new NodeFormData()
        data.append('uploadedFile', stream, filename)
        return this.request('upload', data, null, Api.Methods.POST)
    }

    uploadFileContent(fileContent, filename: string) {
        const data = new GlobalScope.FormData()
        data.append('uploadedFile', fileContent, filename)
        return this.request('upload', data, null, Api.Methods.POST)
    }
}

const ResponseHandler = {
    success: (response) => {
        if (response.ok) {
            return response.json().then(
                (data) => {
                    if (data.error) {
                        throw {
                            status: response.status,
                            message: data.error.message
                        }
                    }
                    return data.data
                }
            )
        }
        else {
            return response.json().then(
                (data) => {
                    throw {
                        status: response.status,
                        message: data.error.message
                    }
                },
                () => {
                    throw {
                        status: response.status,
                        message: response.statusText
                    }
                }
            )
        }
    },
    failure: (err) => {
        throw {
            message: err.message || err.statusText
        }
    }
}
