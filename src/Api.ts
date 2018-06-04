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
import * as objectAssign from 'object-assign'
import {Readable} from 'stream'
import {INTERNAL_PREFIX} from 'workfront-api-constants'

export interface IHttpOptions {
    path?: string
    method?: string
    url: string
    alwaysUseGet?: boolean
    headers: {
        sessionID?: string
        'X-XSRF-TOKEN'?: string
        apiKey?: string
    }
}
export interface IApiConfig {
    url: string
    version?: string
    alwaysUseGet?: boolean
    apiKey?: string
    headers?: {[key: string]: string}
}
export type TFields = string | string[]

const GlobalScope = Function('return this')()

/**
 * Configuration for the Api constructor
 * @typedef {Object} config
 * @property {String} url - Required. A url to Workfront server (for example: http://localhost:8080)
 * @property {String} [version=internal] - Which version of api to use. At the moment of writing can be 2.0, 3.0, ..., 8.0. Pass 'unsupported' to use Workfront latest API (maybe unstable)
 * @property {Boolean} [alwaysUseGet=false] - Will cause the api to make every request as a GET with params in the query string and add method=DESIRED_METHOD_TYPE in the query string. Some Workfront urls will have issues with PUT and DELETE calls if this value is false
 * @property {String} [apiKey] - It is used to pass apiKey with every api request headers
 * @property {Object} [headers] - An key-value object that sets custom headers (for example: {'user-agent': DESIRED_USER_AGENT_NAME})
 */

/**
 * Creates new Api instance.
 * @param {Object} config   An object with the following keys:<br/>
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
    serverAcceptsJSON: boolean

    _uriGenerationMode: boolean

    constructor(config: IApiConfig) {
        this.serverAcceptsJSON = true
        this._uriGenerationMode = false
        this._httpOptions = {
            url: config.url,
            alwaysUseGet: config.alwaysUseGet,
            headers: config.headers || {}
        }
        if (config.apiKey) {
            this._httpOptions.headers.apiKey = config.apiKey
        }
        // Append version to path if provided
        let path
        const {
            version = 'internal'
        }: {
            version?: string
        } = config
        if (['internal', 'unsupported', 'asp'].indexOf(version) >= 0) {
            path = '/attask/api-' + version
        } else {
            path = '/attask/api/v' + version
            if (version === '2.0' || version === '3.0' || version === '4.0') {
                this.serverAcceptsJSON = false
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
            if (typeof this._httpOptions.headers.apiKey !== 'undefined') {
                resolve(this._httpOptions.headers.apiKey)
            } else {
                const req = this.execute('USER', null, 'getApiKey', {username, password})
                ;(req as Promise<any>).then(getApiKeyData => {
                    if (getApiKeyData.result === '') {
                        const req2 = this.execute('USER', null, 'generateApiKey', {
                            username,
                            password
                        })
                        ;(req2 as Promise<any>).then(generateApiKeyData => {
                            this._httpOptions.headers.apiKey = generateApiKeyData.result
                            resolve(this._httpOptions.headers.apiKey)
                        }, reject)
                    } else {
                        this._httpOptions.headers.apiKey = getApiKeyData.result
                        resolve(this._httpOptions.headers.apiKey)
                    }
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
     * @param {String[]} options    A list of options that are attached to the copy request (object specific)
     * @return {Promise}    A promise which will resolved with results if everything went ok and rejected otherwise
     */
    copy(objCode: string, objID: string, updates: object, fields?: TFields, options?: string[]) {
        const params: {
            copySourceID: string
            updates?: string
            options?: string
        } = {
            copySourceID: objID
        }
        if (updates) {
            params.updates = JSON.stringify(updates)
        }
        if (options) {
            params.options = JSON.stringify(options)
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
        const req = this.request(objCode + '/count', query, null, Api.Methods.GET)
        if (this._uriGenerationMode) {
            return req
        }
        return (req as Promise<any>).then(function(data) {
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
            const req = this.execute('USER', null, 'clearApiKey') as Promise<any>
            req.then(result => {
                if (result) {
                    delete this._httpOptions.headers.apiKey
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
    create(objCode: string, params: any, fields?: TFields) {
        if (params.hasOwnProperty('updates')) {
            return this.request(objCode, params, fields, Api.Methods.POST)
        }
        return this.request(objCode, {updates: params}, fields, Api.Methods.POST)
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
    edit(objCode: string, objID: string, updates: any, fields?: TFields) {
        if (updates.hasOwnProperty('updates')) {
            return this.request(objCode + '/' + objID, updates, fields, Api.Methods.PUT)
        }
        return this.request(objCode + '/' + objID, {updates: updates}, fields, Api.Methods.PUT)
    }

    /**
     * Edit multiple existing objects
     * @memberOf Api
     * @param {String} objCode    One of object codes from {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer}
     * @param {Array} updates    Array of fields for each object to be edited. See {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer} for the list of available fields for the given objCode.
     * @param {String|String[]} [fields]    Which fields to return. See {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer} for the list of available fields for the given objCode.
     * @return {Promise}    A promise which will resolved with results if everything went ok and rejected otherwise
     */
    editMultiple(objCode: string, updates: any[], fields?: TFields) {
        return this.request(objCode, {updates: updates}, fields, Api.Methods.PUT)
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
        let params: any = {method: Api.Methods.PUT}
        if (objID) {
            endPoint += '/' + objID + '/' + action
        } else {
            params.action = action
        }
        if (actionArgs) {
            params = objectAssign(params, actionArgs)
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
            } else {
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
        const req = this.request(
            'login',
            {username: username, password: password},
            null,
            Api.Methods.POST
        )
        return (req as Promise<any>).then(data => {
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
            const req = this.request('logout', null, null, Api.Methods.GET)
            ;(req as Promise<any>).then(result => {
                if (result && result.success) {
                    delete this._httpOptions.headers['X-XSRF-TOKEN']
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
     * @param {String|String[]} fields    Which fields to return.
     * @return {Promise}    A promise which will resolved with object metadata if everything went ok and rejected otherwise
     */
    metadata(objCode?: string, fields?: TFields) {
        let path = '/metadata'
        if (objCode) {
            path = objCode + path
        }
        return this.request(path, null, fields, Api.Methods.GET)
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
        const params = bForce ? {force: true} : null
        const req = this.request(objCode + '/' + objID, params, null, Api.Methods.DELETE)

        if (this._uriGenerationMode) {
            return req
        } else {
            return new Promise((resolve, reject) => {
                ;(req as Promise<any>).then(result => {
                    if (result && result.success) {
                        resolve()
                    } else {
                        reject()
                    }
                }, reject)
            })
        }
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

    /**
     * Do the request using Fetch API.
     * @memberOf Api
     * @param {String} path     URI path where the request calls
     * @param {Object} params   An object with params
     * @param {Object} [fields] Fields to query for the request
     * @param {String} [method=GET] The method which the request will do (GET|POST|PUT|DELETE)
     * @param {Boolean} [generateUrl] Whenever to generate url without sending actual request
     * @return {Promise}    A promise which will resolved with results if everything went ok and rejected otherwise
     */
    request(
        path: string,
        params,
        fields?: TFields,
        method: string = Api.Methods.GET
    ): Promise<any> {
        const clonedParams = objectAssign({}, params)

        const alwaysUseGet = this._httpOptions.alwaysUseGet

        const options = objectAssign({}, this._httpOptions)
        if (alwaysUseGet && path !== 'login') {
            clonedParams.method = method
            options.method = Api.Methods.GET
        } else {
            options.method = method
        }

        if (path.indexOf('/') !== 0) {
            path = '/' + path
        }
        options.path = this._httpOptions.path + path

        fields = fields || []
        if (typeof fields === 'string') {
            fields = [fields]
        }
        if (fields.length !== 0) {
            clonedParams.fields = fields.join()
        }

        const headers = new Headers()
        headers.append('X-Requested-With', 'XMLHttpRequest')
        if (this._httpOptions.headers.sessionID) {
            headers.append('sessionID', this._httpOptions.headers.sessionID)
        } else if (this._httpOptions.headers['X-XSRF-TOKEN']) {
            headers.append('X-XSRF-TOKEN', this._httpOptions.headers['X-XSRF-TOKEN'])
        } else if (this._httpOptions.headers.apiKey) {
            headers.append('apiKey', this._httpOptions.headers.apiKey)
        }

        let bodyParams = null,
            queryString = ''
        if (NodeFormData && params instanceof NodeFormData) {
            bodyParams = params
        } else if (GlobalScope.FormData && clonedParams instanceof GlobalScope.FormData) {
            bodyParams = clonedParams
        } else {
            if (
                this.serverAcceptsJSON &&
                typeof clonedParams.updates === 'object' &&
                (options.method === Api.Methods.POST || options.method === Api.Methods.PUT)
            ) {
                headers.append('Content-Type', 'application/json')
                bodyParams = JSON.stringify(clonedParams.updates)

                delete clonedParams.updates
                const qs = queryStringify(clonedParams)
                if (qs) {
                    queryString = '?' + qs
                }
            } else {
                headers.append('Content-Type', 'application/x-www-form-urlencoded')
                if (
                    clonedParams.hasOwnProperty('updates') &&
                    typeof clonedParams.updates !== 'string'
                ) {
                    clonedParams.updates = JSON.stringify(clonedParams.updates)
                }
                bodyParams = queryStringify(clonedParams)
                if (options.method === Api.Methods.GET || options.method === Api.Methods.DELETE) {
                    if (bodyParams) {
                        queryString = '?' + bodyParams
                    }
                    bodyParams = null
                }
            }
        }

        if (this._uriGenerationMode) {
            // @ts-ignore-line
            return path + queryString
        }
        return fetch(options.url + options.path + queryString, {
            method: options.method,
            headers: headers,
            body: bodyParams,
            credentials: 'same-origin'
        }).then(ResponseHandler.success, ResponseHandler.failure)
    }

    /**
     * Used for object retrieval by multiple search criteria.
     * @memberOf Api
     * @param {String} objCode    One of object codes from {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer}
     * @param {Object} [query]    An object with search criteria
     * @param {String|String[]} [fields]    Which fields to return. See {@link https://developers.attask.com/api-docs/api-explorer/|Workfront API Explorer} for the list of available fields for the given objCode.
     * @param {Boolean} [useHttpPost=false] Whenever to use POST to send query params
     * @return {Promise}    A promise which will resolved with search results if everything went ok and rejected otherwise
     */
    search(objCode: string, query?: object, fields?: TFields, useHttpPost = false) {
        let searchQuery, method
        if (useHttpPost) {
            searchQuery = objectAssign({}, query, {method: Api.Methods.GET})
            method = Api.Methods.POST
        } else {
            searchQuery = query
            method = Api.Methods.GET
        }
        return this.request(objCode + '/search', searchQuery, fields, method)
    }

    /**
     * Performs batch call to the API.
     * @memberOf Api
     *
     * @param {(batchApi: IBatchApi) => string[]} uriCollector   A function which will be invoked with api instance.
     *     This instance is special, as all methods there return a url string instead of making a backend call.
     *     `uriCollector` should return an array of uris to be executed in batch.
     *     So, for example, one may return `[batchApi.metadata(), batchApi.count(...)]` from `uriCollector`.
     *     That will mean `call metadata() method` and then `call count() method`.
     *
     * @param {boolean} isAtomic    Pass true if you want all operations to happen in the same transaction.
     *     There is a limitation, however. Atomic batch operations can only return success or error.
     *
     * @returns {Promise<any[] | undefined>}
     */
    batch(uriCollector: (batchApi: IBatchApi) => string[], isAtomic?: false): Promise<any[]>
    batch(uriCollector: (batchApi: IBatchApi) => string[], isAtomic?: true): Promise<undefined>
    batch(
        uriCollector: (batchApi: IBatchApi) => string[],
        isAtomic?: boolean
    ): Promise<any[] | undefined> {
        const batchApi = batchApiFactory(this)
        const uris = uriCollector(batchApi)
        if (uris.length === 0) {
            return Promise.resolve(isAtomic ? undefined : [])
        }
        const req = this.request('/batch', {
            atomic: isAtomic,
            uri: uris
        })
        if (isAtomic) {
            return req.then(result => {
                if (result && result.success) {
                    return undefined
                }
                throw new Error()
            })
        }
        return req.then(results => {
            return results.map(resultItem => resultItem.data)
        })
    }

    /**
     * Sets a current API key for future requests
     * @memberOf Api
     * @return {string} returns the given api key value
     */
    setApiKey(apiKey) {
        return (this._httpOptions.headers.apiKey = apiKey)
    }

    /**
     * Sets a sessionID in the headers or removes sessionID if passed argument is undefined
     * @memberOf Api
     * @param {String|undefined} sessionID   sessionID to set
     */
    setSessionID(sessionID) {
        if (sessionID) {
            this._httpOptions.headers.sessionID = sessionID
        } else {
            delete this._httpOptions.headers.sessionID
        }
    }

    /**
     * Sets a 'X-XSRF-TOKEN' in the headers or removes 'X-XSRF-TOKEN' if passed argument is undefined
     * @memberOf Api
     * @param {String|undefined} xsrfToken   X-XSRF-TOKEN to set
     */
    setXSRFToken(xsrfToken?: string) {
        if (xsrfToken) {
            this._httpOptions.headers['X-XSRF-TOKEN'] = xsrfToken
        } else {
            delete this._httpOptions.headers['X-XSRF-TOKEN']
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
    uploadFromStream(stream: Readable, filename: string) {
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

const queryStringify = function(params) {
    return Object.keys(params)
        .reduce(function(a, k) {
            if (Array.isArray(params[k])) {
                params[k].forEach(function(param) {
                    a.push(k + '=' + encodeURIComponent(param))
                })
            } else {
                a.push(k + '=' + encodeURIComponent(params[k]))
            }
            return a
        }, [])
        .join('&')
}

export interface IBatchApi {
    copy: (
        objCode: string,
        objID: string,
        updates: object,
        fields?: TFields,
        options?: string[]
    ) => string
    count: (objCode: string, query?: object) => string
    create: (objCode: string, params: any, fields?: TFields) => string
    edit: (objCode: string, objID: string, updates: any, fields?: TFields) => string
    editMultiple: (objCode: string, updates: any[], fields?: TFields) => string
    execute: (objCode: string, objID: string | null, action: string, actionArgs?: object) => string
    get: (objCode: string, objIDs: string | string[], fields?: TFields) => string
    metadata: (objCode?: string, fields?: TFields) => string
    namedQuery: (objCode: string, query: string, queryArgs?: object, fields?: TFields) => string
    remove: (objCode: string, objID: string, bForce?: boolean) => string
    report: (objCode: string, query: object) => string
    request: (path: string, params, fields?: TFields, method?: string) => string
    search: (objCode: string, query?: object, fields?: TFields) => string
}

function batchApiFactory(api: Api): IBatchApi {
    const apiClone = Object.create(api) as Api
    apiClone._uriGenerationMode = true
    return {
        copy: (
            objCode: string,
            objID: string,
            updates: object,
            fields?: TFields,
            options?: string[]
        ) => {
            return (apiClone.copy(objCode, objID, updates, fields, options) as any) as string
        },
        count: (objCode: string, query?: object) => {
            return (apiClone.count(objCode, query) as any) as string
        },
        create: (objCode: string, params: any, fields?: TFields) => {
            return (apiClone.create(objCode, params, fields) as any) as string
        },
        edit: (objCode: string, objID: string, updates: any, fields?: TFields) => {
            return (apiClone.edit(objCode, objID, updates, fields) as any) as string
        },
        editMultiple: (objCode: string, updates: any[], fields?: TFields) => {
            return (apiClone.editMultiple(objCode, updates, fields) as any) as string
        },
        execute: (objCode: string, objID: string | null, action: string, actionArgs?: object) => {
            return (apiClone.execute(objCode, objID, action, actionArgs) as any) as string
        },
        get: (objCode: string, objIDs: string | string[], fields?: TFields) => {
            return (apiClone.get(objCode, objIDs, fields) as any) as string
        },
        metadata: (objCode?: string, fields?: TFields) => {
            return (apiClone.metadata(objCode, fields) as any) as string
        },
        namedQuery: (objCode: string, query: string, queryArgs?: object, fields?: TFields) => {
            return (apiClone.namedQuery(objCode, query, queryArgs, fields) as any) as string
        },
        remove: (objCode: string, objID: string, bForce?: boolean) => {
            return (apiClone.remove(objCode, objID, bForce) as any) as string
        },
        report: (objCode: string, query: object) => {
            return (apiClone.report(objCode, query) as any) as string
        },
        request: (path: string, params, fields?: TFields, method: string = Api.Methods.GET) => {
            return (apiClone.request(path, params, fields, method) as any) as string
        },
        search: (objCode: string, query?: object, fields?: TFields) => {
            return (apiClone.search(objCode, query, fields, false) as any) as string
        }
    }
}

export type TSuccessHandler<T = any> = (response: any) => Promise<T>
export type TFailureHandler = (err: any) => never

export const ResponseHandler: {
    success: TSuccessHandler<any>
    failure: TFailureHandler
} = {
    success: response => {
        if (response.ok) {
            return response.json().then(data => {
                if (data.error) {
                    throw {
                        status: response.status,
                        message: data.error.message
                    }
                }
                return data.data
            })
        } else {
            return response.json().then(
                data => {
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
    failure: err => {
        throw {
            message: err.message || err.statusText
        }
    }
}
