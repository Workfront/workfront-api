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

describe('Logout', function() {

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
                `begin:${API_URL}/attask/api-internal/logout`,
                require('../../fixtures/logout.json'),
                {
                    name: 'logout'
                }
            )
        })
        beforeEach(function() {
            fetchMock.mock(
                `begin:${API_URL}/attask/api-internal/login`,
                require('../../fixtures/login.json'),
                {
                    name: 'login'
                }
            )
        })
        it('should call with proper params', function() {
            this.api.logout()
            const [url, opts] = fetchMock.lastCall('logout')
            should(url).endWith('logout')
            should(opts.method).equal('GET')
            should(opts.body).be.null()
        })
        it('removes sessionID from header for later calls', function() {
            let opts
            return this.api.login('foo', 'bar').then(() => {
                return this.api.logout('foo', 'bar').then(() => {
                    opts = fetchMock.lastOptions('logout')
                    should(opts.headers.has('sessionID')).be.ok()
                    this.api.login('foo', 'bar')
                    opts = fetchMock.lastOptions('login')
                    should(opts.headers.has('sessionID')).not.be.ok()
                })
            })
        })
    })
})
