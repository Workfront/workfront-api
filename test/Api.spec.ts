/**
 * Copyright 2015 Workfront
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
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
import * as should from 'should'
import 'should-sinon'
// import * as sinon from 'sinon'

import {Api} from '../src/Api'


describe('Create new instance for API', function () {
    it('should have methods', function () {
        const api = new Api({url: 'http://localhost'})
        should(api.get).be.a.Function()
        should(api.login).be.a.Function()
        should(api.logout).be.a.Function()
        should(api.create).be.a.Function()
        should(api.edit).be.a.Function()
        should(api.search).be.a.Function()
        should(api.remove).be.a.Function()
        should(api.report).be.a.Function()
        should(api.count).be.a.Function()
        should(api.copy).be.a.Function()
        // should(api.upload).be.a.Function()
        should(api.execute).be.a.Function()
        should(api.namedQuery).be.a.Function()
        should(api.metadata).be.a.Function()
        should(api.getApiKey).be.a.Function()
        // should(api.clearApiKey).be.a.Function()
    })

    it('should set correct API path based on passed configuration (version is passed)', function () {
        const api = new Api({url: 'http://localhost', version: '2.0'})
        should(api._httpOptions.path).equal('/attask/api/v2.0')
    })

    it('should set correct API path based on passed configuration (version is not passed)', function () {
        const api = new Api({url: 'http://localhost'})
        should(api._httpOptions.path).equal('/attask/api')
    })

    it('should set correct API path based on passed configuration (version="internal")', function () {
        const api = new Api({url: 'http://localhost', version: 'internal'})
        should(api._httpOptions.path).equal('/attask/api-internal')
    })
})
