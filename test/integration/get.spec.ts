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

describe('Get', function () {

    afterEach(fetchMock.reset)
    afterEach(fetchMock.restore)

    beforeEach(function () {
        this.api = new Workfront.Api({
            url: API_URL
        })
    })
    afterEach(function () {
        this.api = undefined
    })

    describe('Call with single objId (String)', function () {
        beforeEach(function () {
            fetchMock.mock(
                `begin:${API_URL}/attask/api/`,
                require('../../fixtures/get.json'),
                {
                    name: 'get'
                }
            )
        })

        it('should call request() with proper params and return value received from request()', function () {
            let objCode = 'PROJ',
                objID = 'foobar'

            return this.api.get(objCode, objID).then(function (data) {
                let [url, opts] = fetchMock.lastCall('get')
                should(url).endWith(objCode + '/' + objID)
                should(opts.method).equal('GET')
                should(opts.body).equal('')

                should(data).have.properties(['ID', 'name', 'objCode'])
            })
        })
        it('should call request() with proper params and return value received from request() containing internal prefix', function () {
            let objID = '$$USER',
                objCode = 'USER'

            return this.api.get(objCode, objID).then(function (data) {
                let [url, opts] = fetchMock.lastCall('get')
                should(url).endWith(objCode)
                should(opts.method).equal('GET')
                should(opts.body).equal('id=' + encodeURIComponent(objID))

                should(data).have.properties(['ID', 'name', 'objCode'])
            })
        })
        it('should call request() with proper params and return value received from request() objID is Array with one item', function () {
            let objID = ['foo'],
                objCode = 'bar'

            return this.api.get(objCode, objID).then(function (data) {
                let [url, opts] = fetchMock.lastCall('get')
                should(url).endWith(objCode + '/' + objID[0])
                should(opts.method).equal('GET')
                should(opts.body).equal('')

                should(data).have.properties(['ID', 'name', 'objCode'])
            })
        })
    })
    describe('Call with single objId (String)', function () {
        beforeEach(function () {
            fetchMock.mock(
                `begin:${API_URL}/attask/api/`,
                require('../../fixtures/get_multiple.json'),
                {
                    name: 'get'
                }
            )
        })
        it('should call request() with proper params and return value received from request() objID is Array with two items', function () {
            let objID = ['foo', 'bar'],
                objCode = 'baz'

            return this.api.get(objCode, objID).then(function (data) {
                let [url, opts] = fetchMock.lastCall('get')
                should(url).endWith(objCode)
                should(opts.method).equal('GET')
                should(opts.body).equal('id=' + encodeURIComponent(objID.join(',')))

                should(data).be.Array().and.have.length(2)
                should(data).have.propertyByPath('0', 'ID')
                should(data).have.propertyByPath('1', 'ID')
            })
        })
    })
})
