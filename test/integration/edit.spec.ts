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

describe('Edit', function () {

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

    beforeEach(function () {
        fetchMock.mock(
            `begin:${API_URL}/attask/api/`,
            require('../../fixtures/edit.json'),
            {
                name: 'edit'
            }
        )
    })

    it('makes a PUT request with proper params and return the edited object', function () {
        let params = {
            name: 'api test 2'
        }
        let objCode = 'PROJ',
            objID = 'foobar'

        return this.api.edit(objCode, objID, params).then(function (data) {
            let [url, opts] = fetchMock.lastCall('edit')
            should(url).endWith(objCode + '/' + objID)
            should(opts.method).equal('PUT')
            should(opts.body).containEql('name=' + encodeURIComponent('api test 2'))

            should(data).have.properties(['ID', 'name', 'objCode'])
            should(data.objCode).equal(objCode)
            should(data.name).equal(params.name)
        })
    })
})
