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

const API_URL = 'http://foobar:8080'

describe('getApiKey', function () {
    afterEach(() => fetchMock.reset())

    beforeEach(function () {
        this.api = new Api({
            url: API_URL,
        })
    })
    afterEach(function () {
        this.api = undefined
    })

    it('requests generateApiKey when getApiKey returns blank', function (done) {
        fetchMock.mock(
            (url, opts) => JSON.stringify(opts.body).indexOf('getApiKey') !== -1,
            '{"data": {"result": ""}}',
            {name: 'getApiKey'}
        )
        fetchMock.mock(
            (url, opts) => JSON.stringify(opts.body).indexOf('generateApiKey') !== -1,
            '{"data": {"result": "baz"}}',
            {name: 'generateApiKey'}
        )

        this.api.getApiKey('foo', 'bar').then(function (apiKey) {
            should(apiKey).be.equal('baz')
            should(fetchMock.called('getApiKey')).be.true()
            should(fetchMock.called('generateApiKey')).be.true()
            done()
        })
    })
    it('does not call generateApiKey when getApiKey returns an api key', function (done) {
        fetchMock.mock(
            (url, opts) => JSON.stringify(opts.body).indexOf('getApiKey') !== -1,
            '{"data": {"result": "baz"}}',
            {name: 'getApiKey'}
        )
        fetchMock.mock(
            (url, opts) => JSON.stringify(opts.body).indexOf('generateApiKey') !== -1,
            '{"data": {"result": "baz"}}',
            {name: 'generateApiKey'}
        )

        this.api.getApiKey('foo', 'bar').then((apiKey) => {
            should(apiKey).equal('baz')
            should(fetchMock.called('getApiKey')).be.true()
            should(fetchMock.called('generateApiKey')).be.false()
            should(fetchMock.calls('getApiKey')).length(1)
            this.api.getApiKey('foo', 'bar').then(function () {
                should(fetchMock.calls('getApiKey')).length(1)
                done()
            })
        })
    })
    it('should get and then clear the apiKey', function (done) {
        fetchMock.mock(
            (url, opts) => JSON.stringify(opts.body).indexOf('getApiKey') !== -1,
            '{"data": {"result": "baz"}}',
            {name: 'getApiKey'}
        )
        fetchMock.mock(
            (url, opts) => JSON.stringify(opts.body).indexOf('clearApiKey') !== -1,
            '{"data": {"success": true}}',
            {name: 'clearApiKey'}
        )

        this.api.getApiKey('foo', 'bar').then((apiKey) => {
            should(apiKey).equal('baz')
            should(fetchMock.calls('getApiKey')).length(1)
            should(this.api._httpOptions.headers).have.property('apiKey').eql('baz')
            this.api.clearApiKey().then(() => {
                should(this.api._httpOptions.headers).not.have.property('apiKey')
                done()
            })
        })
    })
    it('should getApiKey with subdomain', function () {
        fetchMock.mock(
            (url, opts) => JSON.stringify(opts.body).indexOf('getApiKey') !== -1,
            '{"data": {"result": ""}}',
            {name: 'getApiKey'}
        )
        fetchMock.mock(
            (url, opts) => JSON.stringify(opts.body).indexOf('generateApiKey') !== -1,
            '{"data": {"result": "baz"}}',
            {name: 'generateApiKey'}
        )
        return this.api.getApiKey('foo', 'bar', 'baz').then(function () {
            const getApiKeyOpts = fetchMock.lastOptions('getApiKey')
            const generateApiKeyOpts = fetchMock.lastOptions('generateApiKey')
            should(getApiKeyOpts.body).containEql('subdomain=baz')
            should(generateApiKeyOpts.body).containEql('subdomain=baz')
        })
    })
    it('should getApiKey without subdomain', function () {
        fetchMock.mock(
            (url, opts) => JSON.stringify(opts.body).indexOf('getApiKey') !== -1,
            '{"data": {"result": ""}}',
            {name: 'getApiKey'}
        )
        fetchMock.mock(
            (url, opts) => JSON.stringify(opts.body).indexOf('generateApiKey') !== -1,
            '{"data": {"result": "baz"}}',
            {name: 'generateApiKey'}
        )
        return this.api.getApiKey('foo', 'bar').then(function () {
            const getApiKeyOpts = fetchMock.lastOptions('getApiKey')
            const generateApiKeyOpts = fetchMock.lastOptions('generateApiKey')
            should(getApiKeyOpts.body).not.containEql('subdomain')
            should(generateApiKeyOpts.body).not.containEql('subdomain')
        })
    })
})
