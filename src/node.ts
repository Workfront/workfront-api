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
import * as NodeFormData from 'form-data'
import 'isomorphic-fetch'
import {Readable} from 'stream'
import {Api as BaseApi, makeFetchCall} from './Api'

/**
 * Starting from version 2.0 API allows users to upload files.
 * The server will return the JSON data which includes 'handle' of uploaded file.
 * Returned 'handle' can be passed to create() method to create a new document.
 * This method is not available for browser execution environments and it is available only for Node.
 * @author Hovhannes Babayan <bhovhannes at gmail dot com>
 * @author Sassoun Derderian <citizen dot sas at gmail dot com>
 * @memberOf Api
 * @param {fs.ReadStream} stream    A readable stream with file contents
 * @param {String} filename Override the filename
 */
export class NodeApi extends BaseApi {
    constructor(options) {
        super(options)
    }

    uploadFromStream(stream: Readable, filename: string) {
        const data = new NodeFormData()
        data.append('uploadedFile', stream, filename)
        return makeFetchCall(this._httpOptions.url + this._httpOptions.path + '/upload', {
            headers: this.getHeaders(),
            body: data as any,
            method: BaseApi.Methods.POST,
        })
    }
}

export {ResponseHandler} from './Api'

export {NodeApi as Api}
