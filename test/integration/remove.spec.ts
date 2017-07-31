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

describe('Remove', function() {

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
                method: 'POST',
                name: 'create'
            }
        )
    })

    describe('successfully removes task', function() {
        beforeEach(function() {
            fetchMock.mock(
                `begin:${API_URL}/attask/api`,
                require('../../fixtures/remove.json'),
                {
                    method: 'DELETE',
                    name: 'remove'
                }
            )
        })

        it('creates and deletes task with proper params', function() {
            let objCode, objID
            return this.api.create('TASK', {projectID: 'foo'}).then( (createData) => {
                objCode = createData.objCode
                objID = createData.ID

                should(createData.objCode).equal('TASK')

                return this.api.remove(objCode, objID).then(function(removeData) {
                    const [url, opts] = fetchMock.lastCall('remove')
                    should(url).endWith(`${objCode}/${objID}`)
                    should(opts.method).equal('DELETE')
                    should(removeData)
                })
            })
        })
    })
    describe('unsuccessfully removes task', function() {
        beforeEach(function() {
            fetchMock.mock(
                `begin:${API_URL}/attask/api`,
                require('../../fixtures/removeFailure.json'),
                {
                    method: 'DELETE',
                    name: 'remove'
                }
            )
        })

        it('creates and attempts to delete task', function() {
            let objCode, objID
            return this.api.create('TASK', {projectID: 'foo'}).then( (createData) => {
                objCode = createData.objCode
                objID = createData.ID

                should(createData.objCode).equal('TASK')

                return this.api.remove(objCode, objID).catch(function(error) {
                    should(error).have.properties('message', 'status')
                    should(error).not.have.property('success')
                    const [url, opts] = fetchMock.lastCall('remove')
                    should(url).endWith(`${objCode}/${objID}`)
                    should(opts.method).equal('DELETE')
                })
            })
        })
    })
})
