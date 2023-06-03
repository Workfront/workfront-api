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

import {Api} from '../'

describe('Create new instance for API', function () {
    it('should have methods', function () {
        const api = new Api({url: 'http://localhost'})
        should(api.copy).be.a.Function().and.has.lengthOf(5)
        should(api.count).be.a.Function().and.has.lengthOf(2)
        should(api.create).be.a.Function().and.has.lengthOf(3)
        should(api.edit).be.a.Function().and.has.lengthOf(4)
        should(api.execute).be.a.Function().and.has.lengthOf(4)
        should(api.get).be.a.Function().and.has.lengthOf(3)
        should(api.getApiKey).be.a.Function().and.has.lengthOf(3)
        should(api.login).be.a.Function().and.has.lengthOf(3)
        should(api.logout).be.a.Function().and.has.lengthOf(0)
        should(api.metadata).be.a.Function().and.has.lengthOf(2)
        should(api.namedQuery).be.a.Function().and.has.lengthOf(4)
        should(api.remove).be.a.Function().and.has.lengthOf(3)
        should(api.report).be.a.Function().and.has.lengthOf(2)
        should(api.search).be.a.Function().and.has.lengthOf(3)
        should(api.uploadFromStream).be.a.Function().and.has.lengthOf(2)
        should(api.uploadFileContent).be.a.Function().and.has.lengthOf(2)
        should(api.setApiKey).be.a.Function().and.has.lengthOf(1)
        should(api.clearApiKey).be.a.Function().and.has.lengthOf(0)
    })

    it('should set correct API path based on passed configuration (version is passed)', function () {
        const api = new Api({url: 'http://localhost', version: '2.0'})
        should(api._httpOptions.path).equal('/attask/api/v2.0')
    })

    it('should set correct API path based on passed configuration (version is not passed)', function () {
        const api = new Api({url: 'http://localhost'})
        should(api._httpOptions.path).equal('/attask/api-internal')
    })

    it('should set correct API path based on passed configuration (version="asp")', function () {
        const api = new Api({url: 'http://localhost', version: 'asp'})
        should(api._httpOptions.path).equal('/attask/api-asp')
    })
})
