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

import * as fetchMock from 'fetch-mock'
import should from 'should'
import {Api} from '../../src/Api'
import fixture from '../../fixtures/count.json'

const API_URL = 'http://foobar:8080'

describe('Count', function () {
    afterEach(fetchMock.reset)
    afterEach(fetchMock.restore)

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
            name: 'count',
        })
    })

    it('makes request with proper params with search criteria', function () {
        return this.api.count('foo', {foo: 'bar'}).then(function () {
            const [url, opts] = fetchMock.lastCall('count')
            should(url).endWith('foo/count?foo=bar')
            should(opts.method).equal('GET')
            should(opts.body).be.null()
        })
    })
    it('makes request with proper params without a search criteria', function () {
        return this.api.count('foo').then(function () {
            const opts = fetchMock.lastOptions('count')
            should(opts.method).equal('GET')
            should(opts.body).be.null()
        })
    })

    it('should return a promise with count', function () {
        return this.api.count('foo').should.be.finally.a.Number().and.equal(147)
    })
})
