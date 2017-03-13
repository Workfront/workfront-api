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

import 'isomorphic-fetch'
import {INTERNAL_PREFIX} from 'workfront-api-constants'


type THttpParams = any
type THttpOptions = {
    path?: string
    method?: string
    url: string
    alwaysUseGet?: boolean
    headers: { sessionID?: string }
}
type TFields = string | string[]

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

    _httpOptions: THttpOptions
    _httpParams: THttpParams

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
                this.execute('USER', null, 'getApiKey', {
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
        const params = {
            copySourceID: objID,
            updates: updates ? JSON.stringify(updates) : undefined
        }
        return this.request(objCode, params, fields, Api.Methods.POST)
    }

    /**
     * Used to retrieve number of objects matching given search criteria
     * @memberOf Api
     * @param {String} objCode
     * @param {Object} query    An object with search criteria
     * @return {Promise}
     */
    count(objCode: string, query: object): Promise<number> {
        return this.request(objCode + '/count', query, null, Api.Methods.GET).then(function (data) {
            return data.count
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
        const params = {
            updates: JSON.stringify(updates)
        }
        return this.request(objCode + '/' + objID, params, fields, Api.Methods.PUT)
    }

    /**
     * Executes an action for the given object
     * @memberOf Api
     * @param {String} objCode    One of object codes from {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer}
     * @param {String} objID    ID of object. Optional, pass null or undefined to omit
     * @param {String} action    An action to execute. A list of allowed actions are available within the {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer} under "actions" for each object.
     * @param {Object} [actionArgs]    Optional. Arguments for the action. See {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer} for the list of valid arguments
     * @returns {Promise}    A promise which will resolved if everything went ok and rejected otherwise
     */
    execute(objCode: string, objID: string, action: string, actionArgs?: object) {
        let endPoint = objCode
        if (objID) {
            endPoint += '/' + objID + '/' + action
        }
        else {
            actionArgs = actionArgs || {}
            actionArgs['action'] = action
        }
        return this.request(endPoint, actionArgs, null, Api.Methods.PUT)
    }

    /**
     * Used for retrieve an object or multiple objects.
     * @memberOf Api
     * @param {String} objCode    One of object codes from {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer}
     * @param {String|Array} objIDs    Either one or multiple object ids
     * @param {String|String[]} fields    Which fields to return. See {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer} for the list of available fields for the given objCode.
     * @return {Promise}    A promise which will resolved with results if everything went ok and rejected otherwise
     */
    get(objCode: string, objIDs: string|string[], fields?: TFields) {
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
            this.setSessionID(data.data.sessionID)
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
    metadata(objCode: string) {
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
    report(objCode: string, query) {
        return this.request(objCode + '/report', query, null, Api.Methods.GET)
    }

    request(path: string, params: THttpParams, fields?: TFields, method: string = Api.Methods.GET): Promise<any> {
        params = Object.assign(params || {}, this._httpParams)

        const alwaysUseGet = this._httpOptions.alwaysUseGet

        let options = Object.assign({}, this._httpOptions)
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

        let headers = new Headers()
        headers.append('Content-Type', 'application/x-www-form-urlencoded')
        if (this._httpOptions.headers.sessionID) {
            headers.append('sessionID', this._httpOptions.headers.sessionID)
        }

        let bodyParams = Object.keys(params).reduce(function(a, k) {
            a.push(k + '=' + encodeURIComponent(params[k]))
            return a
        }, []).join('&')

        return fetch(options.url + options.path, {
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
     * @param {Object} query    An object with search criteria
     * @param {String|String[]} [fields]    Which fields to return. See {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer} for the list of available fields for the given objCode.
     * @return {Promise}    A promise which will resolved with search results if everything went ok and rejected otherwise
     */
    search(objCode: string, query: object, fields?: TFields) {
        return this.request(objCode + '/search', query, fields, Api.Methods.GET)
    }

    /**
     * Sets a sessionID in the headers
     * @memberOf Api
     * @param {String} sessionID   sessionID to set
     * @return {void}
     */
    setSessionID(sessionID: string): void {
        this._httpOptions.headers.sessionID = sessionID
    }
}

if (typeof(window) === 'undefined') {
  // These plugins only work in node
  // require('./plugins/upload')(Api)
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
                    return data
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
