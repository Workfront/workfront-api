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
import fixture from '../../fixtures/edit.json'

const API_URL = 'http://foobar:8080'

describe('Edit', function () {
    afterEach(() => fetchMock.reset())

    beforeEach(function () {
        this.api = new Api({
            url: API_URL,
            apiKey: 'testapikey',
        })
    })
    afterEach(function () {
        this.api = undefined
    })

    beforeEach(function () {
        fetchMock.mock(`begin:${API_URL}/attask/api`, fixture, {
            name: 'edit',
        })
    })

    it('makes a PUT request with proper params and return the edited object', function () {
        const params = {
            name: 'api test 2',
        }
        const objCode = 'PROJ',
            objID = 'foobar'

        return this.api.edit(objCode, objID, params).then(function (data) {
            const [url, opts] = fetchMock.lastCall('edit')
            should(opts.method).equal('PUT')
            should(url).endWith(objCode + '/' + objID)
            should((opts.headers as Headers).get('apiKey')).equal('testapikey')
            should(opts.body).containEql(JSON.stringify(params))

            should(data).have.properties(['ID', 'name', 'objCode'])
            should(data.objCode).equal(objCode)
            should(data.name).equal(params.name)
        })
    })
    it('should edit an object using the old api (passing updates property)', function () {
        const api = new Api({
            url: API_URL,
            version: '4.0',
        })
        const params = {
            updates: JSON.stringify({name: 'api test 2'}),
        }
        const objCode = 'PROJ',
            objID = 'foobar'

        return api.edit(objCode, objID, params).then(function (data) {
            const [url, opts] = fetchMock.lastCall('edit')
            should(opts.method).equal('PUT')
            should(url).endWith(objCode + '/' + objID)
            should(opts.body).equal('updates=' + encodeURIComponent(params.updates))

            should(data.name).equal('api test 2')
            should(data).have.properties(['ID', 'name', 'objCode'])
            should(data.objCode).equal(objCode)
        })
    })
})
