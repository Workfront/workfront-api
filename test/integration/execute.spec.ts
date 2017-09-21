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

import * as Workfront from '../../src/index'

const API_URL = 'http://foobar:8080'

describe('Execute', function() {

    afterEach(fetchMock.reset)
    afterEach(fetchMock.restore)

    beforeEach(function() {
        this.api = new Workfront.Api({
            url: API_URL
        })
    })
    afterEach(function() {
        this.api = undefined
    })

    beforeEach(function() {
        fetchMock.mock(
            `begin:${API_URL}/attask/api`,
            require('../../fixtures/execute.json'),
            {
                name: 'execute'
            }
        )
    })

    it('should call request() with proper params (without args)', function() {
        return this.api.execute('foo', 'bar', 'baz').then(function() {
            const [url, opts] = fetchMock.lastCall('execute')
            should(url).endWith('foo/bar/baz')
            should(opts.body).equal('method=PUT')
            should(opts.method).equal('POST')
        })
    })

    it('should call request() with proper params (with args)', function() {
        return this.api.execute('foo', 'bar', 'baz', {foo: 'barbaz'}).then(function() {
            const [url, opts] = fetchMock.lastCall('execute')
            should(url).endWith('foo/bar/baz')
            should(opts.body).containEql('foo=barbaz')
            should(opts.body).containEql('method=PUT')
            should(opts.method).equal('POST')
        })
    })

    it('should call request() with proper params (with args) when objID is omitted', function() {
        return this.api.execute('foo', null, 'baz', {foo: 'barbaz'}).then(function() {
            const [url, opts] = fetchMock.lastCall('execute')
            should(url).endWith('foo')
            should(opts.body).containEql('action=baz')
            should(opts.body).containEql('foo=barbaz')
            should(opts.body).containEql('method=PUT')
            should(opts.method).equal('POST')
        })
    })

    it('should call request() with proper params (without args) when objID is omitted', function() {
        return this.api.execute('foo', null, 'baz').then(function() {
            const [url, opts] = fetchMock.lastCall('execute')
            should(url).endWith('foo')
            should(opts.body).containEql('action=baz')
            should(opts.body).containEql('method=PUT')
            should(opts.method).equal('POST')
        })
    })
})
