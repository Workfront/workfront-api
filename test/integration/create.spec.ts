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

describe('Create', function() {

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
            require('../../fixtures/create.json'),
            {
                name: 'create'
            }
        )
    })

    it('makes a request with proper params', function() {
        const params = {
            foo: 'bar'
        }
        const fields = ['*', 'zzz:*']
        const objCode = 'baz'

        return this.api.create(objCode, params, fields).then(function() {
            const [url, opts] = fetchMock.lastCall('create')
            should(url).endWith(objCode + '?fields=' + encodeURIComponent('*,zzz:*'))
            should(opts.method).equal('POST')
            should(opts.body).equal('{"foo":"bar"}')
        })
    })
    it('should return the new created object', function() {
        const params = {
            name: 'test'
        }
        const fields = 'customerID'
        const objCode = 'TASK'

        return this.api.create(objCode, params, fields).then(function(data) {
            should(data).have.properties(['ID', 'name', 'objCode'])
            should(data.objCode).equal(objCode)
            should(data.name).equal(params.name)
        })
    })
    it('should create an object using the old api (passing updates property)', function() {
        const api = new Workfront.Api({
            url: API_URL,
            version: '4.0'
        })
        const params = {
            updates: JSON.stringify({name: 'test'})
        }
        const objCode = 'TASK'

        return api.create(objCode, params).then(function(data) {
            const [url, opts] = fetchMock.lastCall('create')
            should(url).endWith(objCode)
            should(opts.method).equal('POST')
            should(opts.body).equal('updates=' + encodeURIComponent(params.updates))

            should(data).have.properties(['ID', 'name', 'objCode'])
            should(data.objCode).equal(objCode)
            should(data.name).equal('test')
        })
    })
    it('should not do changes on the given parameter object', function() {
        const params = {
            updates: JSON.stringify({name: 'test'})
        }
        const objCode = 'TASK'

        Object.freeze(params)
        should(() => {
            this.api.create(objCode, params)
        }).not.throw()
    })
})
