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
import {Api} from '../../dist/index.es'
import fixture from '../../fixtures/edit.json'

const API_URL = 'http://foobar:8080'

describe('Edit', function() {

    afterEach(fetchMock.reset)
    afterEach(fetchMock.restore)

    beforeEach(function() {
        this.api = new Api({
            url: API_URL,
            apiKey: 'testapikey',
            alwaysUseGet: true
        })
    })
    afterEach(function() {
        this.api = undefined
    })

    beforeEach(function() {
        fetchMock.mock(
            `begin:${API_URL}/attask/api`,
            fixture,
            {
                name: 'edit'
            }
        )
    })

    it('makes a GET request with method=PUT and with proper params and return the edited object', function() {
        const params = {
            name: 'api test 2'
        }
        const objCode = 'PROJ',
            objID = 'foobar'

        return this.api.edit(objCode, objID, params).then(function(data) {
            const [url, opts] = fetchMock.lastCall('edit')
            should(opts.method).equal('GET')
            should(url).containEql(objCode + '/' + objID)
            should(opts.headers.get('apiKey')).equal('testapikey')
            should(opts.body).equal(null)
            should(url).containEql('updates=' + encodeURIComponent(JSON.stringify(params)))
            should(url).containEql('method=PUT')

            should(data).have.properties(['ID', 'name', 'objCode'])
            should(data.objCode).equal(objCode)
            should(data.name).equal(params.name)
        })
    })
})
