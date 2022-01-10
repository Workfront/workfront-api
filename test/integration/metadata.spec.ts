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

import fetchMock from 'fetch-mock'
import should from 'should'
import {Api} from '../../src/Api'
import fixture from '../../fixtures/metadata.json'

const API_URL = 'http://foobar:8080'

describe('Metadata', function () {
    afterEach(() => fetchMock.reset())

    beforeEach(function () {
        this.api = new Api({
            url: API_URL,
        })
    })
    afterEach(function () {
        this.api = undefined
    })

    beforeEach(function () {
        fetchMock.mock(`begin:${API_URL}/attask/api`, fixture, {
            name: 'metadata',
        })
    })
    it('calls without objCode', function () {
        this.api.metadata()
        const [url, opts] = fetchMock.lastCall('metadata')
        should(url).endWith('metadata')
        should(opts.method).equal('GET')
        should(opts.body).be.null()
    })
    it('calls with objCode', function () {
        const objCode = 'foo'
        this.api.metadata(objCode)
        const [url, opts] = fetchMock.lastCall('metadata')
        should(url).endWith(`${objCode}/metadata`)
        should(opts.method).equal('GET')
        should(opts.body).be.null()
    })
})
