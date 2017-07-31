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
import * as should from 'should'

import * as Workfront from '../../src/index'

const API_URL = 'http://foobar:8080'

describe('Login', function() {

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

    describe('success', function() {
        beforeEach(function() {
            fetchMock.mock(
                `begin:${API_URL}/attask/api`,
                require('../../fixtures/login.json'),
                {
                    name: 'login',
                    method: 'POST'
                }
            )
        })
        it('should return user data', function() {
            return this.api.login('foo', 'bar').then(function(data) {
                should(data).have.properties(['userID', 'sessionID'])
            })
        })
        it('sets sessionID in header', function() {
            let opts
            return this.api.login('foo', 'bar').then(() => {
                opts = fetchMock.lastOptions('login')
                should(opts.headers.has('sessionID')).not.ok()
                this.api.login('foo', 'bar').then(() => {
                    opts = fetchMock.lastOptions('login')
                    should(opts.headers.has('sessionID')).ok()
                })
            })
        })
        it('calls with proper params', function() {
            this.api.login('foo', 'bar')
            const [url, opts] = fetchMock.lastCall('login')
            should(url).endWith('login')
            should(opts.body).containEql('username=foo')
            should(opts.body).containEql('password=bar')
        })
    })
    describe('authentication exception', function() {
        beforeEach(function() {
            fetchMock.mock(
                `begin:${API_URL}/attask/api`,
                require('../../fixtures/exception.json'),
                {
                    name: 'login',
                    method: 'POST'
                }
            )
        })
        it('should reject with error message', function() {
            return this.api.login('foo', 'foo').catch(function(data) {
                should(data).have.property('message')
            })
        })
    })
})
